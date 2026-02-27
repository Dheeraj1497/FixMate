import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-900/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">FixMate</p>
          <p className="mt-2 text-sm text-neutral-300">Trusted urban professionals across India.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-neutral-300">
          <Link href="/" className="hover:text-white">Home</Link>
          <Link href="/customer/workers" className="hover:text-white">Find Professionals</Link>
          <Link href="/login" className="hover:text-white">Login</Link>
          <Link href="/register" className="hover:text-white">Register</Link>
        </div>
        <div className="text-xs text-neutral-500">
          © {new Date().getFullYear()} FixMate India. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
