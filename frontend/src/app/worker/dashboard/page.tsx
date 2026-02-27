"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import EmptyState from '@/components/EmptyState';
import LoadingState from '@/components/LoadingState';

export default function WorkerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
    fetchNotifications();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/jobs/my');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications?limit=5');
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAction = async (id: number, action: string) => {
    try {
      await api.patch(`/jobs/${id}/${action}`);
      fetchJobs();
      fetchNotifications();
    } catch (err) {
      alert(`Could not ${action} job`);
    }
  };

  const markNotificationRead = async (id: number) => {
    try {
      await api.patch(`/notifications/${id}/mark_read`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Worker hub</p>
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-white">Job Requests</h1>
        </div>
        <Link
          href="/worker/profile"
          className="rounded-full border border-emerald-400/40 bg-emerald-400/15 px-5 py-2.5 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/25"
        >
          Edit Profile
        </Link>
      </div>

      {notifications.length > 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 mb-8">
          <h2 className="font-semibold text-lg text-white mb-4">Recent Notifications</h2>
          <div className="space-y-3">
            {notifications.map((notification: any) => (
              <div key={notification.id} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-neutral-900/40 p-4">
                <p className={`text-sm ${notification.read ? 'text-neutral-400' : 'text-neutral-100 font-medium'}`}>
                  {notification.message}
                </p>
                {!notification.read && (
                  <button
                    onClick={() => markNotificationRead(notification.id)}
                    className="text-xs text-emerald-200 border border-emerald-400/40 px-3 py-1.5 rounded-full"
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <LoadingState label="Loading jobs" />
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No job requests yet"
          description="Clients will appear here once they request a service."
        />
      ) : (
        <div className="grid gap-6">
          {jobs.map((job: any) => (
            <div key={job.id} className="rounded-3xl border border-white/10 bg-white/5 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h3 className="font-semibold text-lg text-white">{job.service?.name || 'Service'}</h3>
                <p className="text-neutral-300">Customer: {job.customer?.first_name} {job.customer?.last_name}</p>
                <p className="text-neutral-400 text-sm mt-1">Scheduled: {new Date(job.scheduled_at).toLocaleString()}</p>
                <p className="text-neutral-400 text-sm">Location: {job.location}</p>
                <p className="mt-3 text-sm text-neutral-300 bg-neutral-900/40 p-3 rounded-xl border border-white/10">
                  {job.description}
                </p>
                <p className="text-sm mt-3">
                  <span className="font-medium text-neutral-200">Status:</span>{' '}
                  <span className={`capitalize px-3 py-1 rounded-full text-xs font-semibold border ${
                    job.status === 'pending'
                      ? 'bg-yellow-400/10 text-yellow-200 border-yellow-400/30'
                      : job.status === 'accepted'
                        ? 'bg-cyan-400/10 text-cyan-200 border-cyan-400/30'
                        : job.status === 'completed'
                          ? 'bg-emerald-400/10 text-emerald-200 border-emerald-400/30'
                          : 'bg-rose-400/10 text-rose-200 border-rose-400/30'
                  }`}>{job.status}</span>
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                <Link
                  href={`/jobs/${job.id}`}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-200 hover:text-white hover:border-emerald-400/40 transition"
                >
                  View Details
                </Link>
                {job.status === 'pending' && (
                  <>
                    <button onClick={() => handleAction(job.id, 'accept')} className="rounded-full bg-emerald-400/15 text-emerald-200 border border-emerald-400/40 px-4 py-2 text-sm font-medium hover:bg-emerald-400/25 transition">Accept</button>
                    <button onClick={() => handleAction(job.id, 'reject')} className="rounded-full border border-rose-400/40 text-rose-200 px-4 py-2 text-sm font-medium hover:bg-rose-400/10 transition">Reject</button>
                  </>
                )}
                {job.status === 'accepted' && (
                  <button onClick={() => handleAction(job.id, 'complete')} className="rounded-full bg-emerald-400/15 text-emerald-200 border border-emerald-400/40 px-4 py-2 text-sm font-medium hover:bg-emerald-400/25 transition">Mark Completed</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
