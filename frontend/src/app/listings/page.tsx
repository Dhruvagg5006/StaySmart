'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MagnifyingGlassIcon, HeartIcon, MapPinIcon, ShieldCheckIcon, BoltIcon, HomeIcon, StarIcon, ArrowsUpDownIcon, XMarkIcon, FunnelIcon,  } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { isInWishlist, toggleWishlist } from '@/lib/wishlist';
import { getFreshPropertyIds } from '@/lib/notifications';

interface Property {
  id: string;
  title: string;
  city: string;
  area: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  matchScore: number;
  safetyScore: number;
  priceStatus: 'Overpriced' | 'Fair Value' | 'Undervalued';
  predictedPrice: number;
  fakeConfidence: number;
  commuteTime: string;
  amenities: string[];
  rating: number;
  reviews: number;
  image: string;
  alt: string;
  aiReason: string;
  type: 'Apartment' | 'Villa' | 'Studio' | 'PG';
}

const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Modern Studio near Cyber Hub',
    city: 'Gurugram',
    area: 'DLF Phase 2',
    price: 22000,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 480,
    matchScore: 96,
    safetyScore: 91,
    priceStatus: 'Fair Value',
    predictedPrice: 21500,
    fakeConfidence: 98,
    commuteTime: '12 min metro',
    amenities: ['WiFi', 'Gym', 'Security', 'Parking'],
    rating: 4.8,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
    alt: 'Modern studio apartment with large windows and minimalist interior in Gurugram',
    aiReason: 'Under budget, 12 min from metro, excellent WiFi for remote work',
    type: 'Studio',
  },
  {
    id: '2',
    title: 'Spacious 2BHK in Koramangala',
    city: 'Bangalore',
    area: 'Koramangala 5th Block',
    price: 28000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 950,
    matchScore: 94,
    safetyScore: 88,
    priceStatus: 'Undervalued',
    predictedPrice: 33000,
    fakeConfidence: 99,
    commuteTime: '8 min walk',
    amenities: ['WiFi', 'Gym', 'Pool', 'Security', 'Parking', 'Pet Friendly'],
    rating: 4.9,
    reviews: 87,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
    alt: 'Spacious 2BHK apartment with open living area and modern kitchen in Koramangala Bangalore',
    aiReason: 'Priced ₹5k below market, pet-friendly, walking distance to tech park',
    type: 'Apartment',
  },
  {
    id: '3',
    title: 'Premium 1BHK in Bandra West',
    city: 'Mumbai',
    area: 'Bandra West',
    price: 45000,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 620,
    matchScore: 89,
    safetyScore: 85,
    priceStatus: 'Overpriced',
    predictedPrice: 38000,
    fakeConfidence: 95,
    commuteTime: '15 min local train',
    amenities: ['WiFi', 'Security', 'Parking', 'Balcony'],
    rating: 4.6,
    reviews: 203,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
    alt: 'Premium 1BHK apartment with sea view balcony in Bandra West Mumbai',
    aiReason: 'Great location, but priced ₹7k above predicted market value',
    type: 'Apartment',
  },
  {
    id: '4',
    title: 'Cozy Studio in Sector 62',
    city: 'Noida',
    area: 'Sector 62',
    price: 15000,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 380,
    matchScore: 92,
    safetyScore: 93,
    priceStatus: 'Fair Value',
    predictedPrice: 15500,
    fakeConfidence: 97,
    commuteTime: '5 min metro',
    amenities: ['WiFi', 'Security', 'Power Backup'],
    rating: 4.5,
    reviews: 56,
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80',
    alt: 'Cozy studio apartment with compact modern design near metro station in Noida Sector 62',
    aiReason: 'Best value in Noida, 5 min from metro, safe neighborhood score 93',
    type: 'Studio',
  },
  {
    id: '5',
    title: 'Luxury Villa in Whitefield',
    city: 'Bangalore',
    area: 'Whitefield',
    price: 75000,
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2200,
    matchScore: 87,
    safetyScore: 96,
    priceStatus: 'Undervalued',
    predictedPrice: 85000,
    fakeConfidence: 99,
    commuteTime: '20 min cab',
    amenities: ['WiFi', 'Gym', 'Pool', 'Garden', 'Security', 'Parking', 'Pet Friendly'],
    rating: 4.9,
    reviews: 41,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    alt: 'Luxury 3BHK villa with private garden and swimming pool in Whitefield Bangalore',
    aiReason: 'Priced ₹10k below market, highest safety score in area, premium amenities',
    type: 'Villa',
  },
  {
    id: '6',
    title: '2BHK near Connaught Place',
    city: 'Delhi',
    area: 'Rajendra Nagar',
    price: 32000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 850,
    matchScore: 83,
    safetyScore: 79,
    priceStatus: 'Fair Value',
    predictedPrice: 31000,
    fakeConfidence: 94,
    commuteTime: '10 min metro',
    amenities: ['WiFi', 'Security', 'Parking', 'Balcony'],
    rating: 4.3,
    reviews: 178,
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80',
    alt: '2BHK apartment with balcony and city view near Connaught Place Delhi',
    aiReason: 'Central location, 10 min to CP metro, fair market pricing',
    type: 'Apartment',
  },
  {
    id: '7',
    title: 'Furnished PG in HSR Layout',
    city: 'Bangalore',
    area: 'HSR Layout Sector 2',
    price: 12000,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 280,
    matchScore: 78,
    safetyScore: 87,
    priceStatus: 'Fair Value',
    predictedPrice: 12500,
    fakeConfidence: 91,
    commuteTime: '18 min bus',
    amenities: ['WiFi', 'Meals', 'Laundry', 'Security'],
    rating: 4.2,
    reviews: 312,
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80',
    alt: 'Furnished PG room with attached bathroom and study desk in HSR Layout Bangalore',
    aiReason: 'Most affordable option, meals included, strong WiFi for remote work',
    type: 'PG',
  },
  {
    id: '8',
    title: 'Sea-facing 3BHK in Worli',
    city: 'Mumbai',
    area: 'Worli Sea Face',
    price: 120000,
    bedrooms: 3,
    bathrooms: 3,
    sqft: 1800,
    matchScore: 71,
    safetyScore: 94,
    priceStatus: 'Overpriced',
    predictedPrice: 105000,
    fakeConfidence: 96,
    commuteTime: '25 min cab',
    amenities: ['WiFi', 'Gym', 'Pool', 'Concierge', 'Security', 'Parking'],
    rating: 4.7,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
    alt: 'Luxury sea-facing 3BHK apartment with panoramic ocean view in Worli Mumbai',
    aiReason: 'Premium location but ₹15k above predicted value, excellent safety',
    type: 'Apartment',
  },
];

