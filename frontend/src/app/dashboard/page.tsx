'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Header';
import { getWishlist, WishlistProperty } from '../../lib/wishlist';
import { getSavedFilters, SavedFilter } from '../../lib/savedFilters';
import { UserCircleIcon, CreditCardIcon, BookmarkIcon, HeartIcon, ClockIcon, BellIcon, ShieldCheckIcon, PencilIcon, CheckCircleIcon, MapPinIcon, ArrowRightIcon, Cog6ToothIcon, ChevronRightIcon,  } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckSolid } from '@heroicons/react/24/solid';

interface BookingRecord {
  id: string;
  propertyTitle: string;
  city: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  image: string;
}

const MOCK_BOOKINGS: BookingRecord[] = [
  {
    id: 'b1',
    propertyTitle: 'Modern Studio near Cyber Hub',
    city: 'Gurugram',
    checkIn: '2026-08-01',
    checkOut: '2026-08-31',
    guests: 1,
    total: 22000,
    status: 'confirmed',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80',
  },
  {
    id: 'b2',
    propertyTitle: 'Spacious 2BHK in Koramangala',
    city: 'Bangalore',
    checkIn: '2026-06-01',
    checkOut: '2026-06-30',
    guests: 2,
    total: 28000,
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80',
  },
  {
    id: 'b3',
    propertyTitle: 'Premium 1BHK in Bandra West',
    city: 'Mumbai',
    checkIn: '2026-09-15',
    checkOut: '2026-10-14',
    guests: 1,
    total: 45000,
    status: 'pending',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80',
  },
];

const MOCK_PAYMENT_METHODS = [
  { id: 'pm1', type: 'card', label: 'Visa ending in 4242', icon: '💳', expiry: '12/27', isDefault: true },
  { id: 'pm2', type: 'upi', label: 'user@okaxis', icon: '📱', expiry: '', isDefault: false },
  { id: 'pm3', type: 'netbanking', label: 'HDFC Bank ••••6789', icon: '🏦', expiry: '', isDefault: false },
];

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmed', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)', color: '#86EFAC' },
  pending: { label: 'Pending', bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.3)', color: '#FDE047' },
  completed: { label: 'Completed', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.3)', color: '#A78BFA' },
  cancelled: { label: 'Cancelled', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', color: '#FCA5A5' },
};

