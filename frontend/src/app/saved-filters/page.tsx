'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  BookmarkIcon,
  TrashIcon,
  ArrowPathIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  ClockIcon,
  HomeIcon,
  SparklesIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  FunnelIcon,
  PlusIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { getSavedFilters, deleteSavedFilter, SavedFilter } from '@/lib/savedFilters';

const AMENITY_COLORS: Record<string, string> = {
  WiFi: 'rgba(139,92,246,0.18)',
  Gym: 'rgba(59,130,246,0.18)',
  Pool: 'rgba(6,182,212,0.18)',
  Security: 'rgba(16,185,129,0.18)',
  Parking: 'rgba(245,158,11,0.18)',
  'Pet Friendly': 'rgba(236,72,153,0.18)',
};

const AMENITY_TEXT: Record<string, string> = {
  WiFi: '#A78BFA',
  Gym: '#60A5FA',
  Pool: '#22D3EE',
  Security: '#34D399',
  Parking: '#FCD34D',
  'Pet Friendly': '#F472B6',
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function buildListingsUrl(filter: SavedFilter): string {
  const params = new URLSearchParams();
  if (filter.city) params.set('city', filter.city);
  if (filter.budget.max) params.set('maxBudget', filter.budget.max.toString());
  if (filter.bedrooms) params.set('bedrooms', filter.bedrooms.toString());
  if (filter.type) params.set('type', filter.type);
  return `/listings?${params.toString()}`;
}

export default function SavedFiltersPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<SavedFilter[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reloadingId, setReloadingId] = useState<string | null>(null);
  const [reloadedId, setReloadedId] = useState<string | null>(null);

  useEffect(() => {
    setFilters(getSavedFilters());
    const handler = () => setFilters(getSavedFilters());
    window.addEventListener('saved-filters-updated', handler);
    return () => window.removeEventListener('saved-filters-updated', handler);
  }, []);

  function handleDelete(id: string) {
    setDeletingId(id);
    setTimeout(() => {
      deleteSavedFilter(id);
      setFilters(getSavedFilters());
      setDeletingId(null);
    }, 350);
  }

  function handleReload(filter: SavedFilter) {
    setReloadingId(filter.id);
    setReloadedId(null);
    setTimeout(() => {
      setReloadingId(null);
      setReloadedId(filter.id);
      setTimeout(() => {
        setReloadedId(null);
        router.push(buildListingsUrl(filter));
      }, 600);
    }, 800);
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#09090B', color: '#EEEEF0' }}>
      <Header onFindMatch={() => router.push('/listings')} />

      <main className="flex-1 pt-24 pb-16 px-4 md:px-8 max-w-5xl mx-auto w-full">
        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.18)' }}>
              <BookmarkSolid className="w-5 h-5" style={{ color: '#A78BFA' }} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: '#EEEEF0' }}>
              Saved Filters
            </h1>
          </div>
          <p className="text-sm ml-[52px]" style={{ color: '#6B6B75' }}>
            Your saved search combinations — reload any filter to instantly re-run the search.
          </p>
        </div>

        {/* Stats Row */}
        {filters.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { label: 'Saved Filters', value: filters.length, icon: BookmarkIcon, color: '#A78BFA' },
              { label: 'Total Results', value: filters.reduce((s, f) => s + f.resultCount, 0), icon: ChartBarIcon, color: '#34D399' },
              { label: 'Cities Tracked', value: new Set(filters.map(f => f.city)).size, icon: MapPinIcon, color: '#60A5FA' },
            ].map(stat => (
              <div
                key={stat.label}
                className="rounded-2xl p-4 flex flex-col gap-1"
                style={{ background: 'rgba(238,238,240,0.04)', border: '1px solid rgba(238,238,240,0.07)' }}
              >
                <stat.icon className="w-4 h-4 mb-1" style={{ color: stat.color }} />
                <span className="text-xl font-bold" style={{ color: '#EEEEF0' }}>{stat.value}</span>
                <span className="text-xs" style={{ color: '#6B6B75' }}>{stat.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Filter Cards */}
        {filters.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)' }}>
              <FunnelIcon className="w-8 h-8" style={{ color: '#A78BFA' }} />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold mb-1" style={{ color: '#EEEEF0' }}>No saved filters yet</p>
              <p className="text-sm" style={{ color: '#6B6B75' }}>Use the filter panel on Listings to save your search combinations.</p>
            </div>
            <Link
              href="/listings"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'rgba(139,92,246,0.2)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.3)' }}
            >
              <PlusIcon className="w-4 h-4" />
              Browse Listings
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filters.map(filter => (
              <div
                key={filter.id}
                className="rounded-2xl overflow-hidden transition-all duration-350"
                style={{
                  background: 'rgba(238,238,240,0.04)',
                  border: '1px solid rgba(238,238,240,0.07)',
                  opacity: deletingId === filter.id ? 0 : 1,
                  transform: deletingId === filter.id ? 'translateX(40px)' : 'translateX(0)',
                  transition: 'opacity 0.35s ease, transform 0.35s ease',
                }}
              >
                {/* Card Top */}
                <div className="p-5 pb-4">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <SparklesIcon className="w-4 h-4 flex-shrink-0" style={{ color: '#A78BFA' }} />
                        <h2 className="text-base font-semibold truncate" style={{ color: '#EEEEF0' }}>{filter.name}</h2>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="flex items-center gap-1 text-xs" style={{ color: '#6B6B75' }}>
                          <CalendarDaysIcon className="w-3.5 h-3.5" />
                          Last run {formatDate(filter.lastRun)}
                        </span>
                        <span style={{ color: '#3A3A42' }}>·</span>
                        <span className="flex items-center gap-1 text-xs font-medium" style={{ color: '#34D399' }}>
                          <ChartBarIcon className="w-3.5 h-3.5" />
                          {filter.resultCount} results
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleDelete(filter.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                        style={{ background: 'rgba(239,68,68,0.1)', color: '#F87171' }}
                        title="Delete filter"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReload(filter)}
                        disabled={reloadingId === filter.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-70"
                        style={{
                          background: reloadedId === filter.id ? 'rgba(52,211,153,0.18)' : 'rgba(139,92,246,0.18)',
                          color: reloadedId === filter.id ? '#34D399' : '#A78BFA',
                          border: `1px solid ${reloadedId === filter.id ? 'rgba(52,211,153,0.3)' : 'rgba(139,92,246,0.3)'}`,
                        }}
                        title="Reload this filter"
                      >
                        {reloadedId === filter.id ? (
                          <>
                            <CheckCircleIcon className="w-3.5 h-3.5" />
                            Done
                          </>
                        ) : (
                          <>
                            <ArrowPathIcon className={`w-3.5 h-3.5 ${reloadingId === filter.id ? 'animate-spin' : ''}`} />
                            {reloadingId === filter.id ? 'Loading…' : 'Reload'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Filter Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {/* City */}
                    <div className="rounded-xl p-3" style={{ background: 'rgba(238,238,240,0.04)', border: '1px solid rgba(238,238,240,0.06)' }}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <MapPinIcon className="w-3.5 h-3.5" style={{ color: '#60A5FA' }} />
                        <span className="text-xs" style={{ color: '#6B6B75' }}>City</span>
                      </div>
                      <p className="text-sm font-semibold" style={{ color: '#EEEEF0' }}>{filter.city}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#6B6B75' }}>{filter.type}</p>
                    </div>

                    {/* Budget */}
                    <div className="rounded-xl p-3" style={{ background: 'rgba(238,238,240,0.04)', border: '1px solid rgba(238,238,240,0.06)' }}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <CurrencyRupeeIcon className="w-3.5 h-3.5" style={{ color: '#FCD34D' }} />
                        <span className="text-xs" style={{ color: '#6B6B75' }}>Budget</span>
                      </div>
                      <p className="text-sm font-semibold" style={{ color: '#EEEEF0' }}>
                        ₹{(filter.budget.min / 1000).toFixed(0)}k – ₹{(filter.budget.max / 1000).toFixed(0)}k
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#6B6B75' }}>per month</p>
                    </div>

                    {/* Commute */}
                    <div className="rounded-xl p-3" style={{ background: 'rgba(238,238,240,0.04)', border: '1px solid rgba(238,238,240,0.06)' }}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <ClockIcon className="w-3.5 h-3.5" style={{ color: '#F472B6' }} />
                        <span className="text-xs" style={{ color: '#6B6B75' }}>Commute</span>
                      </div>
                      <p className="text-sm font-semibold" style={{ color: '#EEEEF0' }}>≤ {filter.commuteMax} min</p>
                      <p className="text-xs mt-0.5" style={{ color: '#6B6B75' }}>max travel</p>
                    </div>

                    {/* Bedrooms */}
                    <div className="rounded-xl p-3" style={{ background: 'rgba(238,238,240,0.04)', border: '1px solid rgba(238,238,240,0.06)' }}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <HomeIcon className="w-3.5 h-3.5" style={{ color: '#34D399' }} />
                        <span className="text-xs" style={{ color: '#6B6B75' }}>Bedrooms</span>
                      </div>
                      <p className="text-sm font-semibold" style={{ color: '#EEEEF0' }}>{filter.bedrooms} BHK</p>
                      <p className="text-xs mt-0.5" style={{ color: '#6B6B75' }}>minimum</p>
                    </div>
                  </div>
                </div>

                {/* Amenities Strip */}
                {filter.amenities.length > 0 && (
                  <div
                    className="px-5 py-3 flex items-center gap-2 flex-wrap"
                    style={{ borderTop: '1px solid rgba(238,238,240,0.06)' }}
                  >
                    <span className="text-xs mr-1" style={{ color: '#6B6B75' }}>Amenities:</span>
                    {filter.amenities.map(a => (
                      <span
                        key={a}
                        className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          background: AMENITY_COLORS[a] ?? 'rgba(238,238,240,0.08)',
                          color: AMENITY_TEXT[a] ?? '#9898A0',
                        }}
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {filters.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Link
              href="/listings"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105"
              style={{ background: 'rgba(139,92,246,0.15)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.25)' }}
            >
              <FunnelIcon className="w-4 h-4" />
              Create New Filter
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
