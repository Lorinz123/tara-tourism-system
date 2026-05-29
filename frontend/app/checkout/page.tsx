'use client';
import React, { useState } from 'react';
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cart } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', address: '', phone: '' });

  const total = cart.reduce((sum, item) => sum + (Number(item.price || 0) * (item.quantity || 1)), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the order to your API
    alert('Order placed successfully!');
    router.push('/'); // Redirect home after "purchase"
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] pt-24 px-8 pb-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-gray-950 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
            <input 
              required
              type="text" 
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-600 outline-none"
              placeholder="Juan Dela Cruz"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Delivery Address in Cordova</label>
            <textarea 
              required
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-600 outline-none"
              placeholder="Sitio, Barangay, Cordova"
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
            <input 
              required
              type="tel" 
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-600 outline-none"
              placeholder="0912 345 6789"
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div className="border-t pt-6 mt-6">
            <p className="text-xl font-black text-gray-950 mb-4">Total Amount: ₱{total.toFixed(2)}</p>
            <button 
              type="submit"
              className="w-full bg-orange-600 text-white py-4 rounded-xl font-black text-lg hover:bg-orange-700 transition shadow-lg"
            >
              Confirm Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}