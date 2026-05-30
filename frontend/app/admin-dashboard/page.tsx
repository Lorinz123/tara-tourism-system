'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Site {
  id: number;
  name: string;
  category: string;
  description?: string;
}

// Ensure this matches your Netlify environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tara-tourism-system.onrender.com';

export default function AdminDashboard() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Basic role check
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchSites();
  }, [router]);

  const fetchSites = async () => {
    try {
      const response = await fetch(`${API_URL}/api/all-places`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('tara_token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch records');
      const data = await response.json();
      setSites(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching places:', error);
      alert('Could not connect to the database. Check API_URL.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this place?')) return;

    try {
      const response = await fetch(`${API_URL}/api/places/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('tara_token')}`
        }
      });

      if (response.ok) {
        setSites((prev) => prev.filter((site) => site.id !== id));
        alert('Place deleted successfully!');
      } else {
        alert('Failed to delete. Please check permissions.');
      }
    } catch (error) {
      alert('Deletion failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] p-4 md:p-8 lg:p-12 text-black">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">Admin Control Panel</h1>
            <p className="text-gray-500 mt-2 text-sm md:text-base">Manage tourism hubs across Cordova.</p>
          </div>

          {/* ENABLED CREATE BUTTON */}
          <button
            onClick={() => router.push('/admin-dashboard/create')}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-md"
          >
            + Create New Place
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left">
                <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs">Site Name</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs">Category</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-400">Loading registry...</td></tr>
              ) : sites.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-400">No places found.</td></tr>
              ) : (
                sites.map((site) => (
                  <tr key={site.id}>
                    <td className="px-6 py-5 font-bold">{site.name}</td>
                    <td className="px-6 py-5"><span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold">{site.category}</span></td>
                    <td className="px-6 py-5 text-right space-x-2">
                      <button onClick={() => handleDelete(site.id)} className="text-red-600 hover:underline text-xs font-bold">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}