'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Site {
  id: number;
  name: string;
  category: string;
  description?: string;
}

// Unified production API gateway variable routing fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tara-tourism-system.onrender.com';

export default function AdminDashboard() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /*
  |--------------------------------------------------------------------------
  | EFFECT: ROUTE PROTECTIONS & MOUNT LIFECYCLE
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    // Parsing safely within Client context lifecycle to prevent SSR hydration mismatches
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (user.role !== 'admin') {
      router.push('/login');
      return;
    }

    fetchSites();
  }, [router]);

  /*
  |--------------------------------------------------------------------------
  | READ: FETCH SITES FROM PRODUCTION GATEWAY OR INJECT BYPASS PLACEHOLDERS
  |--------------------------------------------------------------------------
  */
  const fetchSites = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // ======================================================================
    // EMERGENCY BYPASS DATA PROVISIONING FOR DEMO - EMPTY ARRAY INJECTION
    // ======================================================================
    if (user.email === 'admin@gmail.com') {
      const mockPlaces: Site[] = []; // Intentionally left empty to simulate a pristine database state
      setSites(mockPlaces);
      setLoading(false);
      return; // Stop code path so it doesn't try hitting Render with a fake token
    }
    // ======================================================================

    try {
      const response = await fetch(`${API_URL}/api/all-places`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('tara_token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to download tourism registry records.');
      }

      const data = await response.json();
      setSites(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE: SECURE ENTITY DELETION REMOVALS
  |--------------------------------------------------------------------------
  */
  const handleDelete = async (id: number) => {
    const confirmDelete = confirm('Are you sure you want to delete this place permanently from the Cordova registry?');
    if (!confirmDelete) return;

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // ======================================================================
    // EMERGENCY BYPASS DELETION OPTIMISTIC DISPATCH
    // ======================================================================
    if (user.email === 'admin@gmail.com') {
      setSites((prev) => prev.filter((site) => site.id !== id));
      alert('Place deleted successfully! (Local Mock State Action)');
      return;
    }
    // ======================================================================

    try {
      const response = await fetch(`${API_URL}/api/places/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('tara_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Optimistically remove record from client state to reflect modification instantly
        setSites((prev) => prev.filter((site) => site.id !== id));
        alert('Place deleted successfully!');
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(errData.message || 'Failed to delete place. Please check admin permissions.');
      }
    } catch (error) {
      console.error('Deletion Exception:', error);
      alert('Something went wrong. Could not process deletion command.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] p-4 md:p-8 lg:p-12 text-black">
      <div className="max-w-6xl mx-auto">

        {/* CONTROLS DISPLAY BANNER HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
              Admin Control Panel
            </h1>
            <p className="text-gray-500 mt-2 text-sm md:text-base">
              Manage and synchronize all public tourism hubs across Cordova.
            </p>
          </div>

          <button
            onClick={() => router.push('/admin-dashboard/create')}
            className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition transform active:scale-95"
          >
            + Add New Place
          </button>
        </div>

        {/* MAIN DATA RENDER GRID MATRIX */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left">
                  <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs tracking-wider">
                    Site Name
                  </th>
                  <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-400 font-medium text-sm tracking-wide">
                      Synchronizing local records pipeline...
                    </td>
                  </tr>
                ) : sites.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-400 font-medium text-sm">
                      No matching registered places found in the database.
                    </td>
                  </tr>
                ) : (
                  sites.map((site) => (
                    <tr key={site.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-5 font-bold text-gray-950 text-sm md:text-base break-words max-w-sm">
                        {site.name}
                      </td>
                      <td className="px-6 py-5 text-gray-600 text-sm md:text-base">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 capitalize">
                          {site.category}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => router.push(`/admin-dashboard/edit/${site.id}`)}
                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-bold text-xs transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(site.id)}
                            className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-bold text-xs transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}