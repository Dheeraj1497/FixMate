import HeroSection from '@/components/HeroSection';
import ServiceCard from '@/components/ServiceCard';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function Home() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  const role = cookieStore.get('userRole')?.value;

  if (token) {
    if (role === 'worker') {
      redirect('/worker/dashboard');
    } else {
      redirect('/customer/dashboard');
    }
  }

  return (
    <>
      <HeroSection />
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Popular now</p>
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-white">Trending services</h2>
          <p className="text-sm text-neutral-400 max-w-2xl">
            Book instantly with verified professionals and transparent pricing.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <ServiceCard title="Electrician" icon={<span>⚡</span>} href="/customer/workers?category_name=Electrician" />
          <ServiceCard title="Plumber" icon={<span>🚿</span>} href="/customer/workers?category_name=Plumber" />
          <ServiceCard title="Appliance Repair" icon={<span>🧰</span>} href="/customer/workers?category_name=AC Repair" />
        </div>

      </section>
    </>
  );
}
