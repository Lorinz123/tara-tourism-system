'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLocalUser, LocalUser } from '@/lib/auth';
import Navbar from '../components/Navbar';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

// Dynamic API URL entrypoint setup
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tara-tourism-system.onrender.com';

export default function OwnerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  
  const [formData, setFormData] = useState({ 
    id: 0, name: '', desc: '', price: '', cat: 'Main', image_url: '', available: true 
  });

  const [profileData, setProfileData] = useState({
    tagline: '', announcement: '', hero_image: '',
    address: '', hours: '', contact: '', tags: ''
  });

  useEffect(() => {
    const userData = getLocalUser();
    if (!userData || userData.role !== 'owner') {
      router.replace('/explore');
    } else {
      setUser(userData);
      setProfileData({
        tagline: userData.tagline || '',
        announcement: userData.announcement || '',
        hero_image: userData.hero_image || '',
        address: userData.address || '',
        hours: userData.hours || '',
        contact: userData.contact || '',
        tags: Array.isArray(userData.tags) ? userData.tags.join(', ') : (userData.tags || ''),
      });
      fetchOwnerMenu(Number(userData.id));
    }
  }, [router]);

  const fetchOwnerMenu = async (ownerId: number) => {
    try {
      // FIXED: Swapped hardcoded string path for custom dynamic API template string
      const res = await fetch(`${API_URL}/api/owner-menu/${ownerId}`);
      const data = await res.json();
      setMenuItems(data);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleSaveProfile = async () => {
    try {
      // FIXED: Swapped hardcoded string path for custom dynamic API template string
      const res = await fetch(`${API_URL}/api/users/${user?.id}/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tara_token')}` 
        },
        body: JSON.stringify(profileData)
      });
      
      if (!res.ok) {
         const errorData = await res.json();
         console.error("Server Error:", errorData);
         alert("Failed to save: " + (errorData.message || "Unknown error"));
      } else {
         alert("Profile updated successfully!");
      }
    } catch (err) { 
      console.error("Network Error:", err); 
    }
  };

  const handleSave = async () => {
    const payload = { 
      user_id: Number(user?.id), name: formData.name, description: formData.desc, 
      category: formData.cat, price: formData.price, image_url: formData.image_url, 
      available: formData.available ? 1 : 0 
    };

    // FIXED: Swapped hardcoded string path for custom dynamic API template string
    const url = modalMode === 'add' 
      ? `${API_URL}/api/menu-items` 
      : `${API_URL}/api/menu-items/${formData.id}`;
    
    await fetch(url, { 
      method: modalMode === 'add' ? 'POST' : 'PUT', 
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${localStorage.getItem('tara_token')}` 
      }, 
      body: JSON.stringify(payload) 
    });
    fetchOwnerMenu(Number(user?.id));
    setIsModalOpen(false);
  };

  const deleteMenuItem = async (id: number) => {
    if (confirm('Are you sure you want to remove this item?')) {
      // FIXED: Swapped hardcoded string path for custom dynamic API template string
      await fetch(`${API_URL}/api/menu-items/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('tara_token')}` }
      });
      fetchOwnerMenu(Number(user?.id));
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-black">
      <Navbar />
      <main className="pt-24 px-6 md:px-12 max-w-6xl mx-auto pb-20">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-gray-700 text-sm font-bold uppercase tracking-wide">Owner Dashboard</p>
            <h1 className="text-4xl font-serif font-bold text-black">{user?.restaurant || 'Restaurant'}</h1>
          </div>
          <button className="border-2 border-black px-6 py-2 rounded-lg font-bold text-sm text-black hover:bg-black hover:text-white transition">View Listing &rarr;</button>
        </div>

        <div className="flex space-x-6 border-b border-gray-300 mb-8">
          {['Overview', 'Orders', 'Menu', 'Profile'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-sm font-bold border-b-2 transition ${activeTab === tab ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-600 hover:text-black'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          {activeTab === 'Profile' ? (
            <div className="max-w-3xl">
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm mb-6">
                <h3 className="text-xl font-bold mb-6">Restaurant Profile</h3>
                <div className="space-y-4">
                  <div><label className="block text-sm font-bold text-gray-900 mb-2">Tagline</label><input value={profileData.tagline} onChange={(e) => setProfileData({...profileData, tagline: e.target.value})} className="w-full p-3 border-2 border-gray-200 rounded-lg text-black" /></div>
                  <div><label className="block text-sm font-bold text-gray-900 mb-2">Announcement</label><input value={profileData.announcement} onChange={(e) => setProfileData({...profileData, announcement: e.target.value})} className="w-full p-3 border-2 border-gray-200 rounded-lg text-black" /></div>
                  <div><label className="block text-sm font-bold text-gray-900 mb-2">Hero Image URL</label><input value={profileData.hero_image} onChange={(e) => setProfileData({...profileData, hero_image: e.target.value})} className="w-full p-3 border-2 border-gray-200 rounded-lg text-black" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-bold text-gray-900 mb-2">Address</label><input value={profileData.address} onChange={(e) => setProfileData({...profileData, address: e.target.value})} className="w-full p-3 border-2 border-gray-200 rounded-lg text-black" /></div>
                    <div><label className="block text-sm font-bold text-gray-900 mb-2">Hours</label><input value={profileData.hours} onChange={(e) => setProfileData({...profileData, hours: e.target.value})} className="w-full p-3 border-2 border-gray-200 rounded-lg text-black" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-bold text-gray-900 mb-2">Contact</label><input value={profileData.contact} onChange={(e) => setProfileData({...profileData, contact: e.target.value})} className="w-full p-3 border-2 border-gray-200 rounded-lg text-black" /></div>
                    <div><label className="block text-sm font-bold text-gray-900 mb-2">Tags</label><input value={profileData.tags} onChange={(e) => setProfileData({...profileData, tags: e.target.value})} className="w-full p-3 border-2 border-gray-200 rounded-lg text-black" /></div>
                  </div>
                </div>
                <button onClick={handleSaveProfile} className="w-full bg-orange-600 text-white py-4 mt-6 rounded-xl font-bold hover:bg-orange-700 transition">Save Profile</button>
              </div>
            </div>
          ) : activeTab === 'Menu' ? (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-black">Menu Items ({menuItems.length})</h2>
                <button onClick={() => { setModalMode('add'); setFormData({id: 0, name: '', desc: '', price: '', cat: 'Main', image_url: '', available: true}); setIsModalOpen(true); }} className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-800 flex items-center gap-2"><Plus size={16} /> Add Item</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {menuItems.map((item) => (
                  <div key={item.id} className="p-5 border border-gray-200 rounded-xl flex justify-between items-center bg-white shadow-sm">
                    <div className="flex items-center gap-4">
                      {item.image_url && <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-gray-100" />}
                      <div>
                        <p className="font-bold text-black text-base">{item.name}</p>
                        <p className="text-sm text-gray-700">{item.description}</p>
                        <p className="text-orange-700 font-bold mt-1 text-sm">₱{item.price}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setModalMode('edit'); setFormData({id: item.id, name: item.name, desc: item.description, price: item.price, cat: item.category, image_url: item.image_url, available: item.available === 1}); setIsModalOpen(true); }} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100"><Pencil size={18} /></button>
                      <button onClick={() => deleteMenuItem(item.id)} className="p-2 border border-gray-200 rounded-lg text-red-600 hover:bg-red-50"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-600 py-10 text-center font-medium">No {activeTab.toLowerCase()} found.</p>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-2xl p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-black">{modalMode === 'edit' ? 'Edit Item' : 'Add Item'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-black"><X size={24}/></button>
              </div>
              <div className="space-y-4">
                <div><label className="block text-sm font-bold text-gray-900 mb-1">Item Name</label><input className="w-full p-3 border-2 border-gray-200 rounded-lg text-black font-medium" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
                <div><label className="block text-sm font-bold text-gray-900 mb-1">Description</label><input className="w-full p-3 border-2 border-gray-200 rounded-lg text-black font-medium" value={formData.desc} onChange={(e) => setFormData({...formData, desc: e.target.value})} /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-bold text-gray-900 mb-1">Price (₱)</label><input type="number" className="w-full p-3 border-2 border-gray-200 rounded-lg text-black font-medium" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} /></div>
                    <div><label className="block text-sm font-bold text-gray-900 mb-1">Category</label><select className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white text-black font-medium" value={formData.cat} onChange={(e) => setFormData({...formData, cat: e.target.value})}><option>Main</option><option>Seafood</option><option>Beverage</option><option>Dessert</option></select></div>
                </div>
                <div><label className="block text-sm font-bold text-gray-900 mb-1">Image URL</label><input className="w-full p-3 border-2 border-gray-200 rounded-lg text-black font-medium" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} /></div>
                <label className="flex items-center gap-2 py-2 cursor-pointer"><input type="checkbox" checked={formData.available} onChange={(e) => setFormData({...formData, available: e.target.checked})} className="w-5 h-5 accent-black"/><span className="text-sm font-bold text-black">Available for order</span></label>
                <button onClick={handleSave} className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 mt-4 text-lg">Save Item</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}