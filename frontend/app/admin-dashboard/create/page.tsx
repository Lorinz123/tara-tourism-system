'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    try {

      const response = await fetch(
        'http://127.0.0.1:8000/api/places',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {

        alert('Place created successfully!');

        router.push('/admin-dashboard');

      } else {

        alert('Failed to create place.');

      }

    } catch (error) {

      console.error(error);

      alert('Something went wrong.');

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] p-10 flex justify-center items-center">

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LIVE PREVIEW CARD */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-200">

          <div className="relative h-[350px]">

            <img
              src={
                formData.image_url ||
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200'
              }
              alt="Preview"
              className="w-full h-full object-cover"
            />

            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold uppercase shadow">
              {formData.category}
            </div>

          </div>

          <div className="p-8">

            <h2 className="text-3xl font-black text-gray-900 mb-3">
              {formData.name || 'Place Name'}
            </h2>

            <p className="text-orange-600 font-semibold mb-4">
              {formData.address || 'Cordova Cebu'}
            </p>

            <p className="text-gray-600 leading-relaxed">
              {formData.description ||
                'Place description preview will appear here.'}
            </p>

          </div>

        </div>

        {/* CREATE PANEL */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-10">

          <div className="mb-8">

            <h1 className="text-4xl font-black text-gray-900">
              Create Tourism Place
            </h1>

            <p className="text-gray-500 mt-2">
              Add a beach or heritage site.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* NAME */}
            <div>

              <label className="block mb-2 font-bold text-gray-900">
                Place Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
              />

            </div>

            {/* CATEGORY */}
            <div>

              <label className="block mb-2 font-bold text-gray-900">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
              >
                <option value="Beach">
                  Beach
                </option>

                <option value="Heritage">
                  Heritage
                </option>
              </select>

            </div>

            {/* ADDRESS */}
            <div>

              <label className="block mb-2 font-bold text-gray-900">
                Address
              </label>

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Cordova Cebu"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
              />

            </div>

            {/* IMAGE URL */}
            <div>

              <label className="block mb-2 font-bold text-gray-900">
                Image URL
              </label>

              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                required
                placeholder="https://..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
              />

            </div>

            {/* DESCRIPTION */}
            <div>

              <label className="block mb-2 font-bold text-gray-900">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-2xl font-bold transition"
            >
              {loading
                ? 'Creating Place...'
                : 'Create Tourism Place'}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}