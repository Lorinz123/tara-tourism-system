'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditHotel() {
  const { id } = useParams();
  const router = useRouter();

  // FIX: Initialize with empty strings instead of leaving them undefined
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    booking_url: '',
    image_url: '',
    description: ''
  });

  useEffect(() => {
    fetch(`https://tara-tourism-system.onrender.com/api/my-hotels/${id}`, {
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('tara_token')}`,
        'Accept': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      // FIX: Ensure even if API returns null, we set an empty string
      setFormData({
        name: data.name || '',
        address: data.address || '',
        booking_url: data.booking_url || '',
        image_url: data.image_url || '',
        description: data.description || ''
      });
    })
    .catch(err => console.error("Error fetching:", err));
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`https://tara-tourism-system.onrender.com/api/my-hotels/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('tara_token')}` 
      },
      body: JSON.stringify(formData)
    });
    router.push('/owner-dashboard');
  };

  return (
    <div className="p-10 max-w-2xl mx-auto pt-24">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Hotel Listing</h1>
      <form onSubmit={handleUpdate} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-4">
        
        {/* Added text-gray-900 to ensure high contrast/visibility */}
        <label className="block font-bold text-gray-700">Hotel Name</label>
        <input 
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500" 
          value={formData.name} 
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
        />
        
        <label className="block font-bold text-gray-700">Address</label>
        <input 
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900" 
          value={formData.address} 
          onChange={(e) => setFormData({...formData, address: e.target.value})} 
        />

        <label className="block font-bold text-gray-700">Booking URL</label>
        <input 
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900" 
          value={formData.booking_url} 
          onChange={(e) => setFormData({...formData, booking_url: e.target.value})} 
        />

        <label className="block font-bold text-gray-700">Image URL</label>
        <input 
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900" 
          value={formData.image_url} 
          onChange={(e) => setFormData({...formData, image_url: e.target.value})} 
        />

        <label className="block font-bold text-gray-700">Description</label>
        <textarea 
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 h-32" 
          value={formData.description} 
          onChange={(e) => setFormData({...formData, description: e.target.value})} 
        />

        <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition">
          Update Hotel Listing
        </button>
      </form>
    </div>
  );
}