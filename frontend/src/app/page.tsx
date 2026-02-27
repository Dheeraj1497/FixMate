import HeroSection from '@/components/HeroSection';
import ServiceCard from '@/components/ServiceCard';

export default function Home() {
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
          <ServiceCard title="Electrician" icon={<span>⚡</span>} href="/customer/workers" />
          <ServiceCard title="Plumber" icon={<span>🚿</span>} href="/customer/workers" />
          <ServiceCard title="Appliance Repair" icon={<span>🧰</span>} href="/customer/workers" />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-400/15 to-transparent p-5 text-sm text-neutral-300">
            <p className="text-white font-semibold">Waxing & Facials</p>
            <p className="mt-2">Starts at ₹399</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-400/15 to-transparent p-5 text-sm text-neutral-300">
            <p className="text-white font-semibold">Bathroom Cleaning</p>
            <p className="mt-2">Deep clean deals</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-fuchsia-400/15 to-transparent p-5 text-sm text-neutral-300">
            <p className="text-white font-semibold">Relax & Rejuvenate</p>
            <p className="mt-2">Therapy at home</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-yellow-400/15 to-transparent p-5 text-sm text-neutral-300">
            <p className="text-white font-semibold">Haircut Experts</p>
            <p className="mt-2">Starts at ₹199</p>
          </div>
        </div>
      </section>
    </>
  );
}
