'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    if (password !== passwordConfirmation) {
      alert("Passwords do not match!");
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          password_confirmation: passwordConfirmation 
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMsg(data.message);
        alert("Success! Redirecting you to the login screen...");
        router.push('/login');
      } else {
        alert(data.message || "Something went wrong. Please check your details.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Connection error. Make sure your local Laravel application backend is active!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* LEFT SIDE: MATCHING BRANDING OVERLAY */}
      <div className="relative hidden lg:flex lg:w-1/2">
        <img 
          src="https://images.unsplash.com/photo-1513415277900-a62401e19be4?q=80&w=1200" 
          alt="Cordova Landscape" 
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-orange-900/30" />
        
        <div className="relative z-10 flex flex-col justify-end p-16 text-white">
          <p className="text-sm font-semibold uppercase tracking-widest mb-2 opacity-80">
            Account Recovery
          </p>
          <h1 className="text-6xl font-serif font-bold leading-tight mb-6">
            Secure Your <br /> Adventure
          </h1>
        </div>
      </div>

      {/* RIGHT SIDE: RESET PASSWORD FORM */}
      <div className="flex w-full flex-col items-center justify-center px-8 lg:w-1/2">
        <div className="w-full max-w-md">
          
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 font-bold transition mb-6 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Login
          </Link>

          <div className="flex flex-col items-center mb-8">
            <h2 className="text-4xl font-serif font-bold text-gray-900 text-center">Reset Password</h2>
            <p className="text-gray-500 mt-2 text-center">
              Enter your registered email and your new desired password configuration.
            </p>
          </div>

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-teal-50 text-teal-800 font-medium text-sm border border-teal-200">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Email Address
              </label>
              <input 
                type="email"
                placeholder="juan@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-4 text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                New Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-4 text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Confirm New Password
              </label>
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Re-type your new password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-4 text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl py-4 text-lg font-bold text-white shadow-lg transition active:scale-95 ${
                loading ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              {loading ? "Updating Account..." : "Confirm Password Reset"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}