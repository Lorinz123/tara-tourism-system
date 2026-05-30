'use client';

import React, { useState } from 'react';
import { Minus, Plus, CreditCard, Wallet, Truck } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';

// Central API configuration gateway fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tara-tourism-system.onrender.com';

export default function CheckoutPage() {
  const { cart, updateQuantity, clearCart } = useCart();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState('GCash');
  
  // Controlled form state tracking inputs cleanly
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * (item.quantity || 1),
    0
  );

  /*
  |----------------------------------------------------------------------
  | ASYNCHRONOUS TRANSACTION PROCESSOR
  |----------------------------------------------------------------------
  */
  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert("Your basket is empty.");
      return;
    }
    if (!formData.address.trim() || !formData.phone.trim()) {
      alert("Please fill out your delivery address and contact phone details.");
      return;
    }

    setLoading(true);

    try {
      // Assemble payment metadata parameters
      const paymentDetails = {
        method,
        phone_number: method === 'GCash' || method === 'Maya' ? formData.phone : undefined,
        card_metadata: method === 'Credit / Debit Card' ? {
          holder: formData.cardName,
          expiry: formData.expiry
        } : undefined
      };

      const orderPayload = {
        delivery_address: formData.address,
        phone_number: formData.phone,
        payment_info: paymentDetails,
        total_amount: total,
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
        throw new Error(errData.message || 'Server rejected order transaction execution request.');
      }

      alert('Transaction authorized. Order placed successfully!');
      clearCart(); // Evicts checked-out items instantly from memory arrays
      router.push('/');
    } catch (err: any) {
      console.error("Checkout Request Error:", err);
      alert(err.message || "Failed to route order request down to central servers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] py-24 px-4 sm:px-8 text-black">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COMPONENT COLUMN: ORDER SUMMARY CORNER */}
        <div className="lg:col-span-7 space-y-6">
          <h1 className="text-4xl font-serif font-black text-gray-950">Checkout</h1>

          {/* ITEM ENTRIES REPEATER */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm">
            <h2 className="font-bold text-lg mb-6 text-gray-950">Order Summary</h2>

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 font-medium mb-4">Your basket is currently empty.</p>
                <button 
                  onClick={() => router.push('/explore')}
                  className="text-orange-600 font-bold text-sm hover:underline"
                >
                  Go explore local dishes &rarr;
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-[30rem] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-orange-600 font-bold text-xs truncate">
                          {item.restaurant_name || 'Local Store'}
                        </p>
                        <p className="font-extrabold text-gray-950 truncate mb-2">
                          {item.name}
                        </p>

                        <div className="flex items-center gap-3">
                          <button
                            disabled={loading}
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-bold text-gray-900 min-w-[20px] text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            disabled={loading}
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition disabled:opacity-50"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <p className="font-black text-gray-950 text-sm whitespace-nowrap">
                        ₱{(Number(item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* GEOLOCATION SHIPPING PROFILE CARD */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="font-bold text-lg text-gray-950">Delivery Address</h2>
            
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
                Full Destination Coordinates
              </label>
              <textarea
                rows={2}
                disabled={loading}
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full p-4 border border-gray-300 rounded-xl font-medium text-gray-950 focus:ring-2 focus:ring-orange-600 outline-none disabled:bg-gray-50 text-sm"
                placeholder="House/Unit, Street Name, Barangay, Cordova, Cebu"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
                Primary Contact Number
              </label>
              <input
                type="tel"
                disabled={loading}
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full p-4 border border-gray-300 rounded-xl font-medium text-gray-950 focus:ring-2 focus:ring-orange-600 outline-none disabled:bg-gray-50 text-sm"
                placeholder="09XXXXXXXXX"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COMPONENT COLUMN: GATEWAY MATRIX CONTROL BOX */}
        <div className="lg:col-span-5 lg:mt-16">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm sticky top-28 space-y-6">
            <h2 className="font-bold text-lg text-gray-950">Payment Method</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: 'GCash', icon: Wallet },
                { name: 'Maya', icon: Wallet },
                { name: 'Credit / Debit Card', icon: CreditCard },
                { name: 'Cash on Delivery', icon: Truck },
              ].map((m) => {
                const IconComponent = m.icon;
                return (
                  <button
                    key={m.name}
                    type="button"
                    disabled={loading}
                    onClick={() => setMethod(m.name)}
                    className={`flex items-center gap-3 p-4 border-2 rounded-xl text-xs font-black transition text-left ${
                      method === m.name
                        ? 'border-orange-600 text-orange-600 bg-orange-50'
                        : 'border-gray-100 text-gray-700 hover:border-gray-200'
                    }`}
                  >
                    <IconComponent size={16} className="flex-shrink-0" />
                    <span>{m.name}</span>
                  </button>
                );
              })}
            </div>

            {/* DYNAMIC SUB-GATEWAY DEPENDENT FORM SCHEMAS */}
            {method === 'Credit / Debit Card' && (
              <div className="space-y-4 pt-2 border-t border-gray-50 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Cardholder Full Name</label>
                  <input
                    type="text"
                    disabled={loading}
                    value={formData.cardName}
                    onChange={(e) => setFormData({...formData, cardName: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-600 outline-none"
                    placeholder="Juan Dela Cruz"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Card Account Number</label>
                  <input
                    type="text"
                    disabled={loading}
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-600 outline-none"
                    placeholder="4111 2222 3333 4444"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      disabled={loading}
                      value={formData.expiry}
                      onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-600 outline-none"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">CVV Security Code</label>
                    <input
                      type="password"
                      maxLength={4}
                      disabled={loading}
                      value={formData.cvv}
                      onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-600 outline-none"
                      placeholder="•••"
                    />
                  </div>
                </div>
              </div>
            )}

            {method === 'Cash on Delivery' && (
              <div className="p-4 bg-amber-50 text-amber-800 text-xs font-semibold rounded-xl border border-amber-200 leading-relaxed animate-in fade-in duration-200">
                Please prepare the precise payment total prior to courier arrival. 
                Our rider logs dispatch metrics and collects exactly <span className="font-bold">₱{total.toFixed(2)}</span>.
              </div>
            )}

            {/* ACTION FOOTER SUBMIT CONTAINER */}
            <div className="border-t border-gray-100 pt-4 space-y-4">
              <div className="flex justify-between items-center font-black text-gray-950">
                <span className="text-sm text-gray-500">Order Aggregate:</span>
                <span className="text-2xl text-orange-600">₱{total.toFixed(2)}</span>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={loading || cart.length === 0}
                className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black text-base hover:bg-orange-700 transition shadow-lg disabled:bg-gray-200 disabled:cursor-not-allowed transform active:scale-[0.99]"
              >
                {loading ? 'Authorizing Transits...' : `Place Order — ₱${total.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}