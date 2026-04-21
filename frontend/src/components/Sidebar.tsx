"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Home, Search, LayoutDashboard, User, LogIn, UserPlus, ChevronRight } from 'lucide-react';

export default function Sidebar({
  open,
  expanded,
  onToggleExpand,
  onClose,
}: {
  open?: boolean;
  expanded?: boolean;
  onToggleExpand?: () => void;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const [token, setToken] = useState<string | undefined>();
  const [role, setRole] = useState<string | undefined>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setToken(Cookies.get('token'));
    setRole(Cookies.get('userRole'));
  }, [pathname]);

  const links = [
    ...(mounted && token && role === 'worker' ? [] : [{ href: '/', label: 'Home' }]),
    ...(mounted && token
      ? role === 'worker'
        ? [
          { href: '/worker/dashboard', label: 'Worker Dashboard' },
        ]
        : [
          { href: '/customer/workers', label: 'Find Professionals' },
          { href: '/customer/dashboard', label: 'Customer Dashboard' },
        ]
      : mounted
        ? [
          { href: '/customer/workers', label: 'Find Professionals' },
          { href: '/login', label: 'Login' },
          { href: '/register', label: 'Register' },
        ]
        : []),
  ];

  const iconFor = (href: string) => {
    if (href === '/') return Home;
    if (href === '/customer/workers') return Search;
    if (href === '/customer/dashboard' || href === '/worker/dashboard') return LayoutDashboard;
    if (href === '/worker/profile') return User;
    if (href === '/login') return LogIn;
    if (href === '/register') return UserPlus;
    return Home;
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 h-screen w-64 border-r border-white/10 bg-ink-900/95 backdrop-blur transition-transform lg:translate-x-0 lg:flex lg:flex-col lg:gap-6 lg:bg-ink-900/80 ${open ? 'translate-x-0' : '-translate-x-full'
          } ${expanded ? 'lg:w-56' : 'lg:w-16'}`}
      >
        <div className={`pt-6 ${expanded ? 'px-4' : 'px-0 flex justify-center'}`}>
          <button
            type="button"
            onClick={onToggleExpand}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-neutral-200 hover:text-white hover:border-emerald-400/40 transition"
            aria-label="Toggle sidebar"
          >
            <ChevronRight className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
        <nav className={`pb-6 flex flex-col gap-2 ${expanded ? 'px-3' : 'px-0 items-center'}`}>
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            const Icon = iconFor(link.href);
            const isCollapsed = !expanded;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`group flex items-center gap-3 text-sm transition w-full overflow-hidden ${isCollapsed
                  ? 'justify-center w-12 h-12 rounded-2xl mx-auto'
                  : active
                    ? 'bg-emerald-400/15 text-emerald-200 border border-emerald-400/40 rounded-xl px-3 py-2.5'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5 border border-transparent rounded-xl px-3 py-2.5'
                  }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition ${active ? 'bg-emerald-400/15 text-emerald-200' : 'text-neutral-300'
                    } ${isCollapsed ? 'border border-white/10' : ''}`}
                >
                  <Icon size={20} />
                </span>
                <span className={`flex-1 truncate transition-opacity ${expanded ? 'opacity-100' : 'opacity-0'}`}>
                  {link.label}
                </span>
                {!isCollapsed && (
                  <ChevronRight
                    size={16}
                    className={`ml-auto shrink-0 transition-opacity ${expanded ? 'opacity-80' : 'opacity-0'} ${active ? 'text-emerald-200' : 'text-neutral-500 group-hover:text-neutral-400'
                      }`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className={`mt-auto px-6 pb-6 text-xs text-neutral-500 transition-opacity ${expanded ? 'opacity-100' : 'opacity-0'}`}>
          support@fixmate.in
        </div>
      </aside>
    </>
  );
}
