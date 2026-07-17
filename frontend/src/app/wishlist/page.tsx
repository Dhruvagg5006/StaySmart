'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { HeartIcon, MapPinIcon, ShieldCheckIcon, BoltIcon, StarIcon, TrashIcon, HomeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { getWishlist, removeFromWishlist, WishlistProperty } from '@/lib/wishlist';

function PriceStatusBadge({ status }: { status: WishlistProperty['priceStatus'] }) {
  const config = {
    'Overpriced': { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.4)', color: '#FCA5A5' },
    'Fair Value': { bg: 'rgba(234,179,8,0.15)', border: 'rgba(234,179,8,0.4)', color: '#FDE047' },
    'Undervalued': { bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.4)', color: '#86EFAC' },
  };
  const c = config[status];
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color }}>
      {status}
    </span>
  );
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistProperty[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setWishlist(getWishlist());
    const handler = () => setWishlist(getWishlist());
    window.addEventListener('wishlist-updated', handler);
    return () => window.removeEventListener('wishlist-updated', handler);
  }, []);

  const handleRemove = (id: string) => {
    removeFromWishlist(id);
    setWishlist(getWishlist());
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen" style={{ background: '#09090B' }}>
      <Header onFindMatch={() => {}} />

      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-24 pb-16">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
              <HeartSolid className="w-5 h-5 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold font-display" style={{ color: '#EEEEF0' }}>My Wishlist</h1>
          </div>
          <p className="text-sm" style={{ color: '#9898A0' }}>
            {wishlist.length > 0
              ? `${wishlist.length} saved propert${wishlist.length === 1 ? 'y' : 'ies'} — your shortlisted homes`
              : 'Properties you save will appear here'}
          </p>
        </div>

        {wishlist.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'rgba(238,238,240,0.04)', border: '1px solid rgba(238,238,240,0.08)' }}>
              <HeartIcon className="w-10 h-10" style={{ color: '#3A3A45' }} />
            </div>
            <h2 className="text-xl font-bold font-display mb-2" style={{ color: '#EEEEF0' }}>No saved properties yet</h2>
            <p className="text-sm mb-8 max-w-sm" style={{ color: '#9898A0' }}>
              Browse listings and tap the heart icon to save properties you like. They&apos;ll all appear here for easy comparison.
            </p>
            <Link href="/listings" className="btn-violet px-6 py-3 rounded-xl text-sm font-semibold">
              Browse Listings
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {wishlist.map((property, i) => (
              <div
                key={property.id}
                className="card-beacon rounded-2xl overflow-hidden"
                style={{
                  opacity: 1,
                  transform: 'translateY(0)',
                  transition: `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`,
                }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img src={property.image} alt={property.alt} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(9,9,11,0.7) 0%, transparent 50%)' }} />
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', backdropFilter: 'blur(8px)' }}>
                    <BoltIcon className="w-3 h-3" style={{ color: '#A78BFA' }} />
                    <span className="text-xs font-bold" style={{ color: '#A78BFA' }}>{property.matchScore}% Match</span>
                  </div>
                  <button
                    onClick={() => handleRemove(property.id)}
                    className="absolute top-3 right-3 p-2 rounded-full transition-all duration-200 hover:scale-110"
                    style={{ background: 'rgba(239,68,68,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(239,68,68,0.4)' }}
                    title="Remove from wishlist"
                  >
                    <HeartSolid className="w-4 h-4 text-red-400" />
                  </button>
                  <div className="absolute bottom-3 left-3">
                    <PriceStatusBadge status={property.priceStatus} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-sm leading-tight" style={{ color: '#EEEEF0' }}>{property.title}</h3>
                    <div className="flex items-center gap-1 ml-2 shrink-0">
                      <StarIcon className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-medium" style={{ color: '#EEEEF0' }}>{property.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    <MapPinIcon className="w-3.5 h-3.5 shrink-0" style={{ color: '#9898A0' }} />
                    <span className="text-xs" style={{ color: '#9898A0' }}>{property.area}, {property.city}</span>
                  </div>

                  {/* AI Reason */}
                  <div className="mb-3 px-3 py-2 rounded-lg text-xs" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', color: '#A78BFA' }}>
                    <BoltIcon className="inline w-3 h-3 mr-1" />
                    {property.aiReason}
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center px-2 py-1.5 rounded-lg" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                      <ShieldCheckIcon className="w-3.5 h-3.5 mx-auto mb-0.5 text-green-400" />
                      <div className="text-xs font-bold text-green-400">{property.safetyScore}</div>
                      <div className="text-xs" style={{ color: '#9898A0', fontSize: '10px' }}>Safety</div>
                    </div>
                    <div className="text-center px-2 py-1.5 rounded-lg" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                      <ShieldCheckIcon className="w-3.5 h-3.5 mx-auto mb-0.5 text-blue-400" />
                      <div className="text-xs font-bold text-blue-400">{property.fakeConfidence}%</div>
                      <div className="text-xs" style={{ color: '#9898A0', fontSize: '10px' }}>Genuine</div>
                    </div>
                    <div className="text-center px-2 py-1.5 rounded-lg" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
                      <HomeIcon className="w-3.5 h-3.5 mx-auto mb-0.5" style={{ color: '#A78BFA' }} />
                      <div className="text-xs font-bold" style={{ color: '#A78BFA' }}>{property.bedrooms}BHK</div>
                      <div className="text-xs" style={{ color: '#9898A0', fontSize: '10px' }}>{property.sqft} sqft</div>
                    </div>
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold font-display" style={{ color: '#EEEEF0' }}>₹{(property.price / 1000).toFixed(0)}k</span>
                      <span className="text-xs ml-1" style={{ color: '#9898A0' }}>/month</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRemove(property.id)}
                        className="p-2 rounded-lg transition-all duration-200 hover:opacity-80"
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}
                        title="Remove"
                      >
                        <TrashIcon className="w-4 h-4 text-red-400" />
                      </button>
                      <Link href={`/property/${property.id}`} className="btn-violet text-xs px-4 py-2 rounded-lg">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {wishlist.length > 0 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm" style={{ color: '#9898A0' }}>
              Saved {wishlist.length} propert{wishlist.length === 1 ? 'y' : 'ies'}
            </p>
            <Link href="/listings" className="text-sm font-medium" style={{ color: '#A78BFA' }}>
              + Browse more listings
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
