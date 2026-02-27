import React from 'react';

interface LoadingStateProps {
  label?: string;
}

export default function LoadingState({ label = 'Loading' }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-emerald-300" />
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">{label}</p>
      </div>
    </div>
  );
}
