import math, random, subprocess, sys
import vehicles as V
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

W, H, FPS, T = 1280, 720, 30, 480
S = 2
random.seed(11)
TAU = 2 * math.pi

def new_layer(s=S): return Image.new("RGBA", (W * s, H * s), (0, 0, 0, 0))
def down(im): return im.resize((W, H), Image.LANCZOS)
def lerp(a, b, t): return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

# ---------- sky ----------
arr = np.zeros((H, W, 3), np.uint8)
stops = [(0.0, (30, 100, 200)), (0.35, (70, 145, 225)), (0.58, (150, 200, 240)), (0.7, (215, 232, 240))]
for y in range(H):
    t = y / H
    for (t0, c0), (t1, c1) in zip(stops, stops[1:]):
        if t0 <= t <= t1: arr[y, :] = lerp(c0, c1, (t - t0) / (t1 - t0)); break
    else: arr[y, :] = stops[-1][1]
sky = Image.fromarray(arr).convert("RGBA")

# ---------- clouds (puffy, shaded, periodic) ----------
def clouds():
    im = new_layer(4); dr = ImageDraw.Draw(im, "RGBA"); s = 4
    for _ in range(8):
        cx, cy = random.randint(0, W), random.randint(30, 210)
        sc = random.uniform(0.45, 0.95)
        puffs = [(random.uniform(-90, 90) * sc, random.uniform(-25, 15) * sc, random.uniform(28, 55) * sc) for _ in range(9)]
        for dx in (-W, 0, W):
            for ox, oy, r in puffs:   # shadow base
                x, y = (cx + ox + dx) * s, (cy + oy + 9) * s
                dr.ellipse((x - r * s, y - r * s * .8, x + r * s, y + r * s * .8), fill=(170, 195, 230, 200))
            for ox, oy, r in puffs:   # lit top
                x, y = (cx + ox + dx) * s, (cy + oy) * s
                dr.ellipse((x - r * s, y - r * s * .85, x + r * s, y + r * s * .8), fill=(255, 255, 255, 235))
    im = im.filter(ImageFilter.GaussianBlur(7))
    return im.resize((W, H), Image.LANCZOS)

# ---------- mountains ----------
def ridge(x, comps, ph):
    v = 0
    for (k, a), p in zip(comps, ph):
        v += a * (1 - abs(math.sin(math.pi * k * x / W + p)))   # ridged => peaks
    return v

def mountains(base, comps, body, shade, snow_depth):
    im = new_layer(); dr = ImageDraw.Draw(im, "RGBA")
    ph = [random.random() * 3 for _ in comps]
    top = []
    for x in range(0, W * S + 1, 2):
        top.append(base - ridge(x / S, comps, ph))
    pts = [(0, H * S)] + [(i * 2, y * S) for i, y in enumerate(top)] + [(W * S, H * S)]
    dr.polygon(pts, fill=body)
    # lit / shadow faces by slope, drawn as thin columns (no overlap artefacts)
    lit = tuple(min(255, c + 28) for c in body[:3]) + (255,)
    for i in range(0, len(top) - 4):
        slope = top[i + 3] - top[i]
        col = shade if slope > 0 else lit
        dr.line([(i * 2, top[i] * S), (i * 2, (base + 60) * S)], fill=col, width=2)
    # snow caps
    mn = min(top)
    for i in range(0, len(top), 2):
        y = top[i]
        depth = max(0, (base - y) - snow_depth[0]) * snow_depth[1]
        if depth > 0:
            j = 1.0 + 0.18 * math.sin(i * 0.09)
            dr.polygon([(i * 2, y * S), ((i + 2) * 2, top[min(i + 2, len(top) - 1)] * S),
                        ((i + 2) * 2, (top[min(i + 2, len(top) - 1)] + depth * j) * S), (i * 2, (y + depth * j) * S)],
                       fill=(244, 247, 252, 255))
    return down(im.filter(ImageFilter.GaussianBlur(1.2)))

