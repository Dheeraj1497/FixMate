"use client";
import { useEffect, useState, Suspense } from 'react';
import api from '@/lib/api';
import WorkerCard from '@/components/WorkerCard';
import EmptyState from '@/components/EmptyState';
import LoadingState from '@/components/LoadingState';
import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import CustomSelect from '@/components/CustomSelect';

function WorkersSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [workers, setWorkers] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city_id') || '');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [availability, setAvailability] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, total_pages: 1, total_count: 0 });
  const [loading, setLoading] = useState(true);

  // Sync state if searchParams changes from navigation
  useEffect(() => {
    const cityId = searchParams.get('city_id');
    if (cityId) setSelectedCity(cityId);
  }, [searchParams]);

  useEffect(() => {
    const role = Cookies.get('userRole');
    if (role === 'worker') {
      router.replace('/worker/dashboard');
    }
    api.get('/cities').then(res => setCities(res.data));
    api.get('/categories').then(res => {
      setCategories(res.data);
      const allServices = res.data.flatMap((cat: any) => cat.services || []);
      setServices(allServices);

      const categoryNameParam = searchParams.get('category_name');
      if (categoryNameParam) {
        const foundCategory = res.data.find((c: any) => c.name.toLowerCase() === categoryNameParam.toLowerCase());
        if (foundCategory) {
          setSelectedCategory(foundCategory.id.toString());
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCity) params.append('city_id', selectedCity);
      if (selectedCategory) params.append('category_id', selectedCategory);
      if (selectedService) params.append('service_id', selectedService);
      if (availability) params.append('available', availability);
      params.append('page', page.toString());
      params.append('per_page', '9');

      const res = await api.get(`/workers?${params.toString()}`);
      setWorkers(res.data.data || []);
      setMeta(res.data.meta || { page: 1, total_pages: 1, total_count: 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, [selectedCity, selectedCategory, selectedService, availability, page]);

  useEffect(() => {
    setPage(1);
  }, [selectedCity, selectedCategory, selectedService, availability]);

  return (
    <div className="bg-neutral-950 text-neutral-100">
      <section className="relative">
        {/* Background blobs wrapper with hidden overflow */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute top-10 right-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-10 md:pt-20 md:pb-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/90">Urban services</p>
              <h1 className="mt-3 text-3xl md:text-5xl font-semibold leading-tight text-white">
                Find proven local professionals for fast, clean, reliable work.
              </h1>
              <p className="mt-4 text-neutral-300 text-base md:text-lg">
                Curated experts across the city. Book in minutes, track availability instantly, and get the job done right.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-xs text-neutral-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-white text-lg font-semibold">4.9★</p>
                <p>Avg rating</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-white text-lg font-semibold">2k+</p>
                <p>Verified pros</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-white text-lg font-semibold">24/7</p>
                <p>Support</p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6 backdrop-blur">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex-1">
                <CustomSelect
                  label="City"
                  placeholder="All Cities"
                  value={selectedCity}
                  onChange={setSelectedCity}
                  options={cities.map((city: any) => ({ id: city.id, name: city.name }))}
                />
              </div>
              <div className="flex-1">
                <CustomSelect
                  label="Category"
                  placeholder="All Categories"
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  options={categories.map((cat: any) => ({ id: cat.id, name: cat.name }))}
                />
              </div>
              <div className="flex-1">
                <CustomSelect
                  label="Service"
                  placeholder="All Services"
                  value={selectedService}
                  onChange={setSelectedService}
                  options={services.map((service: any) => ({ id: service.id, name: service.name }))}
                />
              </div>
              <div className="flex-1">
                <CustomSelect
                  label="Availability"
                  placeholder="All"
                  value={availability}
                  onChange={setAvailability}
                  options={[
                    { id: 'true', name: 'Available' },
                    { id: 'false', name: 'Busy' }
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Talent grid</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Professionals ready for your request</h2>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-neutral-300">
            Showing {workers.length} of {meta.total_count} results
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full">
              <LoadingState label="Loading professionals" />
            </div>
          ) : workers.length === 0 ? (
            <div className="col-span-full">
              <EmptyState
                title="No professionals found"
                description="Try adjusting your filters or broaden the search area."
              />
            </div>
          ) : (
            workers.map((worker: any) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))
          )}
        </div>

        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-neutral-400">
            Page {meta.page} of {Math.max(meta.total_pages, 1)}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={meta.page <= 1}
              className="px-4 py-2 text-sm rounded-full border border-white/10 bg-white/5 text-white disabled:opacity-50 hover:border-emerald-400 hover:text-emerald-200 transition"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((prev) => (prev < meta.total_pages ? prev + 1 : prev))}
              disabled={meta.page >= meta.total_pages}
              className="px-4 py-2 text-sm rounded-full border border-white/10 bg-white/5 text-white disabled:opacity-50 hover:border-emerald-400 hover:text-emerald-200 transition"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function SearchWorkers() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-950 flex justify-center pt-20"><LoadingState label="Loading parameters..." /></div>}>
      <WorkersSearchContent />
    </Suspense>
  );
}
