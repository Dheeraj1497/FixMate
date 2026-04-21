"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import CustomSelect from '@/components/CustomSelect';

export default function WorkerProfileManage() {
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    city_id: '', experience: 0, about: '', hourly_rate: 0, availability: false, service_ids: [] as string[]
  });
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    api.get('/cities').then(res => setCities(res.data));
    api.get('/categories').then(res => setCategories(res.data));

    api.get('/workers/profile')
      .then(res => {
        const data = (res.data && res.data.worker_profile !== undefined) ? res.data.worker_profile : res.data;
        if (data) {
          setFormData({
            city_id: data.city_id ? String(data.city_id) : '',
            experience: data.experience || 0,
            about: data.about || '',
            hourly_rate: data.hourly_rate || 0,
            availability: !!data.availability,
            service_ids: (data.service_ids || (data.services || []).map((s: any) => s.id) || []).map((id: any) => String(id))
          });
        }
      })
      .catch(() => { /* ignore if not authenticated or no profile */ });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/workers/profile', { worker_profile: formData });
      setMessage('Profile updated successfully!');
      setTimeout(() => router.push('/worker/dashboard'), 1500);
    } catch (err: any) {
      setMessage('Error updating profile: ' + (err.response?.data?.errors?.join(', ') || ''));
    }
  };

  const handleServiceChange = (serviceId: string) => {
    setFormData(prev => {
      const ids = prev.service_ids.includes(serviceId)
        ? prev.service_ids.filter(id => id !== serviceId)
        : [...prev.service_ids, serviceId];
      return { ...prev, service_ids: ids };
    });
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Worker profile</p>
          <h1 className="text-3xl font-display font-semibold text-white">Manage Profile</h1>
        </div>
        {message && (
          <div className="bg-emerald-400/10 text-emerald-200 p-3 rounded-xl mb-6 border border-emerald-400/30">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-neutral-900/60 p-4">
            <div>
              <p className="font-medium text-white">Availability Status</p>
              <p className="text-sm text-neutral-400">Toggle if you are currently taking jobs</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={formData.availability} onChange={e => setFormData({ ...formData, availability: e.target.checked })} />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-400/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-400/40"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <CustomSelect
                label="City"
                placeholder="Select a city"
                value={formData.city_id}
                onChange={value => setFormData({ ...formData, city_id: value })}
                options={cities.map((city: any) => ({ id: city.id, name: city.name }))}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">Hourly Rate (₹)</label>
              <input
                type="number"
                required
                min="0"
                value={formData.hourly_rate}
                onChange={e => setFormData({ ...formData, hourly_rate: parseInt(e.target.value) })}
                className="w-full rounded-xl border border-white/10 bg-neutral-900/60 text-neutral-100 shadow-sm focus:border-emerald-400 focus:ring-emerald-400 p-3"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">Experience (Years)</label>
              <input
                type="number"
                required
                min="0"
                value={formData.experience}
                onChange={e => setFormData({ ...formData, experience: parseInt(e.target.value) })}
                className="w-full rounded-xl border border-white/10 bg-neutral-900/60 text-neutral-100 shadow-sm focus:border-emerald-400 focus:ring-emerald-400 p-3"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-2">About Me</label>
            <textarea
              required
              rows={4}
              value={formData.about}
              onChange={e => setFormData({ ...formData, about: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-neutral-900/60 text-neutral-100 shadow-sm focus:border-emerald-400 focus:ring-emerald-400 p-3"
              placeholder="Describe your skills and background..."
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-400 mb-3">Services Offered</label>
            <div className="space-y-4">
              {categories.map((cat: any) => (
                <div key={cat.id} className="rounded-2xl border border-white/10 bg-neutral-900/60 p-4">
                  <h4 className="font-semibold text-white mb-3">{cat.name}</h4>
                  <div className="flex flex-wrap gap-3">
                    {cat.services?.map((service: any) => (
                      <label key={service.id} className="flex items-center bg-white/5 px-3 py-2 rounded-full border border-white/10 cursor-pointer hover:border-emerald-400/40">
                        <input
                          type="checkbox"
                          checked={formData.service_ids.includes(service.id.toString())}
                          onChange={() => handleServiceChange(service.id.toString())}
                          className="rounded text-emerald-400 focus:ring-emerald-400 mr-2"
                        />
                        <span className="text-sm text-neutral-200">{service.name} (₹{service.base_price})</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full rounded-full border border-emerald-400/40 bg-emerald-400/15 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/25">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
