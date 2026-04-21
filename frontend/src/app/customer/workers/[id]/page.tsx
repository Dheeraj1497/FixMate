"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import LoadingState from '@/components/LoadingState';
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function WorkerProfile({ params }: { params: { id: string } }) {
  const [worker, setWorker] = useState<any>(null);
  const [formData, setFormData] = useState({
    service_id: '', description: '', scheduled_at: '', location: ''
  });
  const [images, setImages] = useState<File[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    api.get(`/workers/${params.id}`).then(res => setWorker(res.data));
  }, [params.id]);

  useEffect(() => {
    setIsAuthed(!!Cookies.get('token'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const payload = new FormData();
      payload.append('job[worker_id]', String(worker.user_id));
      payload.append('job[service_id]', String(formData.service_id));
      payload.append('job[description]', formData.description);
      payload.append('job[scheduled_at]', formData.scheduled_at);
      payload.append('job[location]', formData.location);

      images.forEach((file) => {
        payload.append('job[images][]', file);
      });

      await api.post('/jobs', payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Job requested successfully.');
      router.push('/customer/dashboard');
    } catch (err: any) {
      setMessage(err.response?.data?.errors?.join(', ') || 'Failed to request job');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
  };

  if (!worker) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <LoadingState label="Loading profile" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 grid gap-8 md:grid-cols-2">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Professional</p>
            <h1 className="text-3xl font-display font-semibold text-white">
              {worker.user.first_name} {worker.user.last_name}
            </h1>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${worker.availability ? 'bg-emerald-400/10 text-emerald-200 border-emerald-400/30' : 'bg-rose-400/10 text-rose-200 border-rose-400/30'
            }`}>
            {worker.availability ? 'Available' : 'Busy'}
          </span>
        </div>
        <p className="text-neutral-300 mb-6">{worker.about}</p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-4">
            <p className="text-xs text-neutral-400">Location</p>
            <p className="font-semibold text-white">{worker.city?.name}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-4">
            <p className="text-xs text-neutral-400">Experience</p>
            <p className="font-semibold text-white">{worker.experience} Years</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-4">
            <p className="text-xs text-neutral-400">Hourly Rate</p>
            <p className="font-semibold text-white">₹{worker.hourly_rate}/hr</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-4">
            <p className="text-xs text-neutral-400">Completed Jobs</p>
            <p className="font-semibold text-white">{worker.total_completed_jobs || 0}</p>
          </div>
        </div>

        <h3 className="font-semibold text-lg mb-3 text-white">Offered Services</h3>
        <div className="flex flex-wrap gap-2">
          {worker.services?.map((s: any) => (
            <span key={s.id} className="bg-emerald-400/10 text-emerald-200 border border-emerald-400/30 px-3 py-1.5 rounded-full text-sm">
              {s.name}
            </span>
          ))}
        </div>
      </div>

      {isAuthed ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-display font-semibold text-white mb-6">Book this Professional</h2>
          {message && (
            <div className="bg-emerald-400/10 text-emerald-200 p-3 rounded-xl mb-4 text-sm border border-emerald-400/30">
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">Select Service</label>
              <select
                required
                value={formData.service_id}
                onChange={e => setFormData({ ...formData, service_id: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-neutral-900/60 text-neutral-100 shadow-sm focus:border-emerald-400 focus:ring-emerald-400 p-3"
              >
                <option value="">-- Choose a service --</option>
                {worker.services?.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">Problem Description</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-neutral-900/60 text-neutral-100 shadow-sm focus:border-emerald-400 focus:ring-emerald-400 p-3"
                placeholder="Describe the issue..."
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">Service Location (Address)</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-neutral-900/60 text-neutral-100 shadow-sm focus:border-emerald-400 focus:ring-emerald-400 p-3"
                placeholder="Full address"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">Preferred Schedule</label>
              <input
                type="datetime-local"
                required
                value={formData.scheduled_at}
                onChange={e => setFormData({ ...formData, scheduled_at: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-neutral-900/60 text-neutral-100 shadow-sm focus:border-emerald-400 focus:ring-emerald-400 p-3"
              />
              <p className="text-xs text-neutral-500 mt-2">Time is interpreted in IST for service scheduling.</p>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">Problem Images (Optional)</label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                multiple
                onChange={handleImageChange}
                className="w-full rounded-xl border border-white/10 bg-neutral-900/60 text-neutral-100 shadow-sm focus:border-emerald-400 focus:ring-emerald-400 p-3"
              />
              {images.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {images.map((file) => (
                    <div key={file.name} className="text-xs text-neutral-300 border border-white/10 rounded-xl p-2 bg-neutral-900/40 truncate" title={file.name}>
                      {file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !worker.availability}
              className="w-full rounded-full border border-emerald-400/40 bg-emerald-400/15 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : worker.availability ? 'Request Job' : 'Worker is currently busy'}
            </button>
          </form>
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 mb-4 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-2xl">
            🔒
          </div>
          <h2 className="text-xl font-display font-semibold text-white mb-2">Sign in to book</h2>
          <p className="text-neutral-400 text-sm max-w-sm mb-6">
            You need to be logged into a customer account to send job requests and book professionals.
          </p>
          <Link href="/login" className="rounded-full border border-emerald-400/40 bg-emerald-400/15 px-6 py-2.5 text-sm font-semibold text-emerald-200 hover:bg-emerald-400/25 transition">
            Log In or Register
          </Link>
        </div>
      )}
    </div>
  );
}
