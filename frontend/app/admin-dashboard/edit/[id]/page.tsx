'use client';

import React, {
  useEffect,
  useState,
} from 'react';

import {
  useParams,
  useRouter,
} from 'next/navigation';

export default function EditPlacePage() {

  const router = useRouter();

  const params = useParams();

  const id = params.id;

  const [loading, setLoading] =
    useState(true);

  const [formData, setFormData] =
    useState({

      name: '',

      category: 'Beach',

      address: '',

      description: '',

      image_url: '',
    });

  /*
  |--------------------------------------------------------------------------
  | FETCH CURRENT PLACE
  |--------------------------------------------------------------------------
  */
  useEffect(() => {

    fetchPlace();

  }, []);

  const fetchPlace = async () => {

    try {

      const res = await fetch(
        `http://127.0.0.1:8000/api/places/${id}`
      );

      const data = await res.json();

      setFormData({

        name: data.name || '',

        category:
          data.category || 'Beach',

        address:
          data.address || '',

        description:
          data.description || '',

        image_url:
          data.image_url || '',
      });

    } catch (err) {

      console.error(err);

      alert('Failed to load place.');

    } finally {

      setLoading(false);

    }
  };

  /*
  |--------------------------------------------------------------------------
  | HANDLE INPUT
  |--------------------------------------------------------------------------
  */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | UPDATE PLACE
  |--------------------------------------------------------------------------
  */
  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      const response = await fetch(
        `http://127.0.0.1:8000/api/places/${id}`,
        {

          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify(
            formData
          ),
        }
      );

      if (response.ok) {

        alert(
          'Place updated successfully!'
        );

        router.push(
          '/admin-dashboard'
        );

      } else {

        alert(
          'Failed to update place.'
        );

      }

    } catch (err) {

      console.error(err);

      alert('Something went wrong.');

    }
  };

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center text-gray-700">

        Loading...

      </div>

    );
  }

  return (

    <div className="min-h-screen bg-[#FDFCF8] p-10">

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">

        {/* IMAGE PREVIEW */}
        <div className="h-72 overflow-hidden relative">

          <img
            src={
              formData.image_url ||
              'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200'
            }
            alt="Preview"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/30 flex items-end p-8">

            <h1 className="text-4xl font-black text-white">
              Edit Place
            </h1>

          </div>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-6"
        >

          {/* NAME */}
          <div>

            <label className="block text-sm font-bold text-gray-700 mb-2">
              Place Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-500"
            />

          </div>

          {/* CATEGORY */}
          <div>

            <label className="block text-sm font-bold text-gray-700 mb-2">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-orange-500"
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

            <label className="block text-sm font-bold text-gray-700 mb-2">
              Address
            </label>

            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-500"
            />

          </div>

          {/* IMAGE URL */}
          <div>

            <label className="block text-sm font-bold text-gray-700 mb-2">
              Image URL
            </label>

            <input
              type="text"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-500"
            />

          </div>

          {/* DESCRIPTION */}
          <div>

            <label className="block text-sm font-bold text-gray-700 mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-orange-500"
            />

          </div>

          {/* BUTTONS */}
          <div className="flex gap-4">

            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition"
            >

              Save Changes

            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  '/admin-dashboard'
                )
              }
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-bold transition"
            >

              Cancel

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}