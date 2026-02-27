import React from 'react';
import Link from 'next/link';

interface Worker {
  id: number;
  user: { first_name: string; last_name: string };
  city?: { name: string };
  availability: boolean;
  about?: string;
  hourly_rate?: number;
  experience?: number;
  total_completed_jobs?: number;
}

interface WorkerCardProps {
  worker: Worker;
}

export default function WorkerCard({ worker }: WorkerCardProps) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-emerald-400/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Professional</p>
          <h3 className="mt-2 text-lg font-semibold text-white">
            {worker.user.first_name} {worker.user.last_name}
          </h3>
          {worker.city && <p className="text-sm text-neutral-400 mt-1">{worker.city.name}</p>}
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            worker.availability
              ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-400/40'
              : 'bg-rose-400/20 text-rose-200 border border-rose-400/40'
          }`}
        >
          {worker.availability ? 'Available' : 'Busy'}
        </span>
      </div>

      {worker.about && (
        <p className="mt-4 text-sm text-neutral-300 line-clamp-2">
          {worker.about}
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div className="rounded-xl border border-white/10 bg-neutral-900/60 px-4 py-3">
          <p className="text-white font-semibold">₹{worker.hourly_rate}/hr</p>
          <p className="text-xs text-neutral-400">{worker.experience} yrs exp.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-neutral-900/60 px-4 py-3">
          <p className="text-white font-semibold">{worker.total_completed_jobs || 0}</p>
          <p className="text-xs text-neutral-400">jobs done</p>
        </div>
      </div>

      <Link
        href={`/customer/workers/${worker.id}`}
        className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/20"
      >
        View Profile & Book
      </Link>
    </div>
  );
}
