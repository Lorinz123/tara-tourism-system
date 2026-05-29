'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Coffee, 
  Umbrella, 
  Landmark, 
  Bed, 
  Star, 
  MapPin, 
  ChevronRight 
} from 'lucide-react';

const vibes = [
  { id: 'restaurant', name: 'Restaurant', icon: <Coffee />, color: 'bg-orange-100 text-orange-600' },
  { id: 'beach', name: 'Beach', icon: <Umbrella />, color: 'bg-cyan-100 text-cyan-600' },
  { id: 'heritage', name: 'Heritage', icon: <Landmark />, color: 'bg-amber-100 text-amber-600' },
  { id: 'hotel', name: 'Hotel', icon: <Bed />, color: 'bg-indigo-100 text-indigo-600' },
];

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  const [allPlaces] = useState([
    {
      id: 1,
      name: '10K Roses Cafe',
      category: 'Heritage',
      location: 'Day-as, Cordova',
      rating: 4.5,
      description: 'A magical field of 10,000 white LED roses that light up at night, offering a breathtaking view of the sea.',
      tags: ['Instagrammable', 'Cafe', 'Night View'],
      image: 'https://images.unsplash.com/photo-1518173946687-a4c8a98039f5?q=80&w=600'
    },
    {
      id: 2,
      name: 'Lantaw Floating Restaurant',
      category: 'Restaurant',
      location: 'Cordova, Cebu',
      rating: 4.6,
      description: 'Floating restaurant offering classic Filipino dishes with a beautiful view of the Cebu City skyline across the water.',
      tags: ['Seafood', 'Filipino', 'Scenic'],
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600'
    },
    {
      id: 3,
      name: 'Gilutongan Island',
      category: 'Beach',
      location: 'Cordova Waters',
      rating: 4.9,
      description: 'A popular island hopping destination in Cordova known for its crystal clear marine sanctuary and snorkeling spots.',
      tags: ['Diving', 'Snorkeling', 'Island Hopping'],
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600'
    }
  ]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen w-full font-sans bg-[#FDFCF8] overflow-x-hidden">
      
      {/* HERO SECTION */}
      <div className="relative min-h-screen w-full overflow-hidden">
        
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: `url(hero-image.jpg)` }} 
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <main className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 sm:px-6 pt-24">
          
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-serif font-bold text-white mb-4 drop-shadow-lg leading-tight">
            TARA, <span className="text-orange-500">Bisita Cordova</span>
          </h1>

          <p className="max-w-2xl text-sm sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-10 drop-shadow-md px-2">
            Experience the hidden gems of Cordova. From the 10,000 Roses to fresh seafood by the bay.
          </p>

          {/* SEARCH BAR */}
          <div className="w-full max-w-3xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 bg-white/20 backdrop-blur-md rounded-3xl sm:rounded-full p-3 sm:p-2 border border-white/30 shadow-2xl">

            <div className="flex items-center flex-1 px-2 sm:px-4 text-white">
              <Search className="text-white/70 mr-3 flex-shrink-0" size={20} />

              <input 
                type="text" 
                placeholder="Search places in Cordova..." 
                className="bg-transparent border-none outline-none w-full placeholder:text-white/60 text-white text-sm sm:text-base"
              />
            </div>

            <Link href="/explore" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-2xl sm:rounded-full font-bold transition whitespace-nowrap">
                Explore
              </button>
            </Link>

          </div>

        </main>
      </div>

      {/* VIBE SECTION */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        
        <div className="max-w-6xl mx-auto text-center">

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-2">
            What's your vibe today?
          </h2>

          <p className="text-gray-500 mb-10 sm:mb-12 text-sm sm:text-base">
            Find exactly what you're looking for in Cordova
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

            {vibes.map((vibe) => (

              <Link href="/explore" key={vibe.id}>

                <button className="group w-full flex flex-col items-center justify-center p-5 sm:p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">

                  <div className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full mb-4 transition-transform group-hover:scale-110 ${vibe.color}`}>
                    <div className="w-6 h-6 sm:w-7 sm:h-7">
                      {vibe.icon}
                    </div>
                  </div>

                  <span className="font-semibold text-sm sm:text-base text-gray-800 group-hover:text-orange-600 transition-colors">
                    {vibe.name}
                  </span>

                </button>

              </Link>
            ))}

          </div>

        </div>
      </section>

      {/* MUST VISIT SECTION */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#FDFCF8]">
        
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-5 mb-10">

            <div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-2">
                Must-Visit Places
              </h2>

              <p className="text-gray-500 text-sm sm:text-base">
                The best of Cordova, handpicked for you.
              </p>
            </div>

            <Link href="/explore">

              <button className="flex items-center text-gray-900 font-semibold hover:text-orange-600 transition group">
                See all
                <ChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" size={20} />
              </button>

            </Link>

          </div>

          {/* CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">

            {allPlaces.map((place) => (

              <div 
                key={place.id} 
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 group"
              >

                <div className="relative h-56 sm:h-64 overflow-hidden">

                  <img 
                    src={place.image} 
                    alt={place.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />

                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm">
                    {place.category}
                  </div>

                </div>

                <div className="p-5 sm:p-6">

                  <div className="flex justify-between items-start mb-2 gap-3">

                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                      {place.name}
                    </h3>

                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg flex-shrink-0">
                      <Star className="text-yellow-500 fill-yellow-500 mr-1" size={14} />
                      <span className="text-xs font-bold text-gray-700">
                        {place.rating}
                      </span>
                    </div>

                  </div>

                  <div className="flex items-center text-gray-400 text-sm mb-4">
                    <MapPin size={14} className="mr-1 flex-shrink-0" />
                    <span className="truncate">{place.location}</span>
                  </div>

                  <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-2">
                    {place.description}
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {place.tags.map(tag => (

                      <span 
                        key={tag} 
                        className="px-3 py-1 bg-gray-50 text-gray-500 text-[10px] font-bold rounded-full border border-gray-100 uppercase tracking-wider"
                      >
                        {tag}
                      </span>

                    ))}

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>
      </section>

      {/* BUSINESS OWNER CTA */}
      <section className="relative py-20 sm:py-24 px-4 sm:px-8 overflow-hidden">

        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200')` }} 
        >
          <div className="absolute inset-0 bg-orange-600/80 mix-blend-multiply" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">

          <h2 className="text-3xl sm:text-5xl font-serif font-bold mb-6 leading-tight">
            Are you a Cordova Business Owner?
          </h2>

          <p className="text-base sm:text-xl mb-10 text-white/90 leading-relaxed px-2">
            Join TARA and let tourists discover your amazing food, beautiful resort, or unique experience.
          </p>

          <button className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-orange-900 px-8 sm:px-10 py-4 rounded-xl font-bold text-base sm:text-lg shadow-xl transition-all transform hover:-translate-y-1 active:scale-95">
            Claim Your Listing
          </button>

        </div>
      </section>

    </div>
  );
}