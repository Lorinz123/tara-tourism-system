'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Hotel, Edit, Trash2 } from 'lucide-react';

export default function OwnerDashboard() {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // ... keep your existing auth check logic here ...
    fetch(`https://tara-tourism-system.onrender.com/api/my-hotels`, {
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('tara_token')}`,
        'Accept': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      setPlaces(Array.isArray(data) ? data : (data.hotels || data.data || []));
      setLoading(false);
    })
    .catch(err => { console.error(err); setLoading(false); });
  }, []);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="p-10 bg-[#FDFCF9] min-h-screen pt-24"> 
      <header className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-gray-900">My Hotel Dashboard</h1>
        <button 
          onClick={() => router.push('/owner-dashboard/create')}
          className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition"
        >
          <Plus size={20} /> Add New Hotel
        </button>
      </header>

      <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-bold text-gray-600 uppercase text-xs tracking-wider">Site Name</th>
              <th className="px-6 py-4 font-bold text-gray-600 uppercase text-xs tracking-wider">Address</th>
              <th className="px-6 py-4 font-bold text-gray-600 uppercase text-xs tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {places.map((place: any) => (
              <tr key={place.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-bold text-gray-900">{place.name}</td>
                <td className="px-6 py-4 text-gray-600">{place.address}</td>
                <td className="px-6 py-4 flex gap-3">
                  <button onClick={() => router.push(`/owner-dashboard/edit/${place.id}`)} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-700">Edit</button>
                  <button className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-red-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {places.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <Hotel size={48} className="mx-auto text-gray-300 mb-4" />
            No hotels found.
          </div>
        )}
      </div>
    </div>
  );
}