import React from 'react';
import Link from 'next/link';

interface ServiceCardProps {
  title: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export default function ServiceCard({ title, icon, href, onClick }: ServiceCardProps) {
  const inner = (
    <div
      className="group flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition hover:border-emerald-400/50 hover:shadow-glow"
      onClick={onClick}
    >
      {icon ? (
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-400/10 text-3xl text-emerald-200">
          {icon}
        </div>
      ) : null}
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm text-neutral-400">Trusted experts for fast, high-quality service.</p>
    </div>
  );

  if (href) {
    return <Link href={href}>{inner}</Link>;
  }
  return inner;
}
