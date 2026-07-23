'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon, HeartIcon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { getWishlist } from '@/lib/wishlist';
import { getNotifications, getTotalUnreadCount, markAllRead, NotificationMatch } from '@/lib/notifications';
import AppLogo from '@/components/ui/AppLogo';

interface HeaderProps {
  onFindMatch: () => void;
}

const NAV_LINKS = [
  { href: '/home', label: 'Home' },
  { href: '/listings', label: 'Listings' },
  { href: '/chat', label: 'AI Chat' },
  { href: '/wishlist', label: 'Wishlist' },
  { href: '/saved-filters', label: 'Saved Filters' },
  { href: '/dashboard', label: 'Dashboard' },
];

export default function Header({ onFindMatch }: HeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [notifCount, setNotifCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationMatch[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; username: string; email: string } | null>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const fetchUserProfile = async (token: string) => {
    try {
      const res = await fetch('http://localhost:8000/user/is_auth', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        localStorage.removeItem('auth_token');
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }
  };

  useEffect(() => {
    const updateCounts = () => {
      setWishlistCount(getWishlist().length);
      setNotifCount(getTotalUnreadCount());
      setNotifications(getNotifications());
    };
    
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        fetchUserProfile(token);
      } else {
        setUser(null);
      }
    };

    updateCounts();
    checkAuth();

    window.addEventListener('wishlist-updated', updateCounts);
    window.addEventListener('notifications-updated', updateCounts);
    window.addEventListener('auth-updated', checkAuth);

    return () => {
      window.removeEventListener('wishlist-updated', updateCounts);
      window.removeEventListener('notifications-updated', updateCounts);
      window.removeEventListener('auth-updated', checkAuth);
    };
  }, []);

  // Close notif dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpenNotif = () => {
    setNotifOpen(prev => !prev);
    if (!notifOpen) {
      markAllRead();
      setNotifCount(0);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    window.dispatchEvent(new Event('auth-updated'));
    window.location.href = '/home';
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-16"
      style={{ background: 'rgba(9,9,11,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(238,238,240,0.06)' }}
    >
      <AppLogo
        text="StaySmart AI"
        iconName="SignalIcon"
        size={28}
        className="text-phosphor font-display font-bold tracking-tight"
      />

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-1">
        {NAV_LINKS.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative"
            style={{
              color: pathname === link.href ? '#A78BFA' : '#9898A0',
              background: pathname === link.href ? 'rgba(139,92,246,0.12)' : 'transparent',
            }}
          >
            {link.label}
            {link.href === '/wishlist' && wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center" style={{ background: '#EF4444', color: '#fff', fontSize: '10px' }}>
                {wishlistCount > 9 ? '9+' : wishlistCount}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={handleOpenNotif}
            className="relative p-2 rounded-lg transition-colors hover:bg-white/5"
            style={{ color: notifCount > 0 ? '#A78BFA' : '#9898A0' }}
          >
            <BellIcon className="w-5 h-5" />
            {notifCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full text-xs font-bold flex items-center justify-center px-1 animate-pulse"
                style={{ background: '#8B5CF6', color: '#fff', fontSize: '10px' }}
              >
                {notifCount > 9 ? '9+' : notifCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {notifOpen && (
            <div
              className="absolute right-0 top-12 w-80 rounded-2xl shadow-2xl overflow-hidden"
              style={{ background: 'rgba(18,18,22,0.98)', border: '1px solid rgba(238,238,240,0.1)', backdropFilter: 'blur(20px)' }}
            >
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(238,238,240,0.06)' }}>
                <span className="text-sm font-bold" style={{ color: '#EEEEF0' }}>Notifications</span>
                <span className="text-xs" style={{ color: '#9898A0' }}>Filter matches</span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                   <div className="px-4 py-6 text-center text-sm" style={{ color: '#9898A0' }}>No new notifications</div>
                ) : (
                  notifications.map(n => (
                    <Link
                      key={n.filterId}
                      href={`/listings?city=${n.filterName}`}
                      onClick={() => setNotifOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                      style={{ borderBottom: '1px solid rgba(238,238,240,0.04)' }}
                    >
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(139,92,246,0.2)' }}>
                        <BellIcon className="w-4 h-4" style={{ color: '#A78BFA' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-snug" style={{ color: '#EEEEF0' }}>
                          <span className="font-bold" style={{ color: '#A78BFA' }}>{n.newCount} new match{n.newCount > 1 ? 'es' : ''}</span> for your saved filter
                        </p>
                        <p className="text-xs mt-0.5 truncate" style={{ color: '#9898A0' }}>{n.filterName}</p>
                      </div>
                      {!n.seenAt && (
                        <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: '#8B5CF6' }} />
                      )}
                    </Link>
                  ))
                )}
              </div>
              <div className="px-4 py-2.5" style={{ borderTop: '1px solid rgba(238,238,240,0.06)' }}>
                <Link href="/saved-filters" onClick={() => setNotifOpen(false)} className="text-xs font-medium hover:opacity-80 transition-opacity" style={{ color: '#A78BFA' }}>
                  Manage saved filters →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Wishlist icon (mobile) */}
        <Link href="/wishlist" className="md:hidden relative p-2 rounded-lg" style={{ color: '#9898A0' }}>
          <HeartIcon className="w-5 h-5" />
          {wishlistCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center" style={{ background: '#EF4444', color: '#fff', fontSize: '10px' }}>
              {wishlistCount > 9 ? '9+' : wishlistCount}
            </span>
          )}
        </Link>

        {/* Dashboard icon (desktop) */}
        <Link href="/dashboard" className="hidden md:flex items-center gap-1.5 p-2 rounded-lg transition-colors hover:bg-white/5" style={{ color: pathname === '/dashboard' ? '#A78BFA' : '#9898A0' }}>
          <UserCircleIcon className="w-5 h-5" />
        </Link>

        {/* Auth buttons */}
        {user ? (
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm font-medium" style={{ color: '#EEEEF0' }}>
              Hi, {user.name}
            </span>
            <button
              onClick={handleSignOut}
              className="text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200"
              style={{ color: '#9898A0', background: 'rgba(238,238,240,0.06)' }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <>
            <Link href="/login" className="hidden md:block text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200" style={{ color: '#9898A0' }}>
              Sign In
            </Link>
            <Link href="/signup" className="hidden md:block btn-violet text-sm px-4 py-2 rounded-lg">
              Sign Up
            </Link>
          </>
        )}

        <button
          onClick={onFindMatch}
          className="btn-violet text-sm px-5 py-2 rounded-lg hidden md:block"
        >
          Find My Match
        </button>
        <button
          className="md:hidden p-2 rounded-lg"
          style={{ color: '#9898A0' }}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="absolute top-16 left-0 right-0 py-4 px-6 flex flex-col gap-2 md:hidden"
          style={{ background: 'rgba(9,9,11,0.97)', borderBottom: '1px solid rgba(238,238,240,0.06)' }}
        >
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between"
              style={{
                color: pathname === link.href ? '#A78BFA' : '#9898A0',
                background: pathname === link.href ? 'rgba(139,92,246,0.12)' : 'rgba(238,238,240,0.04)',
              }}
            >
              {link.label}
              {link.href === '/wishlist' && wishlistCount > 0 && (
                <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center" style={{ background: '#EF4444', color: '#fff' }}>
                  {wishlistCount}
                </span>
              )}
            </Link>
          ))}
          {user ? (
            <div className="flex flex-col gap-2 mt-1">
              <div className="text-center py-2 text-sm font-medium" style={{ color: '#EEEEF0' }}>
                Logged in as: {user.name}
              </div>
              <button
                onClick={() => { handleSignOut(); setMobileOpen(false); }}
                className="w-full text-center py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex gap-2 mt-1">
              <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 rounded-xl text-sm font-medium" style={{ background: 'rgba(238,238,240,0.06)', color: '#9898A0' }}>
                Sign In
              </Link>
              <Link href="/signup" onClick={() => setMobileOpen(false)} className="flex-1 text-center btn-violet py-2.5 rounded-xl text-sm font-semibold">
                Sign Up
              </Link>
            </div>
          )}
          <button
            onClick={() => { onFindMatch(); setMobileOpen(false); }}
            className="btn-violet text-sm px-5 py-3 rounded-xl mt-1"
          >
            Find My Match
          </button>
        </div>
      )}
    </header>
  );
}