from PIL import Image, ImageDraw

CW, CH, G = 460, 240, 200          # canvas units, ground line at y=200
SS = 2
def _new():
    im = Image.new("RGBA", (CW * SS, CH * SS), (0, 0, 0, 0)); return im, ImageDraw.Draw(im, "RGBA")
P = lambda x, up: (x * SS, (G - up) * SS)
def box(d, x0, u0, x1, u1, fill, r=0):
    d.rounded_rectangle([P(x0, u1), P(x1, u0)], radius=r * SS, fill=fill)
def poly(d, pts, fill): d.polygon([P(*p) for p in pts], fill=fill)
def line(d, a, b, fill, w): d.line([P(*a), P(*b)], fill=fill, width=int(w * SS))
def ell(d, x0, u0, x1, u1, fill): d.ellipse([P(x0, u1), P(x1, u0)], fill=fill)
def wheel(d, cx, r, rim=(165, 170, 180, 255)):
    ell(d, cx - r, 0, cx + r, 2 * r, (22, 24, 28, 255)); ell(d, cx - r * .45, r * .55, cx + r * .45, r * 1.45, rim)
def shadow(d, x0, x1): ell(d, x0, -6, x1, 8, (0, 0, 0, 45))
GLASS = (140, 190, 225, 255); DARK = (36, 40, 48, 255); YEL = (246, 190, 28, 255)

def car(col):
    im, d = _new(); shadow(d, 0, 190)
    box(d, 0, 18, 190, 52, col, 10)
    poly(d, [(40, 52), (62, 82), (135, 82), (158, 52)], col)
    poly(d, [(50, 54), (66, 78), (96, 78), (96, 54)], GLASS); poly(d, [(100, 54), (100, 78), (132, 78), (150, 54)], GLASS)
    box(d, 182, 34, 190, 42, (255, 240, 180, 255)); box(d, 0, 34, 5, 42, (220, 60, 60, 255))
    wheel(d, 45, 17); wheel(d, 148, 17); return im

def bus():
    im, d = _new(); shadow(d, 0, 330)
    box(d, 0, 22, 330, 108, (222, 68, 58, 255), 10); box(d, 6, 104, 324, 110, (245, 245, 245, 255), 3)
    box(d, 0, 46, 330, 54, (250, 250, 250, 255))
    for x in range(14, 280, 44): box(d, x, 66, x + 36, 96, GLASS, 3)
    box(d, 298, 58, 326, 100, GLASS, 3); box(d, 324, 32, 330, 42, (255, 240, 180, 255)); box(d, 0, 32, 5, 42, (255, 90, 90, 255))
    wheel(d, 70, 19); wheel(d, 262, 19); return im

def bullock_cart():
    im, d = _new(); shadow(d, 20, 350)
    for off, col in [(-10, (196, 186, 170, 255)), (0, (236, 230, 220, 255))]:   # two oxen
        for lx in (272, 288, 312, 324): line(d, (lx + off, 52), (lx + off, 2), (110, 96, 84, 255), 5)
        ell(d, 255 + off, 48, 330 + off, 98, col); ell(d, 285 + off, 84, 310 + off, 110, col)
        ell(d, 322 + off, 62, 352 + off, 92, col)
        line(d, (338 + off, 90), (336 + off, 106), (90, 80, 70, 255), 3); line(d, (334 + off, 90), (326 + off, 104), (90, 80, 70, 255), 3)
        line(d, (257 + off, 85), (246 + off, 50), (90, 80, 70, 255), 3)
    line(d, (200, 54), (270, 76), (120, 84, 50, 255), 4)
    ell(d, 46, 58, 194, 112, (226, 192, 96, 255))                                    # hay load
    box(d, 40, 50, 200, 60, (130, 88, 52, 255), 2); box(d, 40, 60, 45, 84, (130, 88, 52, 255)); box(d, 195, 60, 200, 84, (130, 88, 52, 255))
    box(d, 188, 60, 212, 92, (235, 130, 50, 255), 4); ell(d, 192, 90, 208, 108, (200, 140, 100, 255))   # driver
    box(d, 186, 106, 214, 112, (245, 245, 245, 255), 3)
    cx, r = 112, 34
    ell(d, cx - r, 0, cx + r, 2 * r, (120, 80, 46, 255)); ell(d, cx - r + 6, 6, cx + r - 6, 2 * r - 6, (0, 0, 0, 0))
    for a in range(4):
        import math; t = a * math.pi / 4
        line(d, (cx + math.cos(t) * r, r + math.sin(t) * r), (cx - math.cos(t) * r, r - math.sin(t) * r), (120, 80, 46, 255), 3)
    ell(d, cx - 6, r - 6, cx + 6, r + 6, (80, 54, 32, 255)); return im

def jcb():
    im, d = _new(); shadow(d, 0, 320)
    line(d, (65, 60), (25, 125), YEL, 9); line(d, (25, 125), (8, 62), YEL, 8); poly(d, [(0, 38), (20, 36), (14, 68), (0, 64)], DARK)
    box(d, 60, 30, 250, 52, YEL, 4); box(d, 85, 52, 155, 120, YEL, 4); box(d, 92, 62, 148, 112, GLASS, 3); box(d, 80, 116, 160, 124, DARK, 2)
    box(d, 155, 52, 235, 88, YEL, 6); box(d, 210, 88, 216, 112, DARK)
    line(d, (235, 70), (290, 50), YEL, 9); poly(d, [(280, 28), (312, 28), (320, 70), (282, 62)], DARK)
    wheel(d, 95, 30, YEL); wheel(d, 225, 20, YEL)
    out = Image.new('RGBA', im.size, (0, 0, 0, 0)); out.paste(im, (16 * SS, 0)); return out

def bulldozer():
    im, d = _new(); shadow(d, 20, 250)
    box(d, 30, 0, 210, 45, DARK, 22)
    for x in (55, 120, 185): ell(d, x - 15, 7, x + 15, 37, (110, 116, 126, 255))
    box(d, 55, 45, 205, 72, YEL, 4); box(d, 120, 72, 205, 95, YEL, 5); box(d, 65, 72, 125, 125, YEL, 4)
    box(d, 72, 82, 118, 118, GLASS, 3); box(d, 60, 122, 130, 130, DARK, 2); box(d, 190, 95, 195, 125, DARK)
    line(d, (205, 56), (228, 50), DARK, 7); poly(d, [(215, 14), (242, 10), (248, 96), (222, 100)], (90, 96, 106, 255)); return im

def crane():
    im, d = _new(); shadow(d, 0, 340)
    line(d, (140, 64), (410, 150), YEL, 15); line(d, (140, 74), (410, 150), (190, 140, 20, 255), 3)
    for t in (0.2, 0.4, 0.6, 0.8): line(d, (140 + 270 * t, 64 + 86 * t - 7), (140 + 270 * t, 64 + 86 * t + 7), (190, 140, 20, 255), 2)
    line(d, (410, 150), (410, 92), (30, 30, 30, 255), 2); ell(d, 404, 82, 416, 94, (30, 30, 30, 255))
    box(d, 0, 22, 340, 46, (232, 108, 40, 255), 3); box(d, 110, 46, 232, 70, (210, 90, 30, 255), 4)
    box(d, 268, 46, 340, 104, (232, 108, 40, 255), 6); box(d, 306, 62, 334, 96, GLASS, 3); box(d, 336, 30, 342, 38, (255, 240, 180, 255))
    for x in (36, 76, 116, 232, 298): wheel(d, x, 18)
    return im
