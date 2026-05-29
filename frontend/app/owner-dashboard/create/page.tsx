'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateHotelPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Hotel', // Pre-set to Hotel
    description: '',
    image_url: '',
    address: '',
    booking_url: '', 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Get owner ID from local storage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tara_token')}`
        },
        body: JSON.stringify({ ...formData, owner_id: user.id }),
      });

      if (response.ok) {
        alert('Hotel created successfully!');
        router.push('/owner-dashboard');
      } else {
        alert('Failed to create hotel.');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // pt-24 ensures this content sits below your fixed navbar
    <div className="min-h-screen bg-[#FDFCF8] p-10 flex justify-center items-start pt-24">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-gray-100 shadow-xl p-10">
        <h1 className="text-4xl font-black text-gray-900 mb-2">Register Your Hotel</h1>
        <p className="text-gray-500 mb-8">Add your property to the TARA directory.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-bold text-gray-900">Hotel Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900" />
            </div>
            <div>
              <label className="block mb-2 font-bold text-gray-900">Address</label>
              <input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900" />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-bold text-gray-900">Booking URL (Link for 'Book Now' button)</label>
            <input type="url" name="booking_url" value={formData.booking_url} onChange={handleChange} placeholder="https://" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900" />
          </div>

          <div>
            <label className="block mb-2 font-bold text-gray-900">Image URL</label>
            <input type="text" name="image_url" required value={formData.image_url} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900" />
          </div>

          <div>
            <label className="block mb-2 font-bold text-gray-900">Description</label>
            <textarea name="description" required value={formData.description} onChange={handleChange} rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-2xl font-bold transition"
          >
            {loading ? 'Publishing...' : 'Publish Hotel Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}