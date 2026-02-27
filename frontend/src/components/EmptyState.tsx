import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">Empty state</p>
      <h3 className="mt-3 text-2xl font-display font-semibold text-white">{title}</h3>
      {description && <p className="mt-2 text-sm text-neutral-400">{description}</p>}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex rounded-full border border-emerald-400/40 bg-emerald-400/15 px-5 py-2.5 text-sm font-semibold text-emerald-200 hover:bg-emerald-400/25 transition"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
