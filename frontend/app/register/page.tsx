'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Store, Eye, EyeOff, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [role, setRole] = useState<'tourist' | 'owner'>('tourist');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    restaurant: '',
    business_type: 'restaurant', // Added business_type state
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true);

    try {
const response = await fetch('https://tara-tourism-system.onrender.com/api/register', {        method: 'POST',
        headers: { 
            'Content-Type': 'application/json', 
            'Accept': 'application/json' 
        },
        body: JSON.stringify({ ...formData, role }),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('tara_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Conditional Redirection Logic
        if (role === 'owner') {
          if (formData.business_type === 'hotel') {
            router.push('/owner-dashboard');
          } else {
            router.push('/dashboard');
          }
        } else {
          router.push('/explore');
        }
      } else {
        alert("Registration failed: " + JSON.stringify(data.errors || data.message));
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-[#FDFCF9]">
      {/* LEFT SIDE: Cordova Branding Section */}
      <div className="relative hidden lg:flex lg:w-1/2 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1513415277900-a62401e19be4?q=80&w=1200" 
          alt="Cordova Landscape" 
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-teal-900/40" /> 
        
        <div className="relative z-10 flex flex-col justify-end p-16 text-white h-full">
          <p className="text-sm font-bold uppercase tracking-[0.2em] mb-4 opacity-90">Join the community</p>
          <h1 className="text-5xl xl:text-7xl font-serif font-bold leading-tight mb-6">
            Tara na, <br /> let's explore!
          </h1>
          <p className="text-xl text-white/90 max-w-md leading-relaxed border-l-2 border-orange-500 pl-6">
            Join thousands of travelers and local businesses on TARA — your definitive guide to Cordova.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Register Form */}
      <div className="flex w-full flex-col items-center justify-center px-8 lg:w-1/2 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="mb-10 text-left">
            <img src="/logo.jpg" alt="TARA Logo" className="w-12 h-12 mb-6 rounded-full" />
            <h2 className="text-4xl font-serif font-bold text-gray-900">Create an account</h2>
            <p className="text-gray-500 mt-2">Start your Cordova adventure with TARA.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ROLE SELECTION CARDS */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('tourist')}
                className={`flex flex-col p-4 rounded-2xl border-2 text-left transition-all ${
                  role === 'tourist' 
                    ? 'border-orange-500 bg-orange-50/50 shadow-sm' 
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <MapPin className={`mb-3 ${role === 'tourist' ? 'text-orange-600' : 'text-gray-400'}`} size={24} />
                <span className="font-bold text-gray-900 block text-sm">I'm a Tourist</span>
                <span className="text-[11px] text-gray-500">Explore and book experiences</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('owner')}
                className={`flex flex-col p-4 rounded-2xl border-2 text-left transition-all ${
                  role === 'owner' 
                    ? 'border-orange-500 bg-orange-50/50 shadow-sm' 
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <Store className={`mb-3 ${role === 'owner' ? 'text-orange-600' : 'text-gray-400'}`} size={24} />
                <span className="font-bold text-gray-900 block text-sm">I'm an Owner</span>
                <span className="text-[11px] text-gray-500">Manage your business</span>
              </button>
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" name="name" required placeholder="Juan Dela Cruz"
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-gray-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                <input 
                  type="email" name="email" required placeholder="you@example.com"
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-gray-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} name="password" required placeholder="Min. 6 characters"
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-gray-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} name="password_confirmation" required placeholder="Re-enter your password"
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-gray-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* OWNER SPECIFIC FIELDS */}
              {role === 'owner' && (
                <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Business Type</label>
                    <select 
                      name="business_type" 
                      onChange={handleInputChange} 
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-gray-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      value={formData.business_type}
                    >
                      <option value="restaurant">Restaurant</option>
                      <option value="hotel">Hotel</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Business Name</label>
                    <input 
                      type="text" 
                      name="restaurant" 
                      placeholder="Enter your business name"
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-gray-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-600 py-4 text-white font-bold hover:bg-orange-700 transition active:scale-95 shadow-md shadow-orange-200"
            >
              <UserPlus size={20} />
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500 font-medium">
            Already have an account? <Link href="/login" className="text-orange-600 font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}