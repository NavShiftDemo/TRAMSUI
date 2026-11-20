import { useState, type FormEvent } from 'react';
import {
  Truck, Mail, LockKeyhole, Eye, EyeOff, Loader2,
  CarFront, MapPin, BarChart3,
} from 'lucide-react';
import { signIn, AuthError } from './lib/authService';

// Point these at the project's existing routes.
const ROUTES = {
  dashboard: '/dashboard',
  register: '/register',
  forgotPassword: '/forgot-password',
};
const APP_NAME = 'Fleet Manager'; // replace with the project's existing app name
// Replace with a transport asset already in the project, or a hosted URL.
const VIDEO_SRC = '/videos/fleet-highway.mp4';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const cardH =
  'min-h-[calc(100vh-24px)] sm:min-h-[calc(100vh-32px)] md:min-h-[calc(100vh-48px)]';
const inputWrap =
  'flex items-center gap-2 border border-gray-200 rounded-xl px-3 bg-white transition focus-within:border-black focus-within:ring-2 focus-within:ring-black/10';
const inputCls =
  'w-full py-3 text-sm text-black placeholder:text-gray-400 bg-transparent outline-none';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) return setError('Enter your email address.');
    if (!EMAIL_RE.test(email.trim())) return setError('Enter a valid email address.');
    if (!password) return setError('Enter your password.');

    setLoading(true);
    try {
      await signIn({ email: email.trim(), password, rememberMe });
      window.location.assign(ROUTES.dashboard);
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: CarFront, label: 'Vehicle Management' },
    { icon: MapPin, label: 'Real-Time Tracking' },
    { icon: BarChart3, label: 'Smart Fleet Insights' },
  ];

  return (
    <div className="min-h-screen bg-white p-3 sm:p-4 md:p-6">
      <div className={`relative bg-gray-900 rounded-2xl sm:rounded-3xl overflow-hidden ${cardH} lg:h-[calc(100vh-48px)]`}>
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={VIDEO_SRC}
          poster="/videos/poster.jpg" autoPlay muted loop playsInline
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20" />

        <div className={`relative z-10 flex flex-col ${cardH} lg:h-full p-4 sm:p-6 md:p-8 gap-6`}>
          {/* Navbar */}
          <nav className="bg-white/60 backdrop-blur-md rounded-2xl shadow-sm pl-3 sm:pl-4 pr-2 py-2 w-full sm:w-auto sm:self-start flex items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2">
              <Truck className="w-8 h-8 p-1.5 text-gray-900" aria-hidden />
              <span className="text-gray-900 font-semibold text-base">{APP_NAME}</span>
            </div>
            <div className="hidden sm:flex items-center gap-5 text-sm text-gray-700">
              {['Dashboard', 'Features', 'About', 'Contact'].map((l) => (
                <a key={l} href={l === 'Dashboard' ? ROUTES.dashboard : `#${l.toLowerCase()}`} className="hover:text-black transition-colors">
                  {l}
                </a>
              ))}
            </div>
            <a
              href={ROUTES.register}
              className="ml-auto sm:ml-0 bg-black text-white text-sm font-medium px-4 sm:px-5 py-2 rounded-xl hover:bg-gray-800 transition-colors"
            >
              Create Account
            </a>
          </nav>

          <div className="flex-1" />

          {/* Headline + form */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="text-white shrink-0 lg:max-w-lg xl:max-w-2xl">
              <h1 className="text-3xl sm:text-4xl xl:text-5xl font-medium leading-tight drop-shadow-lg">
                Manage your fleet.
                <br />
                Drive your business <span className="font-serif-accent">forward</span>.
              </h1>
              <p className="mt-4 text-white/85 text-sm sm:text-base leading-relaxed max-w-lg [text-shadow:0_1px_6px_rgba(0,0,0,0.5)]">
                One platform to manage vehicles, drivers, trips, expenses and your entire transport operation.
              </p>
              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/90">
                {features.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2">
                    <Icon className="w-4 h-4" aria-hidden /> {label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full lg:w-[min(440px,45%)] shrink-0">
              <form
                onSubmit={handleSubmit}
                noValidate
                className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden p-4 sm:p-6 flex flex-col gap-4"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-black tracking-tight">Welcome Back</h2>
                  <p className="text-sm text-gray-500">Sign in to access your fleet dashboard.</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-sm font-medium text-gray-900">Email Address</label>
                  <div className={inputWrap}>
                    <Mail className="w-4 h-4 text-gray-400" aria-hidden />
                    <input
                      id="email" type="email" autoComplete="email" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address" className={inputCls}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="password" className="text-sm font-medium text-gray-900">Password</label>
                  <div className={inputWrap}>
                    <LockKeyhole className="w-4 h-4 text-gray-400" aria-hidden />
                    <input
                      id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password" className={inputCls}
                    />
                    <button
                      type="button" onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="p-1 text-gray-400 hover:text-black transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                    <input
                      type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 accent-black"
                    />
                    Remember me
                  </label>
                  <a href={ROUTES.forgotPassword} className="text-gray-500 hover:text-black transition-colors">
                    Forgot password?
                  </a>
                </div>

                {error && (
                  <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>
                )}

                <button
                  type="submit" disabled={loading}
                  className="w-full bg-black text-white text-sm font-semibold py-3 rounded-2xl hover:bg-gray-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>

                <p className="text-sm text-gray-500 text-center">
                  Don&rsquo;t have an account?{' '}
                  <a href={ROUTES.register} className="font-semibold text-black hover:underline">Create an account</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
