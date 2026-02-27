"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import LoadingState from '@/components/LoadingState';
import EmptyState from '@/components/EmptyState';
import Link from 'next/link';
import Cookies from 'js-cookie';

export default function JobDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);
  const [role, setRole] = useState<string>('');

  useEffect(() => {
    const token = Cookies.get('token');
    setIsAuthed(!!token);
    if (!token) return;

    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/jobs/${params.id}`);
        setJob(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Could not load job details');
      } finally {
        setLoading(false);
      }
    };

    api.get('/users/me')
      .then((res) => {
        setRole(res.data?.role || '');
      })
      .catch(() => setRole(''));

    fetchJob();
  }, [params.id]);

  if (!isAuthed) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <EmptyState
          title="Please sign in"
          description="Login to view job details and uploaded images."
          actionLabel="Login"
          actionHref="/login"
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <LoadingState label="Loading job details" />
      </div>
    );
  }

  if (!job || error) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <EmptyState
          title="Job not found"
          description={error || 'The job you are looking for is not available.'}
          actionLabel="Back to Dashboard"
          actionHref="/customer/dashboard"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Job details</p>
          <h1 className="text-3xl font-display font-semibold text-white">
            {job.service?.name || 'Service'}
          </h1>
        </div>
        <button
          onClick={() => router.back()}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-200 hover:text-white hover:border-emerald-400/40 transition"
        >
          Back
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Request Details</h2>
          <div className="mt-4 space-y-2 text-sm text-neutral-300">
            <p><span className="text-neutral-400">Customer:</span> {job.customer?.first_name} {job.customer?.last_name}</p>
            <p><span className="text-neutral-400">Worker:</span> {job.worker?.first_name} {job.worker?.last_name}</p>
            <p><span className="text-neutral-400">Scheduled:</span> {new Date(job.scheduled_at).toLocaleString()}</p>
            <p><span className="text-neutral-400">Location:</span> {job.location}</p>
            <p className="mt-3 text-neutral-200">{job.description}</p>
          </div>
          <div className="mt-4">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${
              job.status === 'pending'
                ? 'bg-yellow-400/10 text-yellow-200 border-yellow-400/30'
                : job.status === 'accepted'
                  ? 'bg-cyan-400/10 text-cyan-200 border-cyan-400/30'
                  : job.status === 'completed'
                    ? 'bg-emerald-400/10 text-emerald-200 border-emerald-400/30'
                    : 'bg-rose-400/10 text-rose-200 border-rose-400/30'
            }`}>
              {job.status}
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
          <div className="mt-4 flex flex-col gap-3">
            <Link
              href={role === 'worker' ? '/worker/dashboard' : '/customer/dashboard'}
              className="rounded-full border border-emerald-400/40 bg-emerald-400/15 px-4 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-400/25 transition"
            >
              Go to Dashboard
            </Link>
            {role !== 'worker' && (
              <Link
                href="/customer/workers"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-200 hover:text-white hover:border-emerald-400/40 transition"
              >
                Find Professionals
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Uploaded Photos</h2>
        {job.images && job.images.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {job.images.map((src: string) => (
              <div key={src} className="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/40">
                <img src={src} alt="Job upload" className="h-48 w-full object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-neutral-400">No photos uploaded for this job.</p>
        )}
      </div>
    </div>
  );
}
