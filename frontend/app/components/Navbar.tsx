'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import {
  ShoppingCart,
  LogOut,
  User,
  ChevronRight,
  LayoutDashboard,
  Menu,
  X
} from 'lucide-react';

import { getLocalUser, logout, LocalUser } from '@/lib/auth';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
  | SIDE EFFECTS & BROWSER LISTENERS
  |----------------------------------------------------------------------
  */
  useEffect(() => {
    // Lock component state confirmation into client layout instantly
    setIsMounted(true);

    const updateAuthStatus = () => {
      const storedUser = getLocalUser();
      if (storedUser) {
        setIsLoggedIn(true);
        setUserData(storedUser);
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    };

    // Initialize layout sync on mount/route transition
    updateAuthStatus();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileCard(false);
      }
    };

    const handleScroll = () => setIsScrolled(window.scrollY > 10);

    // Dynamic state listener bindings
    window.addEventListener('auth-change', updateAuthStatus);
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('auth-change', updateAuthStatus);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [pathname]);

  /*
  |----------------------------------------------------------------------
  | ROUTE GUARDS
  |----------------------------------------------------------------------
  */
  const handleProtectedNavigation = (path: string) => {
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      router.push(path);
      setShowProfileCard(false);
      setMobileMenuOpen(false);
    }
  };

  /*
  |----------------------------------------------------------------------
  | LOGOUT PIPELINE
  |----------------------------------------------------------------------
  */
  const handleLogoutClick = () => {
    logout();
    setShowProfileCard(false);
    setMobileMenuOpen(false);
    router.refresh(); 
    router.push('/');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 md:px-8 py-4 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm'
          : 'bg-white shadow-sm'
      }`}
    >
      {/* BRANDING LOGO BLOCK */}
      <div className="flex items-center gap-4 md:gap-12 min-w-0">
        <div className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight flex-shrink-0">
          <Link href="/" className="text-gray-900 block">
            TARA Bisita <span className="text-orange-600">Cordova</span>
          </Link>
        </div>

        {/* DESKTOP ROUTING NAVIGATION LINKS */}
        <div className="hidden md:flex items-center space-x-8 font-medium flex-shrink-0">
          <Link
            href="/"
            className={`block transition-colors ${
              pathname === '/'
                ? 'text-orange-600 font-bold'
                : 'text-gray-600 hover:text-orange-600'
            }`}
          >
            Home
          </Link>

          <button
            type="button"
            onClick={() => handleProtectedNavigation('/explore')}
            className={`block text-left transition-colors ${
              pathname === '/explore'
                ? 'text-orange-600 font-bold'
                : 'text-gray-600 hover:text-orange-600'
            }`}
          >
            Explore
          </button>

          {isLoggedIn && (userData?.role === 'owner' || userData?.role === 'admin') && (
            <Link
              href={getDashboardUrl()}
              className={`block transition-colors ${
                pathname.includes('dashboard')
                  ? 'text-orange-600 font-bold'
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              {userData?.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
            </Link>
          )}
        </div>
      </div>

      {/* USER CONSOLE ACTION TRIGGER PANEL */}
      <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
        
        {/* SHOPPING CART ICON INDICATOR */}
        <Link
          href="/cart"
          className="relative cursor-pointer text-gray-900 hover:text-orange-600 transition flex-shrink-0"
        >
          <ShoppingCart size={22} />
          {/* FIXED: Added isMounted conditional check rule boundary to block Server/Client mismatch leaks */}
          {isMounted && cart && cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-600 text-[10px] rounded-full h-4 w-4 flex items-center justify-center text-white font-bold animate-in zoom-in duration-100">
              {cart.reduce((total, item) => total + (item.quantity || 1), 0)}
            </span>
          )}
        </Link>

        {/* ACCOUNT PROFILE SYSTEM CONTROL CONTROLLER */}
        {isLoggedIn && userData ? (
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setShowProfileCard(!showProfileCard)}
              className={`group relative cursor-pointer p-1 rounded-full border transition-all duration-300 ${
                userData.role === 'owner' || userData.role === 'admin'
                  ? 'bg-orange-50 text-orange-700 border-orange-200 hover:border-orange-400'
                  : 'bg-teal-50 text-teal-700 border-teal-200 hover:border-teal-400'
              }`}
            >
              <User size={26} strokeWidth={1.8} className="text-gray-700" />
            </div>

            {/* EXPANDABLE DROP-DOWN ACCOUNT OVERLAY CARD */}
            {showProfileCard && (
              <div className="absolute right-0 mt-4 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 transform origin-top-right">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg uppercase bg-orange-100 text-orange-600 flex-shrink-0">
                      {userData.name ? userData.name.charAt(0) : 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base leading-tight truncate">
                        {userData.name}
                      </h3>
                      <p className="text-sm text-gray-500 italic truncate">
                        {userData.email}
                      </p>
                      <span
                        className={`inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                          userData.role === 'owner'
                            ? 'bg-orange-50 text-orange-700 border border-orange-200'
                            : userData.role === 'admin'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-teal-50 text-teal-700 border border-teal-200'
                        }`}
                      >
                        {userData.role === 'admin'
                          ? 'Admin Account'
                          : userData.role === 'owner'
                          ? 'Owner Account'
                          : 'Tourist'}
                      </span>
                    </div>
                  </div>

                  {(userData.role === 'owner' || userData.role === 'admin') && (
                    <Link
                      href={getDashboardUrl()}
                      onClick={() => setShowProfileCard(false)}
                      className="w-full flex items-center justify-between group px-4 py-3 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition-all mb-4 shadow-md shadow-orange-100"
                    >
                      <div className="flex items-center gap-3">
                        <LayoutDashboard size={18} />
                        <span className="font-bold text-sm">
                          {userData.role === 'admin' ? 'Go to Admin Panel' : 'Go to Dashboard'}
                        </span>
                      </div>
                      <ChevronRight size={16} />
                    </Link>
                  )}

                  <div className="border-t border-gray-100 pt-4">
                    <button
                      onClick={handleLogoutClick}
                      className="w-full flex items-center justify-between group px-4 py-2.5 rounded-xl hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <LogOut size={18} />
                        <span className="font-medium text-sm">Sign Out</span>
                      </div>
                      <ChevronRight
                        size={16}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* PUBLIC ACCESS SIGN-UP CALL TO ACTION TRIGGER CONTROLS */
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <Link
              href="/login"
              className="text-gray-700 hover:text-orange-600 font-medium px-4 py-2 transition-colors text-sm"
            >
              Login
            </Link>
            <Link href="/register">
              <button className="bg-orange-600 hover:bg-orange-700 px-5 py-2 rounded-lg text-sm font-medium transition text-white shadow-sm">
                Register
              </button>
            </Link>
          </div>
        )}

        {/* RESPONSIVE MOBILE EXPANSION BUTTON HAMBURGER TRIGGER */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MOBILE FULLSCREEN DRAWER MENU CONTROL SECTION */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 md:hidden z-50 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col p-4 space-y-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-700 font-medium text-sm border-b border-gray-50 pb-2"
            >
              Home
            </Link>

            <button
              onClick={() => {
                handleProtectedNavigation('/explore');
                setMobileMenuOpen(false);
              }}
              className="text-left text-gray-700 font-medium text-sm border-b border-gray-50 pb-2"
            >
              Explore
            </button>

            {isLoggedIn && (userData?.role === 'owner' || userData?.role === 'admin') && (
              <Link
                href={getDashboardUrl()}
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 font-medium text-sm border-b border-gray-50 pb-2"
              >
                {userData?.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
              </Link>
            )}

            {!isLoggedIn ? (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg text-sm border border-gray-200 font-medium text-gray-700"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg text-sm font-medium bg-orange-600 text-white"
                >
                  Register
                </Link>
              </div>
            ) : (
              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center gap-2 text-left text-red-600 font-medium text-sm pt-2"
              >
                <LogOut size={16} /> Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}