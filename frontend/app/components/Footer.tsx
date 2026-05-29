// app/components/Navbar.tsx
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#1A1614] text-white py-16 px-8 mt-auto border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-xl font-bold tracking-tight">TARA Bisita <span className="text-orange-500">Cordova</span></h2>
          </div>
          <p className="text-gray-400 max-w-sm leading-relaxed text-sm">
            Your definitive guide to exploring the beauty, culture, and flavors of Cordova, Philippines. 
            Come with us and discover what makes Cordova truly magical.
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-6 text-gray-200">Quick Links</h3>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li className="hover:text-orange-500 cursor-pointer transition">Restaurants</li>
            <li className="hover:text-orange-500 cursor-pointer transition">Beaches</li>
            <li className="hover:text-orange-500 cursor-pointer transition">Heritage Sites</li>
            <li className="hover:text-orange-500 cursor-pointer transition">Hotels & Resorts</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-6 text-gray-200">Partners</h3>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li className="hover:text-orange-500 cursor-pointer transition">Claim your listing</li>
            <li className="hover:text-orange-500 cursor-pointer transition">Owner Dashboard</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/10 mt-16 pt-8 text-center text-gray-500 text-xs">
        © 2026 TARA Bisita Cordova. All rights reserved.
      </div>
    </footer>
  );
}