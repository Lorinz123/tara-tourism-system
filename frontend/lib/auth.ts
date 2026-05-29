// lib/auth.ts

export interface LocalUser {
  id: string | number; 
  name: string;
  email: string;
  role: 'tourist' | 'owner' | 'admin';
  business_type?: string;
  restaurant?: string | null; 
  address?: string;
  hours?: string;
  contact?: string;
  tags?: string[];
  tagline?: string;
  announcement?: string;
  hero_image?: string;
}

export const getLocalUser = (): LocalUser | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem('user'); // Use 'user' consistently
  if (!data) return null;
  try {
    return JSON.parse(data) as LocalUser;
  } catch (e) {
    return null;
  }
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('tara_token');
    localStorage.removeItem('user'); // Clear 'user' consistently
    
    // Dispatch event so Navbar updates immediately
    window.dispatchEvent(new Event('auth-change'));
    window.location.href = '/login';
  }
};