'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  useParams,
} from 'next/navigation';

import Navbar from '../../components/Navbar';

import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
} from 'lucide-react';

import {
  useCart,
} from '@/app/context/CartContext';

export default function DetailPage() {

  const { id } = useParams();

  const { addToCart } = useCart();

  const [item, setItem] =
    useState<any>(null);

  const [menuItems, setMenuItems] =
    useState<any[]>([]);

  const [notification, setNotification] =
    useState<string | null>(null);

  /*
  |--------------------------------------------------------------------------
  | DETECT TYPE
  |--------------------------------------------------------------------------
  */
  const rawId = String(id);

  const isMenu =
    rawId.startsWith('menu-');

  const isPlace =
    rawId.startsWith('place-');

  const actualId =
    rawId.split('-')[1];

  /*
  |--------------------------------------------------------------------------
  | NOTIFICATION
  |--------------------------------------------------------------------------
  */
  useEffect(() => {

    if (notification) {

      const timer =
        setTimeout(() => {

          setNotification(null);

        }, 1000);

      return () =>
        clearTimeout(timer);
    }

  }, [notification]);

  /*
  |--------------------------------------------------------------------------
  | FETCH DATA
  |--------------------------------------------------------------------------
  */
  useEffect(() => {

    const controller =
      new AbortController();

    const fetchData = async () => {

      try {

        /*
        |--------------------------------------------------------------------------
        | RESTAURANT
        |--------------------------------------------------------------------------
        */
        if (isMenu) {

          const itemRes =
            await fetch(
              `http://127.0.0.1:8000/api/menu-items/${actualId}`,
              {
                signal:
                  controller.signal,
              }
            );

          const data =
            await itemRes.json();

          setItem(data);

          /*
          |--------------------------------------------------------------------------
          | FETCH ONLY SAME RESTAURANT MENU
          |--------------------------------------------------------------------------
          */
          const menuRes =
            await fetch(
              `http://127.0.0.1:8000/api/owner-menu/${data.user_id}`,
              {
                signal:
                  controller.signal,
              }
            );

          const menuData =
            await menuRes.json();

          setMenuItems(menuData);
        }

        /*
        |--------------------------------------------------------------------------
        | TOURISM PLACE
        |--------------------------------------------------------------------------
        */
        if (isPlace) {

          const placeRes =
            await fetch(
              `http://127.0.0.1:8000/api/places/${actualId}`,
              {
                signal:
                  controller.signal,
              }
            );

          const placeData =
            await placeRes.json();

          setItem(placeData);
        }

      } catch (err: any) {

        if (
          err?.name !==
          'AbortError'
        ) {

          console.error(err);
        }
      }
    };

    fetchData();

    return () =>
      controller.abort();

  }, [id]);

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */
  if (!item) {

    return (

      <div className="min-h-screen flex items-center justify-center text-gray-700">

        Loading...

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-[#FDFCF8] pb-20">

      <Navbar />

      {/* HERO IMAGE */}
      <div className="relative h-[220px] md:h-[300px] w-full overflow-hidden z-0">

        <img
          src={
            isMenu
              ? item.owner?.hero_image ||
                'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2000'
              : item.image_url ||
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200'
          }
          alt="Hero"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

      </div>

      <main className="max-w-5xl mx-auto px-4 md:px-6 -mt-16 md:-mt-24 relative z-10">

        {/* ====================================================== */}
        {/* RESTAURANT VIEW */}
        {/* ====================================================== */}
        {isMenu && (

          <>
            {/* RESTAURANT INFO */}
            <div className="bg-white p-4 md:p-8 rounded-3xl shadow-2xl border border-gray-100 mb-12">

              <div className="flex flex-col lg:flex-row gap-6 justify-between items-start">

<div className="space-y-4 min-w-0">
                  <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900">

                    {item.owner?.restaurant}

                  </h1>

                  <p className="text-base md:text-xl text-gray-700 italic font-medium">

                    "
                    {item.owner?.tagline ||
                      'No tagline available'}
                    "

                  </p>

                  {item.owner
                    ?.announcement && (

                    <div className="bg-orange-600 p-4 rounded-xl shadow-md">

                      <p className="text-white text-xs font-black uppercase tracking-widest mb-1">

                        Announcement

                      </p>

                      <p className="text-white text-base font-semibold">

                        {
                          item.owner
                            ?.announcement
                        }

                      </p>

                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 md:gap-6 mt-6 text-gray-800">

                    <div className="flex items-center gap-2 font-bold">

                      <MapPin
                        size={20}
                        className="text-orange-600"
                      />

                      {
                        item.owner
                          ?.address
                      }

                    </div>

                    <div className="flex items-center gap-2 font-bold">

                      <Clock
                        size={20}
                        className="text-orange-600"
                      />

                      {
                        item.owner
                          ?.hours
                      }

                    </div>

                    <div className="flex items-center gap-2 font-bold">

                      <Phone
                        size={20}
                        className="text-orange-600"
                      />

                      {
                        item.owner
                          ?.contact
                      }

                    </div>

                  </div>

                </div>

<button className="w-full lg:w-auto flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-black text-base md:text-lg hover:bg-orange-700 transition shadow-lg">
                  <MessageCircle size={20} />

                  Message Owner

                </button>

              </div>

            </div>

            {/* FULL MENU */}
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">

              Full Menu

            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

              {menuItems.map(
                (m: any) => (

                  <div
                    key={m.id}
className="bg-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center"                  >

                    <div className="flex-1 min-w-0">

                      <h3 className="font-bold text-lg text-gray-900">

                        {m.name}

                      </h3>

                      <p className="text-gray-700 text-sm mt-1">

                        {
                          m.description
                        }

                      </p>

                      <p className="font-extrabold text-orange-700 mt-2 text-lg">

                        ₱{m.price}

                      </p>

                    </div>

                    <button
                      onClick={() => {

                        addToCart(m);

                        setNotification(
                          `${m.name} added to cart!`
                        );
                      }}
className="w-full sm:w-auto bg-orange-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-700 transition"                    >

                      Add

                    </button>

                  </div>
                )
              )}

            </div>
          </>
        )}

        {/* ====================================================== */}
        {/* TOURISM PLACE VIEW */}
        {/* ====================================================== */}
        {isPlace && (

<div className="bg-white p-5 md:p-10 rounded-3xl shadow-2xl border border-gray-100">
            <div className="mb-6">
              <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-bold uppercase">
                {item.category}
              </span>
            </div>

<h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 break-words">
  {item.name}
</h1>
<div className="flex items-start gap-2 text-gray-600 mb-8 font-medium break-words">              <MapPin size={20} className="text-orange-600" />
              <span className="break-words">
  {item.address}
</span>
            </div>

<p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8">              {item.description}
            </p>

            {/* --- ADDED BELOW DESCRIPTION --- */}
            {(item.category?.toLowerCase() === 'hotel' || item.category?.toLowerCase() === 'accommodation') && item.booking_url && (
  <a 
    href={item.booking_url} 
    target="_blank" 
    rel="noopener noreferrer"
    className="block w-full text-center bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition text-lg shadow-lg"
  >
    Book Now
  </a>
)}

          </div>
        )}

      </main>

      {/* NOTIFICATION */}
      {notification && (

        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-6 bg-orange-600 text-white px-4 md:px-6 py-3 rounded-xl shadow-xl font-bold z-50 text-sm md:text-base">

          {notification}

        </div>
      )}

    </div>
  );
}