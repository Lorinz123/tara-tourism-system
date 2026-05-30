'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import {
  Search,
  MapPin,
  Umbrella,
  Landmark,
  Bed,
  Utensils,
} from 'lucide-react';

import Navbar from '../components/Navbar';

// Dynamic API URL entrypoint setup
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tara-tourism-system.onrender.com';

export default function ExplorePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [allPlaces, setAllPlaces] = useState<any[]>([]);

  /*
  |--------------------------------------------------------------------------
  | AUTH + FETCH
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    const updateAuthStatus = () => {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/login');
      } else {
        setUser(JSON.parse(userData));
        setLoading(false);
      }
    };

    updateAuthStatus();
    fetchAllData();

    window.addEventListener('auth-change', updateAuthStatus);

    return () => {
      window.removeEventListener('auth-change', updateAuthStatus);
    };
  }, [router]);

  /*
  |--------------------------------------------------------------------------
  | FETCH EVERYTHING ONCE
  |--------------------------------------------------------------------------
  */
  const fetchAllData = async () => {
    try {
      /*
      |--------------------------------------------------------------------------
      | FETCH MENU ITEMS
      |--------------------------------------------------------------------------
      */
      // FIXED: Exchanged hardcoded domain reference for dynamic template literals
      const menuRes = await fetch(`${API_URL}/api/menu-items`);
      const menuData = await menuRes.json();

      const formattedMenus = menuData.map((item: any) => ({
        id: `menu-${item.id}`,
        name: item.name,
        category: item.category || 'Restaurant',
        location: item.owner?.restaurant || 'Cordova',
        description: item.description,
        price: item.price,
        image: item.image_url || 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600',
        type: 'restaurant',
        owner: {
          tagline: item.owner?.tagline || '',
          announcement: item.owner?.announcement || '',
          hero_image: item.owner?.hero_image || '',
        },
      }));

      /*
      |--------------------------------------------------------------------------
      | FETCH TOURISM PLACES
      |--------------------------------------------------------------------------
      */
      // FIXED: Exchanged hardcoded domain reference for dynamic template literals
      const placesRes = await fetch(`${API_URL}/api/all-places`);
      const placesData = await placesRes.json();

      const formattedPlaces = placesData.map((item: any) => ({
        id: `place-${item.id}`,
        name: item.name,
        category: item.category,
        location: item.address || 'Cordova',
        description: item.description,
        image: item.image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200',
        type: 'tourism',
      }));

      /*
      |--------------------------------------------------------------------------
      | COMBINE BOTH
      |--------------------------------------------------------------------------
      */
      setAllPlaces([
        ...formattedMenus,
        ...formattedPlaces,
      ]);

    } catch (err) {
      console.error('Fetch Error:', err);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | FILTERS
  |--------------------------------------------------------------------------
  */
  const filteredPlaces = allPlaces.filter((place) => {
    const matchesSearch =
      place.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      activeCategory === 'All' || place.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  /*
  |--------------------------------------------------------------------------
  | CATEGORIES
  |--------------------------------------------------------------------------
  */
  const categories = [
    { name: 'All', icon: null },
    { name: 'Restaurant', icon: <Utensils size={16} /> },
    { name: 'Beach', icon: <Umbrella size={16} /> },
    { name: 'Heritage', icon: <Landmark size={16} /> },
    { name: 'Hotel', icon: <Bed size={16} /> },
  ];

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#FDFCF8]">
      <Navbar />

      <div className="flex flex-col md:flex-row pt-20">
        {/* SIDEBAR */}
        <aside className="w-full md:w-80 md:h-[calc(100vh-80px)] md:sticky top-20 p-4 md:p-8 border-b md:border-b-0 md:border-r border-gray-100 bg-[#FDFCF8] z-20">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-6 md:mb-8">
            Explore Cordova
          </h2>

          <div className="space-y-6 md:space-y-8">
            {/* SEARCH */}
            <div>
              <label className="block text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search items..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* CATEGORIES */}
            <div>
              <label className="block text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all border ${
                      activeCategory === cat.name
                        ? 'bg-orange-600 border-orange-600 text-white shadow-md'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-orange-400'
                    }`}
                  >
                    {cat.icon}
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* HEADER */}
            <div className="mb-8">
              <p className="text-gray-500 italic">
                Welcome back, {user?.name}
              </p>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Found {filteredPlaces.length} items in Cordova
              </h1>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
              {filteredPlaces.map((place) => (
                <Link key={place.id} href={`/explore/${place.id}`}>
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group relative cursor-pointer">
                    {/* IMAGE */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={place.image}
                        alt={place.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-gray-700 shadow-sm uppercase tracking-wider">
                        {place.category}
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-2">
                        {place.name}
                      </h3>
                      <div className="flex items-center text-gray-400 text-xs mb-4">
                        <MapPin size={14} className="mr-1" />
                        <span>{place.location}</span>
                      </div>
                      <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                        {place.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}