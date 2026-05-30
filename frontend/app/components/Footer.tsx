'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getLocalUser, LocalUser } from '@/lib/auth';

export default function Footer() {
  const [userData, setUserData] = useState<LocalUser | null>(null);

  /*
  |----------------------------------------------------------------------
  | DASHBOARD URL GENERATOR
  |----------------------------------------------------------------------
  */
  const getDashboardUrl = () => {
    if (userData?.role === 'admin') {
      return '/admin-dashboard';
    }
    if (userData?.role === 'owner') {
      return userData?.business_type === 'hotel'
        ? '/owner-dashboard'
        : '/dashboard';
    }
    return '/dashboard';
  };

  /*
  |----------------------------------------------------------------------
  | EFFECT: SYNC AUTH STATE FOR FOOTER ROUTING
  |----------------------------------------------------------------------
  */
  useEffect(() => {
    const updateAuthStatus = () => {
      const storedUser = getLocalUser();
      setUserData(storedUser || null);
    };

    updateAuthStatus();

    // Re-run syncing on native auth events
    window.addEventListener('auth-change', updateAuthStatus);
    return () => {
      window.removeEventListener('auth-change', updateAuthStatus);
    };
  }, []);

  return (
    <footer className="bg-[#1A1614] text-white py-16 px-8 mt-auto border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* BRANDING COL */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-xl font-bold tracking-tight">
              <Link href="/" className="hover:opacity-90 transition">
                TARA Bisita <span className="text-orange-500">Cordova</span>
              </Link>
            </h2>
          </div>
          <p className="text-gray-400 max-w-sm leading-relaxed text-sm">
            Your definitive guide to exploring the beauty, culture, and flavors of Cordova, Philippines. 
            Come with us and discover what makes Cordova truly magical.
          </p>
        </div>

        {/* QUICK LINKS FILTER LINKS */}
        <div>
          <h3 className="font-bold mb-6 text-gray-200 text-sm tracking-wide uppercase">Quick Links</h3>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li>
              <Link href="/explore?cat=Restaurant" className="hover:text-orange-500 transition block">
                Restaurants
              </Link>
            </li>
            <li>
              <Link href="/explore?cat=Beaches" className="hover:text-orange-500 transition block">
                Beaches
              </Link>
            </li>
            <li>
              <Link href="/explore?cat=Heritage" className="hover:text-orange-500 transition block">
                Heritage Sites
              </Link>
            </li>
            <li>
              <Link href="/explore?cat=Hotel" className="hover:text-orange-500 transition block">
                Hotels & Resorts
              </Link>
            </li>
          </ul>
        </div>

        {/* B2B OWNER LINKS */}
        <div>
          <h3 className="font-bold mb-6 text-gray-200 text-sm tracking-wide uppercase">Partners</h3>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li>
              <Link href="/register?type=owner" className="hover:text-orange-500 transition block">
                Claim your listing
              </Link>
            </li>
            <li>
              <Link href={getDashboardUrl()} className="hover:text-orange-500 transition block">
                {userData?.role === 'owner' || userData?.role === 'admin' 
                  ? 'Owner Dashboard' 
                  : 'Partner Portal'}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* COPYRIGHT METADATA BAR */}
      <div className="max-w-7xl mx-auto border-t border-white/10 mt-16 pt-8 text-center text-gray-500 text-xs">
        &copy; 2026 TARA Bisita Cordova. All rights reserved.
      </div>
    </footer>
  );
}