type TabId = 'overview' | 'bookings' | 'payments' | 'settings';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <UserCircleIcon className="w-4 h-4" /> },
  { id: 'bookings', label: 'Booking History', icon: <ClockIcon className="w-4 h-4" /> },
  { id: 'payments', label: 'Payment Methods', icon: <CreditCardIcon className="w-4 h-4" /> },
  { id: 'settings', label: 'Account Settings', icon: <Cog6ToothIcon className="w-4 h-4" /> },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [wishlist, setWishlist] = useState<WishlistProperty[]>([]);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Arjun Mehta',
    email: 'arjun.mehta@gmail.com',
    phone: '+91 98765 43210',
    city: 'Bangalore',
    notifications: true,
    emailAlerts: true,
    priceDropAlerts: true,
  });

  useEffect(() => {
    setWishlist(getWishlist());
    setSavedFilters(getSavedFilters());
    const wHandler = () => setWishlist(getWishlist());
    const fHandler = () => setSavedFilters(getSavedFilters());
    window.addEventListener('wishlist-updated', wHandler);
    window.addEventListener('saved-filters-updated', fHandler);
    return () => {
      window.removeEventListener('wishlist-updated', wHandler);
      window.removeEventListener('saved-filters-updated', fHandler);
    };
  }, []);

  const handleSaveProfile = () => {
    setEditingProfile(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const confirmedBookings = MOCK_BOOKINGS.filter(b => b.status === 'confirmed').length;
  const totalSpent = MOCK_BOOKINGS.filter(b => b.status === 'completed').reduce((s, b) => s + b.total, 0);

  return (
    <div className="min-h-screen" style={{ background: '#09090B' }}>
      <Header onFindMatch={() => {}} />

      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-24 pb-16">
        {/* Profile Header */}
        <div
          className="rounded-2xl p-6 mb-6 flex flex-col md:flex-row items-start md:items-center gap-5"
          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.08) 100%)', border: '1px solid rgba(139,92,246,0.25)' }}
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold font-display shrink-0"
            style={{ background: 'rgba(139,92,246,0.25)', color: '#A78BFA', border: '2px solid rgba(139,92,246,0.4)' }}>
            {profile.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold font-display mb-0.5" style={{ color: '#EEEEF0' }}>{profile.name}</h1>
            <p className="text-sm" style={{ color: '#9898A0' }}>{profile.email} · {profile.city}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-xs px-2.5 py-1 rounded-lg font-medium" style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#86EFAC' }}>
                ✓ Verified Account
              </span>
              <span className="text-xs" style={{ color: '#9898A0' }}>Member since Jan 2025</span>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            {[
              { label: 'Bookings', value: MOCK_BOOKINGS.length },
              { label: 'Wishlisted', value: wishlist.length || 3 },
              { label: 'Saved Filters', value: savedFilters.length },
            ].map(stat => (
              <div key={stat.label} className="text-center px-4 py-2.5 rounded-xl" style={{ background: 'rgba(238,238,240,0.05)', border: '1px solid rgba(238,238,240,0.08)' }}>
                <div className="text-lg font-bold font-display" style={{ color: '#A78BFA' }}>{stat.value}</div>
                <div className="text-xs" style={{ color: '#9898A0' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl overflow-x-auto" style={{ background: 'rgba(238,238,240,0.04)', border: '1px solid rgba(238,238,240,0.06)' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200"
              style={{
                background: activeTab === tab.id ? 'rgba(139,92,246,0.2)' : 'transparent',
                color: activeTab === tab.id ? '#A78BFA' : '#9898A0',
                border: activeTab === tab.id ? '1px solid rgba(139,92,246,0.35)' : '1px solid transparent',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Quick Stats */}
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Active Bookings', value: confirmedBookings, color: '#86EFAC', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)', icon: <CheckSolid className="w-5 h-5" /> },
                { label: 'Total Spent', value: `₹${(totalSpent / 1000).toFixed(0)}k`, color: '#A78BFA', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.25)', icon: <CreditCardIcon className="w-5 h-5" /> },
                { label: 'Saved Properties', value: wishlist.length || 3, color: '#FCA5A5', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', icon: <HeartIcon className="w-5 h-5" /> },
                { label: 'Saved Filters', value: savedFilters.length, color: '#93C5FD', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)', icon: <BookmarkIcon className="w-5 h-5" /> },
              ].map(s => (
                <div key={s.label} className="rounded-2xl p-5" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ color: s.color }}>{s.icon}</span>
                  </div>
                  <div className="text-2xl font-bold font-display mb-0.5" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs" style={{ color: '#9898A0' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Wishlist Shortcuts */}
            <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: 'rgba(238,238,240,0.03)', border: '1px solid rgba(238,238,240,0.07)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <HeartIcon className="w-4 h-4" style={{ color: '#FCA5A5' }} />
                  <h2 className="text-sm font-bold" style={{ color: '#EEEEF0' }}>Wishlist Shortcuts</h2>
                </div>
                <Link href="/wishlist" className="text-xs flex items-center gap-1 hover:opacity-80 transition-opacity" style={{ color: '#A78BFA' }}>
                  View all <ArrowRightIcon className="w-3 h-3" />
                </Link>
              </div>
              {(wishlist.length > 0 ? wishlist.slice(0, 3) : [
                { id: '1', title: 'Modern Studio near Cyber Hub', city: 'Gurugram', area: 'Cyber Hub', price: 22000, bedrooms: 1, sqft: 350, matchScore: 96, safetyScore: 92, priceStatus: 'Fair Value', fakeConfidence: 84, rating: 4.8, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80', alt: 'Studio apartment', aiReason: 'High demand, top transit access', type: 'Studio', savedAt: Date.now() },
                { id: '2', title: 'Spacious 2BHK in Koramangala', city: 'Bangalore', area: 'Koramangala', price: 28000, bedrooms: 2, sqft: 900, matchScore: 94, safetyScore: 90, priceStatus: 'Fair Value', fakeConfidence: 82, rating: 4.7, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80', alt: '2BHK apartment', aiReason: 'Excellent school ratings nearby', type: '2BHK', savedAt: Date.now() },
              ]).map(p => (
                <Link key={p.id} href={`/property/${p.id}`} className="flex items-center gap-3 p-3 rounded-xl mb-2 hover:bg-white/5 transition-colors group">
                  <img src={p.image} alt={p.alt} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: '#EEEEF0' }}>{p.title}</div>
                    <div className="text-xs" style={{ color: '#9898A0' }}>{p.city} · ₹{(p.price / 1000).toFixed(0)}k/mo</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-lg font-bold" style={{ background: 'rgba(139,92,246,0.15)', color: '#A78BFA' }}>{p.matchScore}%</span>
                    <ChevronRightIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#9898A0' }} />
                  </div>
                </Link>
              ))}
              {wishlist.length === 0 && (
                <p className="text-xs text-center py-4" style={{ color: '#9898A0' }}>No saved properties yet. <Link href="/listings" className="underline" style={{ color: '#A78BFA' }}>Browse listings</Link></p>
              )}
            </div>

            {/* Saved Filters Shortcuts */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(238,238,240,0.03)', border: '1px solid rgba(238,238,240,0.07)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookmarkIcon className="w-4 h-4" style={{ color: '#93C5FD' }} />
                  <h2 className="text-sm font-bold" style={{ color: '#EEEEF0' }}>Saved Searches</h2>
                </div>
                <Link href="/saved-filters" className="text-xs flex items-center gap-1 hover:opacity-80 transition-opacity" style={{ color: '#A78BFA' }}>
                  Manage <ArrowRightIcon className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-2">
                {savedFilters.slice(0, 3).map(f => (
                  <Link key={f.id} href={`/listings?city=${f.city}&minBudget=${f.budget.min}&maxBudget=${f.budget.max}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                    <div>
                      <div className="text-sm font-medium" style={{ color: '#EEEEF0' }}>{f.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#9898A0' }}>{f.city} · {f.resultCount} results</div>
                    </div>
                    <ChevronRightIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#9898A0' }} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Bookings Preview */}
            <div className="lg:col-span-3 rounded-2xl p-5" style={{ background: 'rgba(238,238,240,0.03)', border: '1px solid rgba(238,238,240,0.07)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4" style={{ color: '#A78BFA' }} />
                  <h2 className="text-sm font-bold" style={{ color: '#EEEEF0' }}>Recent Bookings</h2>
                </div>
                <button onClick={() => setActiveTab('bookings')} className="text-xs flex items-center gap-1 hover:opacity-80 transition-opacity" style={{ color: '#A78BFA' }}>
                  View all <ArrowRightIcon className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {MOCK_BOOKINGS.map(b => {
                  const sc = STATUS_CONFIG[b.status];
                  return (
                    <div key={b.id} className="rounded-xl overflow-hidden" style={{ background: 'rgba(238,238,240,0.04)', border: '1px solid rgba(238,238,240,0.07)' }}>
                      <img src={b.image} alt={b.propertyTitle} className="w-full h-28 object-cover" />
                      <div className="p-3">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="text-sm font-medium leading-tight" style={{ color: '#EEEEF0' }}>{b.propertyTitle}</div>
                          <span className="text-xs px-2 py-0.5 rounded-lg shrink-0 font-medium" style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color }}>{sc.label}</span>
                        </div>
                        <div className="text-xs mb-1" style={{ color: '#9898A0' }}>{b.city} · {b.guests} guest{b.guests > 1 ? 's' : ''}</div>
                        <div className="text-xs font-semibold" style={{ color: '#A78BFA' }}>₹{(b.total / 1000).toFixed(0)}k/mo</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold font-display" style={{ color: '#EEEEF0' }}>Booking History</h2>
              <span className="text-sm" style={{ color: '#9898A0' }}>{MOCK_BOOKINGS.length} bookings total</span>
            </div>
            {MOCK_BOOKINGS.map(b => {
              const sc = STATUS_CONFIG[b.status];
              return (
                <div key={b.id} className="rounded-2xl overflow-hidden flex flex-col md:flex-row" style={{ background: 'rgba(238,238,240,0.03)', border: '1px solid rgba(238,238,240,0.07)' }}>
                  <img src={b.image} alt={b.propertyTitle} className="w-full md:w-48 h-40 md:h-auto object-cover shrink-0" />
                  <div className="p-5 flex-1">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-base font-bold" style={{ color: '#EEEEF0' }}>{b.propertyTitle}</h3>
                      <span className="text-xs px-3 py-1 rounded-lg font-semibold shrink-0" style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color }}>{sc.label}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPinIcon className="w-3.5 h-3.5" style={{ color: '#9898A0' }} />
                      <span className="text-sm" style={{ color: '#9898A0' }}>{b.city}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { label: 'Check-in', value: new Date(b.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
                        { label: 'Check-out', value: new Date(b.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
                        { label: 'Guests', value: `${b.guests} guest${b.guests > 1 ? 's' : ''}` },
                      ].map(item => (
                        <div key={item.label} className="p-2.5 rounded-xl text-center" style={{ background: 'rgba(238,238,240,0.04)', border: '1px solid rgba(238,238,240,0.06)' }}>
                          <div className="text-xs font-bold" style={{ color: '#EEEEF0' }}>{item.value}</div>
                          <div className="text-xs mt-0.5" style={{ color: '#9898A0' }}>{item.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold" style={{ color: '#A78BFA' }}>₹{b.total.toLocaleString('en-IN')}/month</span>
                      {b.status === 'completed' && (
                        <button className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', color: '#A78BFA' }}>
                          Write Review
                        </button>
                      )}
                      {b.status === 'confirmed' && (
                        <button className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5' }}>
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold font-display" style={{ color: '#EEEEF0' }}>Payment Methods</h2>
              <button className="text-sm px-4 py-2 rounded-xl font-medium" style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#A78BFA' }}>
                + Add New
              </button>
            </div>
            <div className="space-y-3">
              {MOCK_PAYMENT_METHODS.map(pm => (
                <div key={pm.id} className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: pm.isDefault ? 'rgba(139,92,246,0.08)' : 'rgba(238,238,240,0.03)', border: pm.isDefault ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(238,238,240,0.07)' }}>
                  <span className="text-2xl">{pm.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium" style={{ color: '#EEEEF0' }}>{pm.label}</span>
                      {pm.isDefault && (
                        <span className="text-xs px-2 py-0.5 rounded-lg font-medium" style={{ background: 'rgba(139,92,246,0.2)', color: '#A78BFA' }}>Default</span>
                      )}
                    </div>
                    {pm.expiry && <div className="text-xs mt-0.5" style={{ color: '#9898A0' }}>Expires {pm.expiry}</div>}
                  </div>
                  <div className="flex gap-2">
                    {!pm.isDefault && (
                      <button className="text-xs px-3 py-1.5 rounded-lg" style={{ background: 'rgba(238,238,240,0.06)', color: '#9898A0' }}>Set Default</button>
                    )}
                    <button className="text-xs px-3 py-1.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#FCA5A5' }}>Remove</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Billing Summary */}
            <div className="rounded-2xl p-5 mt-4" style={{ background: 'rgba(238,238,240,0.03)', border: '1px solid rgba(238,238,240,0.07)' }}>
              <h3 className="text-sm font-bold mb-4" style={{ color: '#EEEEF0' }}>Billing Summary</h3>
              <div className="space-y-3">
                {[
                  { label: 'Total Bookings', value: MOCK_BOOKINGS.length },
                  { label: 'Completed Stays', value: MOCK_BOOKINGS.filter(b => b.status === 'completed').length },
                  { label: 'Total Spent', value: `₹${totalSpent.toLocaleString('en-IN')}` },
                  { label: 'Avg. Monthly Rent', value: `₹${Math.round(totalSpent / Math.max(1, MOCK_BOOKINGS.filter(b => b.status === 'completed').length) / 1000).toFixed(0)}k` },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(238,238,240,0.05)' }}>
                    <span className="text-sm" style={{ color: '#9898A0' }}>{item.label}</span>
                    <span className="text-sm font-semibold" style={{ color: '#EEEEF0' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-5">
            {/* Profile Info */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(238,238,240,0.03)', border: '1px solid rgba(238,238,240,0.07)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold" style={{ color: '#EEEEF0' }}>Profile Information</h2>
                <button
                  onClick={() => editingProfile ? handleSaveProfile() : setEditingProfile(true)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                  style={{ background: editingProfile ? 'rgba(139,92,246,0.2)' : 'rgba(238,238,240,0.06)', color: editingProfile ? '#A78BFA' : '#9898A0', border: editingProfile ? '1px solid rgba(139,92,246,0.35)' : '1px solid transparent' }}
                >
                  {editingProfile ? <><CheckCircleIcon className="w-3.5 h-3.5" /> Save</> : <><PencilIcon className="w-3.5 h-3.5" /> Edit</>}
                </button>
              </div>
              {profileSaved && (
                <div className="mb-3 flex items-center gap-2 text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#86EFAC' }}>
                  <CheckSolid className="w-4 h-4" /> Profile saved successfully
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', key: 'name' as const },
                  { label: 'Email Address', key: 'email' as const },
                  { label: 'Phone Number', key: 'phone' as const },
                  { label: 'Preferred City', key: 'city' as const },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-xs font-medium block mb-1.5" style={{ color: '#9898A0' }}>{field.label}</label>
                    {editingProfile ? (
                      <input
                        value={profile[field.key]}
                        onChange={e => setProfile(prev => ({ ...prev, [field.key]: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                        style={{ background: 'rgba(238,238,240,0.06)', border: '1px solid rgba(139,92,246,0.4)', color: '#EEEEF0' }}
                      />
                    ) : (
                      <div className="px-3 py-2.5 rounded-xl text-sm" style={{ background: 'rgba(238,238,240,0.04)', border: '1px solid rgba(238,238,240,0.06)', color: '#EEEEF0' }}>
                        {profile[field.key]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(238,238,240,0.03)', border: '1px solid rgba(238,238,240,0.07)' }}>
              <div className="flex items-center gap-2 mb-4">
                <BellIcon className="w-4 h-4" style={{ color: '#A78BFA' }} />
                <h2 className="text-sm font-bold" style={{ color: '#EEEEF0' }}>Notification Preferences</h2>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Push Notifications', desc: 'New matches for your saved filters', key: 'notifications' as const },
                  { label: 'Email Alerts', desc: 'Booking confirmations and updates', key: 'emailAlerts' as const },
                  { label: 'Price Drop Alerts', desc: 'When properties in your wishlist drop in price', key: 'priceDropAlerts' as const },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(238,238,240,0.04)', border: '1px solid rgba(238,238,240,0.06)' }}>
                    <div>
                      <div className="text-sm font-medium" style={{ color: '#EEEEF0' }}>{item.label}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#9898A0' }}>{item.desc}</div>
                    </div>
                    <button
                      onClick={() => setProfile(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                      className="relative w-11 h-6 rounded-full transition-all duration-300 shrink-0"
                      style={{ background: profile[item.key] ? 'rgba(139,92,246,0.8)' : 'rgba(238,238,240,0.12)' }}
                    >
                      <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300"
                        style={{ left: profile[item.key] ? '22px' : '2px' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(238,238,240,0.03)', border: '1px solid rgba(238,238,240,0.07)' }}>
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheckIcon className="w-4 h-4" style={{ color: '#93C5FD' }} />
                <h2 className="text-sm font-bold" style={{ color: '#EEEEF0' }}>Security</h2>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Change Password', desc: 'Last changed 3 months ago' },
                  { label: 'Two-Factor Authentication', desc: 'Not enabled — recommended' },
                  { label: 'Active Sessions', desc: '2 devices logged in' },
                ].map(item => (
                  <button key={item.label} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-left">
                    <div>
                      <div className="text-sm font-medium" style={{ color: '#EEEEF0' }}>{item.label}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#9898A0' }}>{item.desc}</div>
                    </div>
                    <ChevronRightIcon className="w-4 h-4 shrink-0" style={{ color: '#9898A0' }} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer onFindMatch={function (): void {
              throw new Error('Function not implemented.');
          } } />
    </div>
  );
}
