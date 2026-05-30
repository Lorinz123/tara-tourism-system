'use client';

import React, { useState } from 'react';
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';

// Dynamic API URL entrypoint setup
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tara-tourism-system.onrender.com';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '', phone: '' });

  const total = cart.reduce((sum, item) => sum + (Number(item.price || 0) * (item.quantity || 1)), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setLoading(true);

    try {
      // Map out the structured payload matching your backend expectations
      const orderPayload = {
        customer_name: formData.name,
        delivery_address: formData.address,
        phone_number: formData.phone,
        total_amount: total,
        // Group menu items and track metadata ids alongside custom quantities
        items: cart.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          price: Number(item.price)
        }))
      };

      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tara_token')}`
        },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Something went wrong processing your order.');
      }

      alert('Order placed successfully!');
      clearCart(); // FIXED: Wipes state/localStorage cache instantly to avoid duplicate processing
      router.push('/'); 
    } catch (err: any) {
      console.error("Checkout Error:", err);
      alert(err.message || "Failed to submit order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] pt-24 px-4 sm:px-8 pb-20 text-black">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: CUSTOMER DELIVERY DETAILS FORM */}
        <div className="lg:col-span-7">
          <h1 className="text-4xl font-black text-gray-950 mb-8">Checkout</h1>
          
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
              <input 
                required
                type="text" 
                disabled={loading}
                className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-600 outline-none disabled:bg-gray-50 text-black"
                placeholder="Juan Dela Cruz"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Delivery Address in Cordova</label>
              <textarea 
                required
                rows={3}
                disabled={loading}
                className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-600 outline-none disabled:bg-gray-50 text-black"
                placeholder="Sitio, Barangay, Cordova, Cebu"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
              <input 
                required
                type="tel" 
                disabled={loading}
                className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-600 outline-none disabled:bg-gray-50 text-black"
                placeholder="0912 345 6789"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div className="border-t pt-6">
              <button 
                type="submit"
                disabled={loading || cart.length === 0}
                className="w-full bg-orange-600 text-white py-4 rounded-xl font-black text-lg hover:bg-orange-700 transition shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing Order...' : 'Confirm Order'}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE ORDER ITEM SUMMARY GRID */}
        <div className="lg:col-span-5 lg:mt-20">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm sticky top-28">
            <h3 className="text-xl font-black text-gray-950 mb-4 border-b pb-3">Order Summary</h3>
            
            {cart.length === 0 ? (
              <p className="text-gray-500 text-sm py-4">Your cart is empty.</p>
            ) : (
              <>
                <div className="max-h-64 overflow-y-auto space-y-4 mb-4 pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-start gap-4 text-sm">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-gray-900 truncate">
                          {item.name} <span className="text-orange-600 font-black">x{item.quantity}</span>
                        </p>
                        {item.description && (
                          <p className="text-gray-500 text-xs truncate">{item.description}</p>
                        )}
                      </div>
                      <p className="font-bold text-gray-950 flex-shrink-0">
                        ₱{(Number(item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 bg-gray-50 -mx-6 -mb-6 p-6 rounded-b-3xl">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-700">Total Due:</span>
                    <span className="text-2xl font-black text-orange-600">₱{total.toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}