const AMENITY_OPTIONS = ['WiFi', 'Gym', 'Pool', 'Parking', 'Pet Friendly', 'Security', 'Balcony', 'Meals'];
const SORT_OPTIONS = ['Best Match', 'Price: Low to High', 'Price: High to Low', 'Safety Score', 'Newest'];
const CITY_OPTIONS = ['All Cities', 'Delhi', 'Mumbai', 'Bangalore', 'Gurugram', 'Noida'];
const TYPE_OPTIONS = ['All Types', 'Apartment', 'Villa', 'Studio', 'PG'];

function PriceStatusBadge({ status }: { status: Property['priceStatus'] }) {
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

function MatchScoreBadge({ score }: { score: number }) {
  const color = score >= 90 ? '#A78BFA' : score >= 80 ? '#818CF8' : '#9898A0';
  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.35)' }}>
      <BoltIcon className="w-3 h-3" style={{ color }} />
      <span className="text-xs font-bold" style={{ color }}>{score}% Match</span>
    </div>
  );
}

export default function ListingsPage() {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [freshIds, setFreshIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedType, setSelectedType] = useState('All Types');
  const [maxPrice, setMaxPrice] = useState(150000);
  const [minBedrooms, setMinBedrooms] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('Best Match');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());

  // Preferences States (Module 1)
  const [preferences, setPreferences] = useState<{ budget: number; preferred_city: string; pets_allowed: boolean; wfh: boolean } | null>(null);
  const [showPreferenceOnboarding, setShowPreferenceOnboarding] = useState(false);
  const [onboardCity, setOnboardCity] = useState('');
  const [onboardBudget, setOnboardBudget] = useState(0);
  const [onboardPets, setOnboardPets] = useState(false);
  const [onboardWfh, setOnboardWfh] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const ids = new Set(MOCK_PROPERTIES.map(p => p.id));
      setVisibleCards(ids);
    }, 100);
    // Sync saved state from localStorage
    const saved = new Set(MOCK_PROPERTIES.filter(p => isInWishlist(p.id)).map(p => p.id));
    setSavedIds(saved);
    // Load fresh property IDs
    setFreshIds(new Set(getFreshPropertyIds()));
    const handler = () => {
      const updated = new Set(MOCK_PROPERTIES.filter(p => isInWishlist(p.id)).map(p => p.id));
      setSavedIds(updated);
    };
    const freshHandler = () => setFreshIds(new Set(getFreshPropertyIds()));
    window.addEventListener('wishlist-updated', handler);
    window.addEventListener('fresh-properties-updated', freshHandler);

    // Fetch user preferences (Module 1 onboarding and filter sync)
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetch('http://localhost:8000/user/preference', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setPreferences(data);
          // If budget is 0 or preferred_city is not set, they are new, show onboarding popup
          if (data.budget === 0 || !data.preferred_city) {
            setShowPreferenceOnboarding(true);
          } else {
            // Apply saved preferences to listings filter view
            setSelectedCity(data.preferred_city);
            setMaxPrice(data.budget);
            const amenitiesToAdd = [];
            if (data.pets_allowed) amenitiesToAdd.push('Pet Friendly');
            if (data.wfh) amenitiesToAdd.push('WiFi');
            if (amenitiesToAdd.length > 0) {
              setSelectedAmenities(prev => {
                const updated = [...prev];
                amenitiesToAdd.forEach(a => {
                  if (!updated.push) return;
                  if (!updated.includes(a)) updated.push(a);
                });
                return updated;
              });
            }
          }
        }
      })
      .catch(err => console.error('Failed to load user preferences:', err));
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('wishlist-updated', handler);
      window.removeEventListener('fresh-properties-updated', freshHandler);
    };
  }, []);

  const saveOnboardPreferences = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    try {
      const res = await fetch('http://localhost:8000/user/preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          budget: onboardBudget,
          preferred_city: onboardCity,
          pets_allowed: onboardPets,
          wfh: onboardWfh
        })
      });
      if (res.ok) {
        const data = await res.json();
        setPreferences(data);
        setSelectedCity(data.preferred_city);
        setMaxPrice(data.budget);
        const amenitiesToAdd = [];
        if (data.pets_allowed) amenitiesToAdd.push('Pet Friendly');
        if (data.wfh) amenitiesToAdd.push('WiFi');
        
        setSelectedAmenities(prev => {
          const updated = [...prev];
          amenitiesToAdd.forEach(a => {
            if (!updated.includes(a)) updated.push(a);
          });
          return updated;
        });
        
        setShowPreferenceOnboarding(false);
      }
    } catch (err) {
      console.error('Failed to save onboard preferences:', err);
    }
  };

  const toggleSave = (id: string) => {
    const property = MOCK_PROPERTIES.find(p => p.id === id);
    if (!property) return;
    toggleWishlist({
      id: property.id,
      title: property.title,
      city: property.city,
      area: property.area,
      price: property.price,
      bedrooms: property.bedrooms,
      sqft: property.sqft,
      matchScore: property.matchScore,
      safetyScore: property.safetyScore,
      priceStatus: property.priceStatus,
      fakeConfidence: property.fakeConfidence,
      rating: property.rating,
      image: property.image,
      alt: property.alt,
      aiReason: property.aiReason,
      type: property.type,
      savedAt: Date.now(),
    });
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAmenity = (a: string) => {
    setSelectedAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };

  const filtered = MOCK_PROPERTIES.filter(p => {
    if (selectedCity !== 'All Cities' && p.city !== selectedCity) return false;
    if (selectedType !== 'All Types' && p.type !== selectedType) return false;
    if (p.price > maxPrice) return false;
    if (p.bedrooms < minBedrooms) return false;
    if (selectedAmenities.length > 0 && !selectedAmenities.every(a => p.amenities.includes(a))) return false;
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) && !p.area.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'Best Match') return b.matchScore - a.matchScore;
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    if (sortBy === 'Safety Score') return b.safetyScore - a.safetyScore;
    return 0;
  });

  return (
    <div className="min-h-screen" style={{ background: '#09090B' }}>
      <Header onFindMatch={() => {}} />

      {/* Search Bar */}
      <div className="pt-24 pb-6 px-4 md:px-8" style={{ borderBottom: '1px solid rgba(238,238,240,0.06)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#9898A0' }} />
              <input
                className="input-beacon w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                placeholder="Search by area, landmark, or describe your ideal home..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="input-beacon px-4 py-3 rounded-xl text-sm bg-transparent"
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
            >
              {CITY_OPTIONS.map(c => <option key={c} value={c} style={{ background: '#1E1332' }}>{c}</option>)}
            </select>
            <select
              className="input-beacon px-4 py-3 rounded-xl text-sm bg-transparent"
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
            >
              {TYPE_OPTIONS.map(t => <option key={t} value={t} style={{ background: '#1E1332' }}>{t}</option>)}
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
              style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', color: '#A78BFA' }}
            >
              <FunnelIcon className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(30,19,50,0.5)', border: '1px solid rgba(238,238,240,0.08)' }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-semibold mb-2 block" style={{ color: '#9898A0' }}>MAX BUDGET</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range" min={5000} max={150000} step={1000}
                      value={maxPrice}
                      onChange={e => setMaxPrice(Number(e.target.value))}
                      className="flex-1 accent-violet-500"
                    />
                    <span className="text-sm font-bold" style={{ color: '#A78BFA' }}>₹{(maxPrice / 1000).toFixed(0)}k</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold mb-2 block" style={{ color: '#9898A0' }}>MIN BEDROOMS</label>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3].map(n => (
                      <button
                        key={n}
                        onClick={() => setMinBedrooms(n)}
                        className="chip px-3 py-1.5 rounded-lg text-sm font-medium"
                        style={minBedrooms === n ? { background: 'rgba(139,92,246,0.2)', borderColor: '#8B5CF6', color: '#A78BFA' } : {}}
                      >
                        {n === 0 ? 'Any' : `${n}+`}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold mb-2 block" style={{ color: '#9898A0' }}>AMENITIES</label>
                  <div className="flex flex-wrap gap-2">
                    {AMENITY_OPTIONS.map(a => (
                      <button
                        key={a}
                        onClick={() => toggleAmenity(a)}
                        className="chip px-2.5 py-1 rounded-lg text-xs font-medium"
                        style={selectedAmenities.includes(a) ? { background: 'rgba(139,92,246,0.2)', borderColor: '#8B5CF6', color: '#A78BFA' } : {}}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-sm" style={{ color: '#9898A0' }}>
              <span className="font-bold text-white">{filtered.length}</span> properties found
            </span>
            {selectedAmenities.length > 0 && (
              <button onClick={() => setSelectedAmenities([])} className="ml-3 text-xs" style={{ color: '#A78BFA' }}>
                Clear filters <XMarkIcon className="inline w-3 h-3" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ArrowsUpDownIcon className="w-4 h-4" style={{ color: '#9898A0' }} />
            <select
              className="text-sm bg-transparent border-none outline-none font-medium"
              style={{ color: '#A78BFA' }}
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map(s => <option key={s} value={s} style={{ background: '#1E1332' }}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((property, i) => {
            const isFresh = freshIds.has(property.id);
            return (
            <div
              key={property.id}
              className="card-beacon rounded-2xl overflow-hidden relative"
              style={{
                opacity: visibleCards.has(property.id) ? 1 : 0,
                transform: visibleCards.has(property.id) ? 'translateY(0)' : 'translateY(32px)',
                transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 0.07}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 0.07}s`,
                boxShadow: isFresh ? '0 0 0 2px rgba(139,92,246,0.5)' : undefined,
              }}
            >
              {/* Fresh pulse ring */}
              {isFresh && (
                <span className="absolute inset-0 rounded-2xl pointer-events-none z-10" style={{
                  animation: 'freshPulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
                  boxShadow: '0 0 0 0 rgba(139,92,246,0.6)',
                }} />
              )}
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img src={property.image} alt={property.alt} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(9,9,11,0.7) 0%, transparent 50%)' }} />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <MatchScoreBadge score={property.matchScore} />
                  {isFresh && (
                    <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold" style={{ background: 'rgba(139,92,246,0.85)', color: '#fff' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" style={{ animation: 'pulse 1s infinite' }} />
                      New Match
                    </span>
                  )}
                </div>
                <button
                  onClick={() => toggleSave(property.id)}
                  className="absolute top-3 right-3 p-2 rounded-full"
                  style={{ background: 'rgba(9,9,11,0.6)', backdropFilter: 'blur(8px)' }}
                >
                  {savedIds.has(property.id)
                    ? <HeartSolid className="w-4 h-4 text-red-400" />
                    : <HeartIcon className="w-4 h-4 text-white" />
                  }
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

                {/* Amenities */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {property.amenities.slice(0, 4).map(a => (
                    <span key={a} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(238,238,240,0.06)', color: '#9898A0' }}>{a}</span>
                  ))}
                  {property.amenities.length > 4 && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(238,238,240,0.06)', color: '#9898A0' }}>+{property.amenities.length - 4}</span>
                  )}
                </div>

                {/* Price + CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold font-display" style={{ color: '#EEEEF0' }}>₹{(property.price / 1000).toFixed(0)}k</span>
                    <span className="text-xs ml-1" style={{ color: '#9898A0' }}>/month</span>
                  </div>
                  <Link
                    href={`/property/${property.id}`}
                    className="btn-violet text-xs px-4 py-2 rounded-lg"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-4" style={{ color: '#3A3A45' }} />
            <p className="text-lg font-semibold" style={{ color: '#9898A0' }}>No properties match your filters</p>
            <p className="text-sm mt-1" style={{ color: '#3A3A45' }}>Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      <Footer />

      {/* Onboarding Preferences Modal */}
      {showPreferenceOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-2xl border border-violet-500/30 bg-[#0F0F12] text-left">
            <h3 className="text-lg font-bold mb-2 text-white">Customize Your StaySmart Experience</h3>
            <p className="text-xs mb-5 text-[#9898A0]">
              To help our AI rank matches and predict fair prices, please share your default preferences.
            </p>
            
            <div className="space-y-4">
              {/* Preferred City */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#9898A0] block mb-1.5">Preferred City</label>
                <select
                  value={onboardCity}
                  onChange={e => setOnboardCity(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1E1332] border border-[#3A3A45] rounded-xl text-sm text-white outline-none"
                >
                  <option value="">Select a City</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Gurugram">Gurugram</option>
                  <option value="Noida">Noida</option>
                </select>
              </div>

              {/* Max Monthly Budget */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#9898A0] block mb-1.5">Max Monthly Budget (₹)</label>
                <input
                  type="number"
                  value={onboardBudget || ''}
                  onChange={e => setOnboardBudget(Number(e.target.value))}
                  placeholder="e.g. 30000"
                  className="w-full px-3 py-2 bg-[#1E1332] border border-[#3A3A45] rounded-xl text-sm text-white outline-none"
                />
              </div>

              {/* Switches */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <div className="text-sm font-semibold text-white">Pets Allowed</div>
                  <div className="text-xs text-[#9898A0]">Filter by properties that allow pets</div>
                </div>
                <button
                  type="button"
                  onClick={() => setOnboardPets(!onboardPets)}
                  className="relative w-11 h-6 rounded-full transition-all duration-300 shrink-0"
                  style={{ background: onboardPets ? 'rgba(139,92,246,0.8)' : 'rgba(238,238,240,0.12)' }}
                >
                  <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300"
                    style={{ left: onboardPets ? '22px' : '2px' }} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <div className="text-sm font-semibold text-white">Work From Home (WFH)</div>
                  <div className="text-xs text-[#9898A0]">Prioritize high-speed internet & workspace</div>
                </div>
                <button
                  type="button"
                  onClick={() => setOnboardWfh(!onboardWfh)}
                  className="relative w-11 h-6 rounded-full transition-all duration-300 shrink-0"
                  style={{ background: onboardWfh ? 'rgba(139,92,246,0.8)' : 'rgba(238,238,240,0.12)' }}
                >
                  <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300"
                    style={{ left: onboardWfh ? '22px' : '2px' }} />
                </button>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowPreferenceOnboarding(false)}
                className="flex-1 py-3 border border-white/10 rounded-xl text-xs font-semibold text-[#9898A0] hover:text-white transition-colors"
              >
                Skip for now
              </button>
              <button
                onClick={saveOnboardPreferences}
                disabled={!onboardCity || !onboardBudget}
                className="flex-1 py-3 bg-[#8B5CF6] text-white rounded-xl text-xs font-semibold hover:bg-[#7c4fdf] transition-colors disabled:opacity-40"
              >
                Save preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
