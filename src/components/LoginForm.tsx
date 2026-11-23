import React, { useState, type FormEvent } from 'react';
import { Mail, LockKeyhole, Eye, EyeOff } from 'lucide-react';
import { signIn, AuthError } from '@/services/authService';
import { ROUTES } from '@/constants';
import { Button } from './Button';
import { Input } from './Input';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LoginForm: React.FC = () => {
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
    if (!EMAIL_REGEX.test(email.trim())) return setError('Enter a valid email address.');
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

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md shrink-0">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
        <p className="text-sm text-gray-500 mt-1">
          Enter your credentials to access your fleet dashboard.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="email"
          label="Email address"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-5 h-5 text-gray-400 shrink-0" />}
        />

        <Input
          id="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<LockKeyhole className="w-5 h-5 text-gray-400 shrink-0" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          }
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer text-gray-600 select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
            />
            Remember me
          </label>
          <a
            href={ROUTES.forgotPassword}
            className="text-black font-medium hover:underline"
          >
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          isLoading={loading}
          className="w-full py-3 mt-2"
        >
          Sign In
        </Button>
      </form>
    </div>
  );
};
