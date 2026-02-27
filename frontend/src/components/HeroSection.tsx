"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import Cookies from 'js-cookie';

const categories = [
  { name: 'Electrician', emoji: '⚡' },
  { name: 'Plumber', emoji: '🚿' },
  { name: 'Appliance Repair', emoji: '🧰' },
];

export default function HeroSection() {
  const [location, setLocation] = useState('Select location');
  const [greeting, setGreeting] = useState('FixMate India');

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) return;

    api.get('/users/me')
      .then(async (res) => {
        const first = res.data?.first_name || '';
        setGreeting(first ? `Hi, ${first}` : 'FixMate India');

        if (res.data?.role === 'worker') {
          const city = res.data?.city;
          if (city) setLocation(city);
        } else {
          try {
            const jobs = await api.get('/jobs/my');
            const last = jobs.data?.[0];
            if (last?.location) setLocation(last.location);
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {
        setGreeting('FixMate India');
      });
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-ink-900/90 to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.18),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(56,189,248,0.14),transparent_45%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">{greeting}</p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-semibold leading-tight text-white">
            Home services, on demand.
          </h1>
          <p className="mt-4 text-base md:text-lg text-neutral-300">
            Find trusted professionals for repairs, cleaning, wellness, and more — available across your city.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-neutral-300">
            <span className="text-neutral-400">📍</span> {location}
          </div>
          <div className="flex-[2] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-neutral-300">
            Search for services
          </div>
          <Link
            href="/customer/workers"
            className="rounded-2xl border border-emerald-400/40 bg-emerald-400/15 px-5 py-3 text-sm font-semibold text-emerald-200 hover:bg-emerald-400/25 transition text-center"
          >
            Explore
          </Link>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
            {categories.map((cat) => (
              <div key={cat.name} className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-neutral-900/60 text-lg">
                  {cat.emoji}
                </div>
                <p className="text-xs text-neutral-300">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
