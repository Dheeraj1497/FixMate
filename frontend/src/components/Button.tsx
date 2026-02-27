import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

export default function Button({ variant = 'primary', loading, className, children, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:ring-offset-2 focus:ring-offset-ink-900';
  const variants = {
    primary: 'bg-emerald-400/15 text-emerald-200 border border-emerald-400/40 hover:bg-emerald-400/25',
    secondary: 'bg-white/5 text-white border border-white/10 hover:border-emerald-400/40 hover:text-emerald-200',
  };
  return (
    <button
      className={clsx(base, variants[variant], className, { 'opacity-50 cursor-not-allowed': props.disabled || loading })}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}
