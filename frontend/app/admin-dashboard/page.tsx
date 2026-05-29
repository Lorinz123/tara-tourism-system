'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Site {
  id: number;
  name: string;
  category: string;
  description?: string;
}

export default function AdminDashboard() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // ADMIN PROTECTION
    if (user.role !== 'admin') {
      router.push('/login');
      return;
    }

    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/all-places'
      );

      const data = await response.json();

      setSites(data);
    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm(
      'Delete this place permanently?'
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/places/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        setSites((prev) =>
          prev.filter((site) => site.id !== id)
        );

        alert('Place deleted successfully!');
      } else {
        alert('Failed to delete place.');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong.');
    }
  };

  return (
  <div className="min-h-screen bg-[#FDFCF8] p-4 md:p-8 lg:p-12">

    <div className="max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">

        <div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900">
            Admin Control Panel
          </h1>

          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Manage all tourism sites in Cordova.
          </p>
        </div>

        <button
          onClick={() =>
            router.push('/admin-dashboard/create')
          }
          className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition"
        >
          + Add New Place
        </button>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">

        {/* RESPONSIVE TABLE WRAPPER */}
        <div className="overflow-x-auto">

          <table className="w-full min-w-[600px]">

            <thead className="bg-gray-50">

              <tr className="text-left">

                <th className="px-4 md:px-6 py-4 font-bold text-gray-500 uppercase text-xs md:text-sm">
                  Site Name
                </th>

                <th className="px-4 md:px-6 py-4 font-bold text-gray-500 uppercase text-xs md:text-sm">
                  Category
                </th>

                <th className="px-4 md:px-6 py-4 font-bold text-gray-500 uppercase text-xs md:text-sm">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Loading places...
                  </td>
                </tr>
              ) : sites.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No places found.
                  </td>
                </tr>
              ) : (
                sites.map((site) => (
                  <tr
                    key={site.id}
                    className="border-t border-gray-100"
                  >

                    <td className="px-4 md:px-6 py-5 font-bold text-gray-950 text-sm md:text-base break-words">
                      {site.name}
                    </td>

                    <td className="px-4 md:px-6 py-5 text-gray-600 capitalize text-sm md:text-base">
                      {site.category}
                    </td>

                    <td className="px-4 md:px-6 py-5">

                      <div className="flex flex-col sm:flex-row gap-2">

                        {/* EDIT BUTTON */}
                        <button
                          onClick={() =>
                            router.push(
                              `/admin-dashboard/edit/${site.id}`
                            )
                          }
                          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm"
                        >
                          Edit
                        </button>

                        {/* DELETE BUTTON */}
                        <button
                          onClick={() =>
                            handleDelete(site.id)
                          }
                          className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm"
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
