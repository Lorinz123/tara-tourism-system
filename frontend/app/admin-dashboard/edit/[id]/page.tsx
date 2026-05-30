'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

// Dynamic API entrypoint setup config matching app topology
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tara-tourism-system.onrender.com';

export default function EditPlacePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id; // Guarding against undefined routing evaluation parameters

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Beach',
    address: '',
    description: '',
    image_url: '',
  });

  /*
  |--------------------------------------------------------------------------
  | FETCH CURRENT PLACE DETAIL SCHEMA
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    if (!id) return;
    
    const fetchPlace = async () => {
      try {
        const res = await fetch(`${API_URL}/api/places/${id}`);
        if (!res.ok) {
          throw new Error('Target location entity could not be located.');
        }
        const data = await res.json();

        setFormData({
          name: data.name || '',
          category: data.category || 'Beach',
          address: data.address || '',
          description: data.description || '',
          image_url: data.image_url || '',
        });
      } catch (err: any) {
        console.error("Fetch Details Error:", err);
        alert(err.message || 'Failed to load location metrics data profiles.');
        router.push('/admin-dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [id, router]);

  /*
  |--------------------------------------------------------------------------
  | UNIFIED STATE SYNC HANDLER
  |--------------------------------------------------------------------------
  */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | AUTHORIZED PUT TRANSMISSION SUBMISSION
  |--------------------------------------------------------------------------
  */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/places/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // FIXED: Attaching active JWT bearer passport authorization token credentials
          'Authorization': `Bearer ${localStorage.getItem('tara_token')}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Server rejected location alteration request payload.');
      }

      alert('Place modified and synchronized successfully!');
      router.push('/admin-dashboard');
    } catch (err: any) {
      console.error("Mutation Error:", err);
      alert(err.message || 'Something went wrong during data persistence updates.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center text-gray-500 font-bold text-sm tracking-widest">
        LOADING LOCATION PROFILE DATABASE...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF8] p-4 sm:p-10 text-black">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* IMAGE PREVIEW STAGE BOX */}
        <div className="h-72 overflow-hidden relative bg-gray-900">
          <img
            src={
              formData.image_url ||
              'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200'
            }
            alt="Real-time Preview Metadata Render"
            className="w-full h-full object-cover opacity-80"
            onError={(e) => {
              // Graceful fallback for broken image URLs
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10 flex items-end p-8">
            <h1 className="text-4xl font-black text-white tracking-tight">
              Edit Place
            </h1>
          </div>
        </div>

        {/* FIELD REGISTRATION CONTROL PANEL */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {/* PLACE NAME INPUT */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Place Name
            </label>
            <input
              type="text"
              name="name"
              disabled={submitting}
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 text-sm font-medium"
              placeholder="e.g., 10,000 Roses Cafe"
            />
          </div>

          {/* DISCOVERY FILTER CATEGORY SELECT */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              disabled={submitting}
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 text-sm font-medium"
            >
              <option value="Beach">Beach</option>
              <option value="Heritage">Heritage Sites</option>
              <option value="Restaurant">Restaurants</option>
              <option value="Hotel">Hotels & Resorts</option>
            </select>
          </div>

          {/* GEOLOCATION ADDRESS FIELD */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              disabled={submitting}
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 text-sm font-medium"
              placeholder="Sitio, Barangay, Cordova, Cebu"
            />
          </div>

          {/* PUBLIC CDN IMAGE LINK SOURCE */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              name="image_url"
              disabled={submitting}
              value={formData.image_url}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 text-sm font-medium"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* SUMMARY DESCRIPTION BLOCKS */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              disabled={submitting}
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 text-sm font-medium leading-relaxed"
              placeholder="Detail out the unique heritage aspects, operations details, and features of the area..."
            />
          </div>

          {/* INTERACTIVE NAVIGATION CONTROL TRIPS */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
            >
              {submitting ? 'Saving Framework Changes...' : 'Save Changes'}
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={() => router.push('/admin-dashboard')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold transition disabled:opacity-50 text-sm"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}