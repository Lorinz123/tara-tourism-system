'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Decoupled operational endpoint architecture fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tara-tourism-system.onrender.com';

export default function CreatePlacePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Beach',
    description: '',
    image_url: '',
    address: '',
  });

  /*
  |--------------------------------------------------------------------------
  | INPUT SYNC TRANSITION PROCESSOR
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
  | TRANSACTION LOGIC: SECURE POST PERSISTENCE
  |--------------------------------------------------------------------------
  */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/places`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // FIXED: Secured with administrative credential tokens from active storage
          'Authorization': `Bearer ${localStorage.getItem('tara_token')}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorDetails = await response.json().catch(() => ({}));
        throw new Error(errorDetails.message || 'The server rejected the registration schema.');
      }

      alert('Tourism entity registered successfully!');
      router.push('/admin-dashboard');
    } catch (error: any) {
      console.error('Creation Pipeline Failure:', error);
      alert(error.message || 'Something went wrong while attempting to build data entity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] pt-24 pb-12 px-4 sm:px-10 flex justify-center items-center text-black">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* LIVE DESIGN RENDERING MEDIA BLOCKS */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 lg:sticky lg:top-28">
          <div className="relative h-[350px] bg-gray-100">
            <img
              src={
                formData.image_url ||
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200'
              }
              alt="Live Canvas Pipeline Display Render"
              className="w-full h-full object-cover transition duration-300"
              onError={(e) => {
                // Secure path mitigation fallback loop checks
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200';
              }}
            />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-black uppercase text-orange-600 tracking-wider shadow-sm">
              {formData.category}
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-3xl font-black text-gray-900 mb-2 truncate">
              {formData.name || 'Untitled Destination'}
            </h2>
            <p className="text-orange-600 font-bold text-sm mb-4">
              {formData.address || 'Cordova, Cebu, Philippines'}
            </p>
            <p className="text-gray-600 text-sm leading-relaxed break-words whitespace-pre-wrap">
              {formData.description || 'Provide operational, environmental, or logistical context descriptions within the panel to preview presentation typography layout maps here...'}
            </p>
          </div>
        </div>

        {/* INPUT REVENUE FORM SYSTEM SCHEMAS */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-10">
          <div className="mb-8">
            <h1 className="text-4xl font-black text-gray-950 tracking-tight">
              Create Tourism Place
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Publish landmark destinations, accommodations, and establishments into the registry.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* DESTINATION IDENTIFIER ENTRY */}
            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Place Name
              </label>
              <input
                type="text"
                name="name"
                disabled={loading}
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Gilutongan Marine Sanctuary"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 disabled:bg-gray-50 text-sm font-medium"
              />
            </div>

            {/* SELECTION ATTRIBUTES CLASSIFIER */}
            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Category Group
              </label>
              <select
                name="category"
                disabled={loading}
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 disabled:bg-gray-50 text-sm font-medium bg-white"
              >
                <option value="Beach">Beach & Marine Resource</option>
                <option value="Heritage">Heritage & Culture Site</option>
                <option value="Restaurant">Local Restaurant</option>
                <option value="Hotel">Resort & Accommodation</option>
              </select>
            </div>

            {/* GEOLOCATION MATRIX FIELDS */}
            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Full Physical Address
              </label>
              <input
                type="text"
                name="address"
                disabled={loading}
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Poblacion, Cordova, Cebu"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 disabled:bg-gray-50 text-sm font-medium"
              />
            </div>

            {/* REMOTE ASSET STAGE POINTERS */}
            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Asset Image Link URL
              </label>
              <input
                type="url"
                name="image_url"
                disabled={loading}
                value={formData.image_url}
                onChange={handleChange}
                required
                placeholder="https://images.unsplash.com/... or CDN path"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 disabled:bg-gray-50 text-sm font-medium"
              />
            </div>

            {/* CONTEXT BLOCK EXPLANATION FIELD AREA */}
            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Public Profile Description
              </label>
              <textarea
                name="description"
                disabled={loading}
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
                placeholder="Outline history, travel options, features, operating times, or entry rates..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 disabled:bg-gray-50 text-sm font-medium leading-relaxed"
              />
            </div>

            {/* FORWARD INTERACTION ACTION TRIPS */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition shadow-md transform active:scale-[0.99] text-base"
              >
                {loading ? 'Synchronizing Node Operations...' : 'Publish Destination'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}