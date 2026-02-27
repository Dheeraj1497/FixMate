"use client";
import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import Cookies from 'js-cookie';

export default function Register() {
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', password: '', password_confirmation: '', role: 'customer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { user: formData });

      const loginRes = await api.post('/auth/login', { user: { email: formData.email, password: formData.password } });
      const token = loginRes.headers.authorization?.split(' ')[1];

      if (token) {
        Cookies.set('token', token, { expires: 1 });
        Cookies.set('userRole', loginRes.data.user.role);

        if (loginRes.data.user.role === 'worker') {
          window.location.href = '/worker/profile';
        } else {
          window.location.href = '/customer/dashboard';
        }
      } else {
        router.push('/login?registered=true');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.errors?.join(', ') || 'Something went wrong');
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-16">
      <div className="absolute inset-0">
        <div className="absolute -top-20 left-0 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 shadow-glow backdrop-blur">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Get started</p>
          <h2 className="mt-3 text-3xl font-display font-semibold text-white">Create an account</h2>
          <p className="mt-2 text-sm text-neutral-400">Join FixMate India today.</p>
        </div>
        {error && (
          <div className="bg-rose-400/10 text-rose-200 p-3 rounded-xl mb-4 text-sm border border-rose-400/30">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">First Name</label>
              <input
                type="text"
                required
                value={formData.first_name}
                onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-neutral-900/60 text-neutral-100 shadow-sm focus:border-emerald-400 focus:ring-emerald-400 p-3"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">Last Name</label>
              <input
                type="text"
                required
                value={formData.last_name}
                onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-neutral-900/60 text-neutral-100 shadow-sm focus:border-emerald-400 focus:ring-emerald-400 p-3"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">Email address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-neutral-900/60 text-neutral-100 shadow-sm focus:border-emerald-400 focus:ring-emerald-400 p-3"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-neutral-900/60 text-neutral-100 shadow-sm focus:border-emerald-400 focus:ring-emerald-400 p-3 pr-10"
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
          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.password_confirmation}
                onChange={e => setFormData({ ...formData, password_confirmation: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-neutral-900/60 text-neutral-100 shadow-sm focus:border-emerald-400 focus:ring-emerald-400 p-3 pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-200"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-3">I am a...</label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-neutral-900/60 px-4 py-3">
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={formData.role === 'customer'}
                  onChange={() => setFormData({ ...formData, role: 'customer' })}
                  className="h-4 w-4 text-emerald-400 focus:ring-emerald-400 border-white/20"
                />
                <span className="text-sm text-neutral-200">Customer (Looking for service)</span>
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-neutral-900/60 px-4 py-3">
                <input
                  type="radio"
                  name="role"
                  value="worker"
                  checked={formData.role === 'worker'}
                  onChange={() => setFormData({ ...formData, role: 'worker' })}
                  className="h-4 w-4 text-emerald-400 focus:ring-emerald-400 border-white/20"
                />
                <span className="text-sm text-neutral-200">Worker (Providing service)</span>
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-full border border-emerald-400/40 bg-emerald-400/15 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/25"
          >
            Register
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-neutral-400">
          Already have an account?{' '}
          <Link href="/login" className="text-emerald-200 font-semibold hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
}
