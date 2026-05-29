'use client';
import React, { useState } from 'react';
import { useCart } from '@/app/context/CartContext';

export default function CheckoutPage() {
  const { cart } = useCart();
  const [method, setMethod] = useState('GCash');
  const total = cart.reduce((sum, item) => sum + (Number(item.price || 0) * (item.quantity || 1)), 0);

  return (
    <div className="min-h-screen bg-[#FDFCF8] py-12 px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-4xl font-serif font-black text-gray-950">Checkout</h1>

        {/* 1. Order Summary Card */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
          <h2 className="font-bold text-lg mb-6 text-gray-950">Order Summary</h2>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-100">
              <div className="flex-1">
                <p className="text-orange-600 font-bold text-sm">{item.restaurant_name || 'Restaurant'}</p>
                <p className="font-extrabold text-gray-950">{item.quantity}x {item.name}</p>
              </div>
              <p className="font-black text-gray-950">₱{(Number(item.price) * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 font-black text-2xl text-gray-950">
            <span>Total</span>
            <span className="text-orange-600">₱{total.toFixed(2)}</span>
          </div>
        </div>

        {/* 2. Delivery Address Card */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
          <h2 className="font-bold text-lg mb-4 text-gray-950">Delivery Address</h2>
          <label className="block text-sm font-black text-gray-700 mb-2">Full Address</label>
          <input className="w-full p-4 border border-gray-300 rounded-xl font-bold text-gray-950 focus:ring-2 focus:ring-orange-600 outline-none" placeholder="House/Unit number, Street, Barangay, City" />
        </div>

        {/* 3. Payment Method Card */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
          <h2 className="font-bold text-lg mb-4 text-gray-950">Payment Method</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {['GCash', 'Maya', 'Credit / Debit Card', 'Cash on Delivery'].map((m) => (
              <button key={m} onClick={() => setMethod(m)} 
                className={`p-4 border-2 rounded-xl text-sm font-black transition ${method === m ? 'border-orange-600 text-orange-600 bg-orange-50' : 'border-gray-200 text-gray-700'}`}>
                {m}
              </button>
            ))}
          </div>

          {/* Conditional Inputs */}
          {method === 'Credit / Debit Card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-black text-gray-700 mb-1">Cardholder Name</label>
                <input className="w-full p-4 border border-gray-400 rounded-xl font-bold text-gray-950 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-orange-600 outline-none" placeholder="Name on card" />
              </div>
              <div>
                <label className="block text-sm font-black text-gray-700 mb-1">Card Number</label>
                <input className="w-full p-4 border border-gray-400 rounded-xl font-bold text-gray-950 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-orange-600 outline-none" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-1">Expiry Date</label>
                  <input className="w-full p-4 border border-gray-400 rounded-xl font-bold text-gray-950 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-orange-600 outline-none" placeholder="MM/YY" />
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-1">CVV</label>
                  <input className="w-full p-4 border border-gray-400 rounded-xl font-bold text-gray-950 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-orange-600 outline-none" placeholder="123" />
                </div>
              </div>
            </div>
          )}

          {(method === 'GCash' || method === 'Maya') && (
            <div>
              <label className="block text-sm font-black text-gray-700 mb-2">Mobile Number</label>
              <input className="w-full p-4 border border-gray-400 rounded-xl font-bold text-gray-950 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-orange-600 outline-none" placeholder="09XXXXXXXXX" />
            </div>
          )}

          {method === 'Cash on Delivery' && (
            <div className="p-4 bg-yellow-50 text-yellow-800 text-sm font-bold rounded-xl border border-yellow-200">
              Please have the exact amount ready upon delivery. Our rider will collect ₱{total.toFixed(2)}.
            </div>
          )}
        </div>

        <button className="w-full bg-orange-600 text-white py-6 rounded-2xl font-black text-xl hover:bg-orange-700 transition shadow-lg">
          Place Order — ₱{total.toFixed(2)}
        </button>
      </div>
    </div>
  );
}