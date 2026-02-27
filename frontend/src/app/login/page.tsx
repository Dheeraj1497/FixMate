"use client";
import { useState, Suspense } from 'react';
import api from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import LoadingState from '@/components/LoadingState';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { user: { email, password } });
      const token = res.headers.authorization?.split(' ')[1];
      if (token) {
        Cookies.set('token', token, { expires: 1 });
        Cookies.set('userRole', res.data.user.role);

        if (res.data.user.role === 'worker') {
          window.location.href = '/worker/dashboard';
        } else {
          window.location.href = '/customer/dashboard';
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-16">
      <div className="absolute inset-0">
        <div className="absolute -top-20 right-0 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-glow backdrop-blur">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Welcome back</p>
          <h2 className="mt-3 text-3xl font-display font-semibold text-white">Sign in to FixMate</h2>
          <p className="mt-2 text-sm text-neutral-400">Enter your details to continue.</p>
        </div>
        {registered && (
          <div className="bg-emerald-400/10 text-emerald-200 p-3 rounded-xl mb-4 text-sm text-center border border-emerald-400/30">
            Registration successful! Please login.
          </div>
        )}
        {error && (
          <div className="bg-rose-400/10 text-rose-200 p-3 rounded-xl mb-4 text-sm border border-rose-400/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="block w-full rounded-xl border border-white/10 bg-neutral-900/60 text-neutral-100 shadow-sm focus:border-emerald-400 focus:ring-emerald-400 p-3"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="block w-full rounded-xl border border-white/10 bg-neutral-900/60 text-neutral-100 shadow-sm focus:border-emerald-400 focus:ring-emerald-400 p-3 pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-full border border-emerald-400/40 bg-emerald-400/15 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/25"
          >
            Sign In
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-neutral-400">
          Don't have an account?{' '}
          <Link href="/register" className="text-emerald-200 font-semibold hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-6 py-16"><LoadingState label="Loading" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
