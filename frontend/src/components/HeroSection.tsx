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
  const [greeting, setGreeting] = useState('FixMate India');
  const [cities, setCities] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      let loadedCities: any[] = [];
      try {
        const res = await api.get('/cities');
        loadedCities = res.data;
        setCities(loadedCities);
      } catch {
        // ignore
      }

      const token = Cookies.get('token');
      if (!token) return;

      try {
        const userRes = await api.get('/users/me');
        const first = userRes.data?.first_name || '';
        setGreeting(first ? `Hi, ${first}` : 'FixMate India');

        let userCityName = '';
        if (userRes.data?.role === 'worker') {
          userCityName = userRes.data?.city || '';
        } else {
          const jobs = await api.get('/jobs/my');
          const last = jobs.data?.[0];
          if (last?.location) userCityName = last.location;
        }

        if (userCityName && loadedCities.length > 0) {
          const match = loadedCities.find(
            (c: any) => c.name.toLowerCase() === userCityName.toLowerCase()
          );
          if (match) setSelectedCity(match.id.toString());
        }
      } catch {
        setGreeting('FixMate India');
      }
    };

    fetchInitialData();
  }, []);

  return (
    <section className="relative">
      <div className="absolute inset-0 overflow-hidden">
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
          <div className="flex-1 relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full h-full flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-neutral-300 hover:border-emerald-400/40 hover:text-white transition outline-none"
            >
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <span className="text-neutral-400">📍</span>
              </div>
              <span className="flex-1 text-left truncate">
                {selectedCity ? cities.find(c => c.id.toString() === selectedCity)?.name || 'Select city' : 'Select city'}
              </span>
              <div className="flex items-center pointer-events-none ml-2">
                <span className={`text-neutral-500 text-[10px] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}>▼</span>
              </div>
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-white/10 bg-ink-900/95 backdrop-blur shadow-xl overflow-hidden z-50 transform origin-top animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="max-h-60 overflow-y-auto w-full p-2 flex flex-col gap-1 custom-scrollbar">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCity('');
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition ${selectedCity === ''
                        ? 'text-emerald-300 bg-emerald-400/10 font-medium'
                        : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      All Cities
                    </button>
                    {cities.map((c: any) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSelectedCity(c.id.toString());
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition ${selectedCity === c.id.toString()
                          ? 'text-emerald-300 bg-emerald-400/10 font-medium'
                          : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                          }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex-[2] flex items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-neutral-400">
            Search for professionals and services...
          </div>
          <Link
            href={selectedCity ? `/customer/workers?city_id=${selectedCity}` : '/customer/workers'}
            className="flex items-center justify-center rounded-2xl border border-emerald-400/40 bg-emerald-400/15 px-8 py-3 text-sm font-semibold text-emerald-200 hover:bg-emerald-400/25 transition text-center"
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
