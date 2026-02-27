"use client";
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { useEffect, useRef, useState } from 'react';
import api from '@/lib/api';

export default function Navbar({
  onToggleSidebar,
}: {
  onToggleSidebar?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState<string | undefined>();
  const [role, setRole] = useState<string | undefined>();
  const [mounted, setMounted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    const authToken = Cookies.get('token');
    const currentRole = Cookies.get('userRole');
    setToken(authToken);
    setRole(currentRole);

    if (authToken) {
      api.get('/users/me')
        .then((res) => {
          const first = res.data?.first_name || '';
          const last = res.data?.last_name || '';
          setUserName(`${first} ${last}`.trim());
        })
        .catch(() => setUserName(''));
    }

    if (authToken && currentRole === 'worker') {
      api.get('/notifications/unread_count')
        .then((res) => setUnreadCount(res.data.unread_count || 0))
        .catch(() => setUnreadCount(0));
    } else {
      setUnreadCount(0);
    }
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('userRole');
    setToken(undefined);
    setRole(undefined);
    router.push('/login');
  };

  const dashboardLink = role === 'worker' ? '/worker/dashboard' : '/customer/dashboard';
  const profileLink = role === 'worker' ? '/worker/profile' : '/customer/dashboard';
  const initials = userName
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || (role?.[0]?.toUpperCase() || 'U');

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-ink-900/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-neutral-200 hover:text-white hover:border-emerald-400/40 transition"
            aria-label="Open menu"
          >
            <span className="h-4 w-4 border-t-2 border-current block" />
            <span className="sr-only">Menu</span>
          </button>
          <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-[0.2em] text-emerald-300">FM</span>
          <span className="text-xl font-semibold text-white">FixMate</span>
        </Link>
        </div>

        <div className="flex items-center gap-3 text-sm">
          {!mounted ? null : token ? (
            <>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-neutral-200 hover:border-emerald-400/40 hover:text-white transition"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-semibold">
                    {initials}
                  </span>
                  <span className="hidden sm:inline">{userName || (role === 'worker' ? 'Worker' : 'Customer')}</span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/10 bg-ink-900/90 backdrop-blur p-2 text-sm shadow-glow z-50">
                    <Link href={dashboardLink} className="block rounded-xl px-3 py-2 text-neutral-300 hover:bg-white/5 hover:text-white">
                      Dashboard
                    </Link>
                    <Link href={profileLink} className="block rounded-xl px-3 py-2 text-neutral-300 hover:bg-white/5 hover:text-white">
                      Profile
                    </Link>
                    {role === 'worker' && (
                      <Link href="/worker/dashboard" className="relative block rounded-xl px-3 py-2 text-neutral-300 hover:bg-white/5 hover:text-white">
                        Notifications
                        {unreadCount > 0 && (
                          <span className="ml-2 inline-flex items-center justify-center min-w-5 h-5 px-1 text-[10px] font-semibold bg-rose-500 text-white rounded-full">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        )}
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full text-left rounded-xl px-3 py-2 text-rose-200 hover:bg-rose-400/10">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-neutral-300 hover:text-white transition">Login</Link>
              <Link
                href="/register"
                className="rounded-full border border-emerald-400/50 bg-emerald-400/10 px-4 py-2 text-emerald-200 hover:bg-emerald-400/20 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