# ---------- hills + river + trees ----------
def hills_river():
    im = new_layer(); dr = ImageDraw.Draw(im, "RGBA")
    ph = [random.random() * 6 for _ in range(3)]
    def hy(x): return 352 + 12 * math.sin(TAU * 2 * x / W + ph[0]) + 6 * math.sin(TAU * 5 * x / W + ph[1]) + 3 * math.sin(TAU * 11 * x / W + ph[2])
    top = [(x, hy(x / S) * S) for x in range(0, W * S + 1, 2)]
    # base fill gradient bands (green to yellow-green)
    dr.polygon([(0, H * S)] + top + [(W * S, H * S)], fill=(120, 165, 70, 255))
    for k, col in enumerate([(150, 185, 70, 255), (190, 190, 60, 255)]):
        off = 14 + k * 16
        dr.polygon([(0, H * S)] + [(x, y + off * S) for x, y in top] + [(W * S, H * S)], fill=col)
    # river ribbon
    p = random.random() * 6
    for width, col in [(16, (88, 150, 205, 255)), (9, (140, 195, 235, 255))]:
        pts = [(x, (398 + 9 * math.sin(TAU * 2 * x / (W * S) + p) + 4 * math.sin(TAU * 4 * x / (W * S) + p * 2)) * S) for x in range(0, W * S + 1, 4)]
        dr.line(pts, fill=col, width=width * S // 2, joint="curve")
    # trees
    for _ in range(140):
        x = random.randint(0, W); y = hy(x) + random.randint(4, 40); r = random.uniform(3, 7)
        for dx in (-W, 0, W):
            dr.ellipse(((x + dx - r) * S, (y - r) * S, (x + dx + r) * S, (y + r * .9) * S), fill=(46, 110, 60, 255))
    return down(im.filter(ImageFilter.GaussianBlur(.8)))

# ---------- flowery meadow ----------
FLOWERS = [(255, 255, 255), (255, 210, 80), (255, 150, 40), (240, 120, 200), (170, 120, 220), (255, 235, 140)]
def meadow(y0, y1, n, rmin, rmax, blur=0, base_cols=((200, 195, 70), (235, 160, 50))):
    im = new_layer(); dr = ImageDraw.Draw(im, "RGBA")
    for y in range(y0 * S, y1 * S, 2):
        c = lerp(base_cols[0], base_cols[1], (y - y0 * S) / ((y1 - y0) * S))
        dr.rectangle((0, y, W * S, y + 2), fill=c + (255,))
    for _ in range(n):
        x = random.randint(0, W); y = random.randint(y0, y1); r = random.uniform(rmin, rmax)
        c = random.choice(FLOWERS) + (random.randint(170, 255),)
        for dx in (-W, 0, W):
            dr.ellipse(((x + dx - r) * S, (y - r) * S, (x + dx + r) * S, (y + r) * S), fill=c)
    if blur: im = im.filter(ImageFilter.GaussianBlur(blur * S))
    return down(im)

# ---------- road ----------
road = Image.new("RGBA", (W, H), (0, 0, 0, 0)); rd = ImageDraw.Draw(road)
rd.rectangle((0, 428, W, 526), fill=(84, 92, 106, 255))
rd.rectangle((0, 526, W, 542), fill=(150, 158, 168, 255))
rd.rectangle((0, 526, W, 529), fill=(200, 206, 214, 255))
rd.rectangle((0, 542, W, 662), fill=(74, 82, 96, 255))
rd.rectangle((0, 428, W, 431), fill=(235, 238, 242, 255))
rd.rectangle((0, 659, W, 662), fill=(235, 238, 242, 255))

def dashes(img, y, off):
    dr = ImageDraw.Draw(img); o = int(off) % 160
    for x in range(-160, W + 160, 160): dr.rectangle((x - o, y, x - o + 80, y + 4), fill=(240, 242, 245, 255))
def posts(img, off):
    dr = ImageDraw.Draw(img); o = int(off) % 80
    dr.rectangle((0, 420, W, 424), fill=(190, 198, 208, 255))
    for x in range(-80, W + 80, 80): dr.rectangle((x - o, 420, x - o + 5, 432), fill=(150, 158, 170, 255))

# ---------- trucks ----------
def make_truck(trailer, cab, stripe):
    s = 2; w, h = 410, 150
    im = Image.new("RGBA", (w * s, h * s), (0, 0, 0, 0)); dr = ImageDraw.Draw(im, "RGBA"); X = lambda v: v * s
    dr.ellipse((X(0), X(120), X(400), X(140)), fill=(0, 0, 0, 40))
    dr.rounded_rectangle((X(0), X(0), X(300), X(100)), radius=X(7), fill=trailer)
    dr.rectangle((X(0), X(62), X(300), X(72)), fill=stripe)
    dr.rectangle((X(300), X(80), X(312), X(96)), fill=(40, 44, 52, 255))
    dr.polygon([(X(312), X(100)), (X(312), X(28)), (X(360), X(28)), (X(396), X(62)), (X(396), X(100))], fill=cab)
    dr.polygon([(X(346), X(34)), (X(360), X(34)), (X(386), X(62)), (X(346), X(62))], fill=(120, 170, 210, 255))
    dr.rectangle((X(0), X(92), X(396), X(100)), fill=(34, 38, 46, 255))
    dr.rectangle((X(390), X(80), X(396), X(88)), fill=(255, 240, 180, 255))
    dr.rectangle((X(0), X(78), X(4), X(86)), fill=(220, 60, 60, 255))
    for cx in (44, 84, 340, 372):
        dr.ellipse((X(cx - 17), X(97), X(cx + 17), X(131)), fill=(22, 24, 28, 255))
        dr.ellipse((X(cx - 7), X(107), X(cx + 7), X(121)), fill=(160, 166, 176, 255))
    return im
trk = [make_truck((250, 250, 252, 255), (30, 110, 130, 255), (240, 150, 50, 255)),
       make_truck((235, 240, 246, 255), (200, 70, 60, 255), (50, 120, 170, 255)),
       make_truck((255, 255, 255, 255), (50, 70, 120, 255), (220, 225, 232, 255))]
SPAN = 2600
SPR = {"truck0": (trk[0], 131), "truck1": (trk[1], 131), "truck2": (trk[2], 131),
       "bus": (V.bus(), 200), "car_teal": (V.car((40, 150, 160, 255)), 200), "car_red": (V.car((210, 70, 70, 255)), 200),
       "bullock": (V.bullock_cart(), 200), "jcb": (V.jcb(), 200), "dozer": (V.bulldozer(), 200), "crane": (V.crane(), 200)}
Q = SPAN // 4
fleet = [("bus", 522, 0.72, +1, 1, 0), ("car_teal", 522, 0.72, +1, 1, Q), ("bullock", 522, 0.72, +1, 1, 2 * Q), ("jcb", 522, 0.72, +1, 1, 3 * Q),
         ("truck2", 655, 0.95, -1, 2, 300), ("crane", 655, 0.95, -1, 2, 300 + Q), ("dozer", 655, 0.95, -1, 2, 300 + 2 * Q), ("car_red", 655, 0.95, -1, 2, 300 + 3 * Q)]
cache = {}
def spr(key, sc, flip):
    k = (key, sc, flip)
    if k not in cache:
        base = SPR[key][0]
        im = base.resize((int(base.width / 2 * sc), int(base.height / 2 * sc)), Image.LANCZOS)
        cache[k] = im.transpose(Image.FLIP_LEFT_RIGHT) if flip else im
    return cache[k]

# ---------- bubbles ----------
def bubble(r):
    s = 4; n = int(r * 2 * s + 8)
    im = Image.new("RGBA", (n, n), (0, 0, 0, 0)); d = ImageDraw.Draw(im, "RGBA"); c = n // 2; R = r * s
    d.ellipse((c - R, c - R, c + R, c + R), fill=(190, 225, 255, 55), outline=(255, 255, 255, 200), width=max(2, int(s * 1.2)))
    d.ellipse((c - R * .62, c - R * .62, c + R * .62, c + R * .62), outline=(180, 240, 220, 70), width=s)
    d.arc((c - R * .75, c - R * .75, c + R * .75, c + R * .75), 200, 260, fill=(255, 255, 255, 235), width=max(3, int(s * 1.6)))
    d.ellipse((c + R * .3, c + R * .35, c + R * .5, c + R * .5), fill=(255, 255, 255, 150))
    return im.resize((n // s, n // s), Image.LANCZOS)
bubs = []
for _ in range(14):
    r = random.choice([6, 8, 10, 13, 17, 22, 28])
    bubs.append(dict(img=bubble(r), x=random.randint(0, W), y0=random.randint(0, H + 120), n=random.choice([1, 1, 2]),
                     amp=random.randint(10, 40), cyc=random.choice([1, 2, 3]), ph=random.random() * TAU))

L_cloud = clouds()
L_far = mountains(338, [(3, 92), (7, 38), (13, 12)], (150, 172, 210, 255), (118, 140, 184, 255), (40, 0.8))
L_near = mountains(360, [(2, 110), (5, 44), (11, 14)], (96, 118, 158, 255), (64, 84, 124, 255), (50, 0.9))
L_hill = hills_river()
L_verge = meadow(398, 428, 500, 1.2, 3.2, base_cols=((170, 190, 70), (225, 170, 55)))
L_fg = meadow(670, 720, 90, 6, 16, blur=3, base_cols=((230, 160, 50), (240, 150, 60)))
# make fg base transparent: keep only blurred flower bokeh + soft orange gradient
a = np.array(L_fg); a[..., 3] = np.minimum(a[..., 3], np.linspace(0, 255, H)[:, None].astype(np.uint8) * 0 + 0 + a[..., 3]); L_fg = Image.fromarray(a)

def sh(f, m): return int(round(W * m * f / T)) % W
ROAD_SPEED = W * 4 / T   # 10.667 px/frame

def frame(f):
    img = sky.copy()
    for L, m in [(L_cloud, 1), (L_far, 1), (L_near, 2), (L_hill, 3), (L_verge, 4)]:
        s = sh(f, m); img.paste(L, (-s, 0), L); img.paste(L, (W - s, 0), L)
    img.paste(road, (0, 0), road)
    off = ROAD_SPEED * f
    posts(img, off); dashes(img, 473, off); dashes(img, 602, off)
    for (i, by, sc, dirn, n, o) in fleet:
        sp = spr(i, sc, dirn < 0)
        x = int((o + dirn * SPAN * n * f / T) % SPAN - 460)
        bob = 1.0 * sc * math.sin(TAU * f * 6 / T + len(i))
        img.paste(sp, (x, int(by - SPR[i][1] * sc + bob)), sp)
    s = sh(f, 8); img.paste(L_fg, (-s, 0), L_fg); img.paste(L_fg, (W - s, 0), L_fg)
    for b in bubs:
        y = (b["y0"] - (H + 120) * b["n"] * f / T) % (H + 120) - 60
        x = b["x"] + b["amp"] * math.sin(TAU * b["cyc"] * f / T + b["ph"])
        im = b["img"]; img.paste(im, (int(x - im.width / 2), int(y - im.height / 2)), im)
    return img.convert("RGB")

ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
    "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "23", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", sys.argv[1]], stdin=subprocess.PIPE)
for f in range(T):
    im = frame(f)
    if f == 100: im.save("poster2.jpg", quality=90)
    ff.stdin.write(im.tobytes())
ff.stdin.close(); ff.wait()
