'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userSession = localStorage.getItem('user');
    if (userSession) {
      try {
        const parsedUser = JSON.parse(userSession);
        if (parsedUser.role === 'admin') {
          router.push('/admin-dashboard');
        } else if (parsedUser.role === 'owner') {
          if (parsedUser.business_type === 'hotel') {
            router.push('/owner-dashboard');
          } else {
            router.push('/dashboard');
          }
        } else {
          router.push('/');
        }
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
const response = await fetch('https://tara-tourism-system.onrender.com/api/login', {        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('tara_token', data.token);
        
        window.dispatchEvent(new Event('auth-change'));
        
        if (data.user.role === 'admin') {
          router.push('/admin-dashboard');
        } else if (data.user.role === 'owner') {
          if (data.user.business_type === 'hotel') {
            router.push('/owner-dashboard');
          } else {
            router.push('/dashboard');
          }
        } else {
          router.push('/');
        }
      } else {
        alert(data.message || "Login failed. Check your credentials.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Connection error. Make sure your local Laravel and MySQL/XAMPP databases are active!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* LEFT SIDE: IMAGE & TEXT OVERLAY */}
      <div className="relative hidden lg:flex lg:w-1/2">
        <img 
          src="https://images.unsplash.com/photo-1513415277900-a62401e19be4?q=80&w=1200" 
          alt="Cordova Landscape" 
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-orange-900/30" /> 
        
        <div className="relative z-10 flex flex-col justify-end p-16 text-white">
          <p className="text-sm font-semibold uppercase tracking-widest mb-2 opacity-80">Cordova, Philippines</p>
          <h1 className="text-5xl xl:text-6xl font-serif font-bold leading-tight mb-6">
            The Pearl of <br /> the Orient Seas
          </h1>
          <p className="text-lg text-white/90 max-w-md leading-relaxed">
            Discover paradise, taste authentic Cordovano flavors, and create memories that last a lifetime.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: LOGIN FORM */}
      <div className="flex w-full flex-col items-center justify-center px-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-10">
            <div 
              className="w-24 h-24 rounded-full overflow-hidden border-2 border-orange-100 shadow-sm mb-4 cursor-pointer"
              onClick={() => setIsAdminMode(!isAdminMode)}
            >
              <img src="/logo.jpg" alt="TARA Logo" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-4xl font-serif font-bold text-gray-900 text-center">
              {isAdminMode ? "Admin Access" : "Maayong balik!"}
            </h2>
            <p className="text-gray-500 mt-2 text-center">
              {isAdminMode ? "Authorized personnel only." : "Sign in to continue your Cordova adventure."}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email</label>
              <input 
                type="email" placeholder="you@example.com" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-4 text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} placeholder="Your password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-4 text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  required
                />
                <button 
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end text-sm mt-1 mb-2">
              <Link href="/forgot-password" className="text-gray-400 hover:text-orange-600 font-bold transition-colors duration-200">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit" disabled={loading}
              className={`w-full rounded-xl py-4 text-lg font-bold text-white shadow-lg transition active:scale-95 ${
                isAdminMode ? 'bg-red-700 hover:bg-red-800' : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              {loading ? "Authenticating..." : isAdminMode ? "Sign In as Admin" : "→ Sign In"}
            </button>
          </form>

          {/* Seeded Demo Accounts */}
          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <span className="bg-white px-4 text-xs font-bold text-gray-400 uppercase tracking-widest z-10">
                Or try a demo account:
              </span>
              <div className="absolute w-full border-t border-gray-100"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => fillDemoAccount('juan@gmail.com', 'juan123')}
                className="rounded-xl border border-gray-100 bg-gray-50 py-3 text-[10px] font-bold text-gray-600 hover:bg-white hover:border-orange-200 transition truncate px-2"
              >
                Tourist: Juan Dela Cruz
              </button>
              <button 
                type="button"
                onClick={() => fillDemoAccount('zubuchon@gmail.com', 'zubuchon123')}
                className="rounded-xl border border-gray-100 bg-gray-50 py-3 text-[10px] font-bold text-gray-600 hover:bg-white hover:border-orange-200 transition truncate px-2"
              >
                Owner: Zubuchon
              </button>
              <button 
                type="button"
                onClick={() => fillDemoAccount('lantaw@gmail.com', 'lantaw123')}
                className="rounded-xl border border-gray-100 bg-gray-50 py-3 text-[10px] font-bold text-gray-600 hover:bg-white hover:border-orange-200 transition truncate px-2"
              >
                Owner: Lantaw
              </button>
              <button 
                type="button"
                onClick={() => fillDemoAccount('cowrie@gmail.com', 'cowrie123')}
                className="rounded-xl border border-gray-100 bg-gray-50 py-3 text-[10px] font-bold text-gray-600 hover:bg-white hover:border-orange-200 transition truncate px-2"
              >
                Owner: Golden Cowrie
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-sm font-medium text-gray-500">
            No account yet? <Link href="/register" className="text-orange-600 font-bold hover:underline">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}