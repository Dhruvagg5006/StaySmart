'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { MapPinIcon, ShieldCheckIcon, BoltIcon, StarIcon, HeartIcon, ShareIcon, TruckIcon, CheckCircleIcon, ExclamationTriangleIcon, ClockIcon, SparklesIcon, ArrowLeftIcon,  } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, CheckCircleIcon as CheckSolid } from '@heroicons/react/24/solid';
import { isInWishlist, toggleWishlist } from '../../../lib/wishlist';
import { getFreshPropertyIds, dismissFreshProperty } from '../../../lib/notifications';

const PROPERTIES: Record<string, {
  id: string; title: string; city: string; area: string; price: number;
  bedrooms: number; bathrooms: number; sqft: number; matchScore: number;
  safetyScore: number; priceStatus: string; predictedPrice: number;
  fakeConfidence: number; commuteTime: string; amenities: string[];
  rating: number; reviews: number; images: { src: string; alt: string }[];
  aiReasons: string[]; description: string; host: string; hostRating: number;
  safetyBreakdown: { label: string; score: number }[];
  type: string; floor: number; totalFloors: number; furnished: string;
}> = {
  '1': {
    id: '1', title: 'Modern Studio near Cyber Hub', city: 'Gurugram', area: 'DLF Phase 2',
    price: 22000, bedrooms: 1, bathrooms: 1, sqft: 480, matchScore: 96,
    safetyScore: 91, priceStatus: 'Fair Value', predictedPrice: 21500,
    fakeConfidence: 98, commuteTime: '12 min metro', type: 'Studio', floor: 8, totalFloors: 15, furnished: 'Fully Furnished',
    amenities: ['High-Speed WiFi', 'Gym', '24/7 Security', 'Covered Parking', 'Power Backup', 'CCTV', 'Intercom'],
    rating: 4.8, reviews: 124,
    images: [
      { src: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', alt: 'Modern studio apartment living area with large windows and minimalist furniture in Gurugram' },
      { src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', alt: 'Modern kitchen with stainless steel appliances and granite countertop' },
      { src: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80', alt: 'Cozy bedroom with queen bed and ambient lighting' },
      { src: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80', alt: 'Clean modern bathroom with shower and white tiles' },
    ],
    aiReasons: [
      'Within your ₹25,000 budget at ₹22,000/month',
      'Only 12 minutes from IFFCO Chowk metro station',
      'Excellent WiFi reviews — 94% remote workers rated it 5★',
      'Safety score 91/100 — one of the safest zones in Gurugram',
      'Gym on premises — matches your fitness preference',
      'Highly rated by 124 verified guests (4.8★)',
    ],
    description: 'A beautifully designed studio apartment on the 8th floor of a premium residential tower in DLF Phase 2. Floor-to-ceiling windows offer stunning city views. The apartment features a modular kitchen, high-speed fiber internet, and access to a fully equipped gym. Perfect for working professionals who value comfort and connectivity.',
    host: 'Rajesh Sharma', hostRating: 4.9,
    safetyBreakdown: [
      { label: 'Crime Rate', score: 88 },
      { label: 'Street Lighting', score: 95 },
      { label: 'Hospitals Nearby', score: 90 },
      { label: 'Police Stations', score: 85 },
      { label: 'Emergency Response', score: 92 },
    ],
  },
  '2': {
    id: '2', title: 'Spacious 2BHK in Koramangala', city: 'Bangalore', area: 'Koramangala 5th Block',
    price: 28000, bedrooms: 2, bathrooms: 2, sqft: 950, matchScore: 94,
    safetyScore: 88, priceStatus: 'Undervalued', predictedPrice: 33000,
    fakeConfidence: 99, commuteTime: '8 min walk', type: 'Apartment', floor: 3, totalFloors: 6, furnished: 'Semi-Furnished',
    amenities: ['High-Speed WiFi', 'Gym', 'Swimming Pool', '24/7 Security', 'Covered Parking', 'Pet Friendly', 'Club House', 'Power Backup'],
    rating: 4.9, reviews: 87,
    images: [
      { src: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80', alt: 'Spacious 2BHK living room with open plan design and modern furniture in Koramangala' },
      { src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', alt: 'Well-equipped kitchen with dining area' },
      { src: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80', alt: 'Master bedroom with wardrobe and natural light' },
      { src: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80', alt: 'Apartment complex swimming pool surrounded by greenery' },
    ],
    aiReasons: [
      'Priced ₹5,000 below market value — exceptional deal',
      'Pet-friendly building — matches your pet preference',
      'Walking distance to Koramangala tech park',
      'Swimming pool and gym included in rent',
      'Safety score 88/100 — well-lit streets, active community',
      'Highest rated property in this area (4.9★, 87 reviews)',
    ],
    description: 'A premium 2BHK apartment in the heart of Koramangala, Bangalore\'s most sought-after tech hub. The apartment is semi-furnished with modular kitchen, wardrobes, and air conditioning. The gated community features a swimming pool, gym, and clubhouse. Pet-friendly building with dedicated pet areas.',
    host: 'Priya Nair', hostRating: 4.8,
    safetyBreakdown: [
      { label: 'Crime Rate', score: 85 },
      { label: 'Street Lighting', score: 92 },
      { label: 'Hospitals Nearby', score: 88 },
      { label: 'Police Stations', score: 82 },
      { label: 'Emergency Response', score: 90 },
    ],
  },
};

const SIMILAR = [
  { id: '3', title: 'Premium 1BHK in Bandra West', price: 45000, matchScore: 89, image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80', alt: 'Premium 1BHK apartment in Bandra West Mumbai', city: 'Mumbai' },
  { id: '4', title: 'Cozy Studio in Sector 62', price: 15000, matchScore: 92, image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80', alt: 'Cozy studio apartment near metro in Noida Sector 62', city: 'Noida' },
  { id: '6', title: '2BHK near Connaught Place', price: 32000, matchScore: 83, image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=80', alt: '2BHK apartment with balcony near Connaught Place Delhi', city: 'Delhi' },
];

function SafetyGauge({ score }: { score: number }) {
  const color = score >= 90 ? '#4ADE80' : score >= 75 ? '#FACC15' : '#F87171';
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="flex items-center gap-6">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(238,238,240,0.08)" strokeWidth="8" />
          <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.22,1,0.36,1)' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold font-display" style={{ color }}>{score}</span>
          <span className="text-xs" style={{ color: '#9898A0' }}>/100</span>
        </div>
      </div>
    </div>
  );
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const property = PROPERTIES[id] || PROPERTIES['1'];

  const [activeImage, setActiveImage] = useState(0);
  const [saved, setSaved] = useState(false);
  const [commuteFrom, setCommuteFrom] = useState('');
  const [commuteResult, setCommuteResult] = useState<string | null>(null);
  const [isFresh, setIsFresh] = useState(false);

  useEffect(() => {
    setSaved(isInWishlist(property.id));
    const freshIds = getFreshPropertyIds();
    setIsFresh(freshIds.includes(property.id));
    const handler = () => setSaved(isInWishlist(property.id));
    window.addEventListener('wishlist-updated', handler);
    return () => window.removeEventListener('wishlist-updated', handler);
  }, [property.id]);

  const handleSaveToggle = () => {
    const result = toggleWishlist({
      id: property.id,
      title: property.title,
      city: property.city,
      area: property.area,
      price: property.price,
      bedrooms: property.bedrooms,
      sqft: property.sqft,
      matchScore: property.matchScore,
      safetyScore: property.safetyScore,
      priceStatus: property.priceStatus as 'Overpriced' | 'Fair Value' | 'Undervalued',
      fakeConfidence: property.fakeConfidence,
      rating: property.rating,
      image: property.images[0].src,
      alt: property.images[0].alt,
      aiReason: property.aiReasons[0],
      type: property.type,
      savedAt: Date.now(),
    });
    setSaved(result);
  };

  const handleCommute = () => {
    if (!commuteFrom.trim()) return;
    setCommuteResult('Calculating...');
    setTimeout(() => {
      setCommuteResult(`~${Math.floor(Math.random() * 20) + 10} min by metro · ~${Math.floor(Math.random() * 30) + 15} min by cab · ~${Math.floor(Math.random() * 40) + 25} min by bus`);
    }, 800);
  };

  const handleBookNow = () => {
    if (isFresh) dismissFreshProperty(property.id);
    const params = new URLSearchParams({
      propertyId: property.id,
      title: property.title,
      city: property.city,
      price: property.price.toString(),
      image: property.images[0].src,
    });
    router.push(`/checkout?${params.toString()}`);
  };

  const priceConfig: Record<string, { bg: string; border: string; color: string; icon: React.ReactNode }> = {
    'Overpriced': { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', color: '#FCA5A5', icon: <ExclamationTriangleIcon className="w-5 h-5" /> },
    'Fair Value': { bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)', color: '#FDE047', icon: <CheckCircleIcon className="w-5 h-5" /> },
    'Undervalued': { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', color: '#86EFAC', icon: <CheckSolid className="w-5 h-5" /> },
  };
  const pc = priceConfig[property.priceStatus] || priceConfig['Fair Value'];

  return (
    <div className="min-h-screen" style={{ background: '#09090B' }}>
      <Header onFindMatch={() => {}} />

      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-24 pb-16">
        {/* Back */}
        <Link href="/listings" className="inline-flex items-center gap-2 text-sm mb-6 hover:opacity-80 transition-opacity" style={{ color: '#9898A0' }}>
          <ArrowLeftIcon className="w-4 h-4" /> Back to Listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="rounded-2xl overflow-hidden">
              <div className="relative h-72 md:h-96">
                <img src={property.images[activeImage].src} alt={property.images[activeImage].alt} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(9,9,11,0.5) 0%, transparent 60%)' }} />
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', backdropFilter: 'blur(8px)' }}>
                  <BoltIcon className="w-4 h-4" style={{ color: '#A78BFA' }} />
                  <span className="text-sm font-bold" style={{ color: '#A78BFA' }}>{property.matchScore}% AI Match</span>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                {property.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)} className="relative h-16 flex-1 rounded-xl overflow-hidden" style={{ opacity: activeImage === i ? 1 : 0.5, border: activeImage === i ? '2px solid #8B5CF6' : '2px solid transparent', transition: 'all 0.2s' }}>
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Basic Info */}
            <div className="card-beacon rounded-2xl p-6">
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl font-bold font-display" style={{ color: '#EEEEF0' }}>{property.title}</h1>
                <div className="flex gap-2">
                  <button onClick={() => handleSaveToggle()} className="p-2 rounded-xl" style={{ background: 'rgba(238,238,240,0.06)' }}>
                    {saved ? <HeartSolid className="w-5 h-5 text-red-400" /> : <HeartIcon className="w-5 h-5" style={{ color: '#9898A0' }} />}
                  </button>
                  <button className="p-2 rounded-xl" style={{ background: 'rgba(238,238,240,0.06)' }}>
                    <ShareIcon className="w-5 h-5" style={{ color: '#9898A0' }} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <MapPinIcon className="w-4 h-4" style={{ color: '#9898A0' }} />
                <span className="text-sm" style={{ color: '#9898A0' }}>{property.area}, {property.city}</span>
                <span className="mx-2" style={{ color: '#3A3A45' }}>·</span>
                <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium" style={{ color: '#EEEEF0' }}>{property.rating} ({property.reviews} reviews)</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[
                  { label: 'Type', value: property.type },
                  { label: 'Bedrooms', value: `${property.bedrooms} BHK` },
                  { label: 'Area', value: `${property.sqft} sqft` },
                  { label: 'Floor', value: `${property.floor}/${property.totalFloors}` },
                ].map(item => (
                  <div key={item.label} className="text-center p-3 rounded-xl" style={{ background: 'rgba(238,238,240,0.04)', border: '1px solid rgba(238,238,240,0.06)' }}>
                    <div className="text-sm font-bold" style={{ color: '#EEEEF0' }}>{item.value}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#9898A0' }}>{item.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#9898A0' }}>{property.description}</p>
            </div>

            {/* AI Recommendation Explanation */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)' }}>
              <div className="flex items-center gap-2 mb-4">
                <SparklesIcon className="w-5 h-5" style={{ color: '#A78BFA' }} />
                <h2 className="text-base font-bold" style={{ color: '#A78BFA' }}>Why StaySmart AI Recommends This</h2>
              </div>
              <div className="space-y-2.5">
                {property.aiReasons.map((reason, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckSolid className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#A78BFA' }} />
                    <span className="text-sm" style={{ color: '#EEEEF0' }}>{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Neighborhood Safety */}
            <div className="card-beacon rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <ShieldCheckIcon className="w-5 h-5 text-green-400" />
                <h2 className="text-base font-bold" style={{ color: '#EEEEF0' }}>Neighborhood Safety Score</h2>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <SafetyGauge score={property.safetyScore} />
                <div className="flex-1 space-y-3">
                  {property.safetyBreakdown.map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: '#9898A0' }}>{item.label}</span>
                        <span className="font-semibold" style={{ color: '#EEEEF0' }}>{item.score}/100</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ background: 'rgba(238,238,240,0.08)' }}>
                        <div className="h-1.5 rounded-full" style={{ width: `${item.score}%`, background: item.score >= 90 ? '#4ADE80' : item.score >= 75 ? '#FACC15' : '#F87171', transition: 'width 1s cubic-bezier(0.22,1,0.36,1)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Commute Estimator */}
            <div className="card-beacon rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TruckIcon className="w-5 h-5" style={{ color: '#A78BFA' }} />
                <h2 className="text-base font-bold" style={{ color: '#EEEEF0' }}>Commute Estimator</h2>
              </div>
              <div className="flex gap-3">
                <input
                  className="input-beacon flex-1 px-4 py-2.5 rounded-xl text-sm"
                  placeholder="Enter your office/college address..."
                  value={commuteFrom}
                  onChange={e => setCommuteFrom(e.target.value)}
                />
                <button onClick={handleCommute} className="btn-violet px-4 py-2.5 rounded-xl text-sm">
                  Estimate
                </button>
              </div>
              {commuteResult && (
                <div className="mt-3 p-3 rounded-xl text-sm" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', color: '#A78BFA' }}>
                  <ClockIcon className="inline w-4 h-4 mr-1" />
                  {commuteResult}
                </div>
              )}
              <div className="mt-3 flex items-center gap-2 text-xs" style={{ color: '#9898A0' }}>
                <MapPinIcon className="w-3.5 h-3.5" />
                Nearest metro: {property.commuteTime} from this property
              </div>
            </div>

            {/* Amenities */}
            <div className="card-beacon rounded-2xl p-6">
              <h2 className="text-base font-bold mb-4" style={{ color: '#EEEEF0' }}>Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities.map(a => (
                  <div key={a} className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(238,238,240,0.04)', border: '1px solid rgba(238,238,240,0.06)' }}>
                    <CheckSolid className="w-4 h-4 shrink-0" style={{ color: '#A78BFA' }} />
                    <span className="text-sm" style={{ color: '#EEEEF0' }}>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-4">
            {/* Price Card */}
            <div className="card-beacon rounded-2xl p-5 sticky top-24">
              <div className="mb-4">
                <span className="text-3xl font-bold font-display" style={{ color: '#EEEEF0' }}>₹{(property.price / 1000).toFixed(0)}k</span>
                <span className="text-sm ml-1" style={{ color: '#9898A0' }}>/month</span>
              </div>

              {/* Price Prediction */}
              <div className="mb-4 p-4 rounded-xl" style={{ background: pc.bg, border: `1px solid ${pc.border}` }}>
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ color: pc.color }}>{pc.icon}</span>
                  <span className="text-sm font-bold" style={{ color: pc.color }}>{property.priceStatus}</span>
                </div>
                <div className="text-xs" style={{ color: '#9898A0' }}>
                  AI predicted fair price: <span className="font-semibold" style={{ color: '#EEEEF0' }}>₹{(property.predictedPrice / 1000).toFixed(0)}k/mo</span>
                </div>
                {property.priceStatus === 'Undervalued' && (
                  <div className="text-xs mt-1 font-medium" style={{ color: '#86EFAC' }}>
                    Save ₹{((property.predictedPrice - property.price) / 1000).toFixed(0)}k/month vs market
                  </div>
                )}
              </div>

              {/* Fake Listing Confidence */}
              <div className="mb-4 p-4 rounded-xl" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold" style={{ color: '#93C5FD' }}>Listing Authenticity</span>
                  <span className="text-sm font-bold" style={{ color: '#93C5FD' }}>{property.fakeConfidence}% Genuine</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'rgba(238,238,240,0.08)' }}>
                  <div className="h-2 rounded-full bg-blue-400" style={{ width: `${property.fakeConfidence}%`, transition: 'width 1s ease' }} />
                </div>
                <div className="text-xs mt-1.5" style={{ color: '#9898A0' }}>Verified host · Complete listing · Consistent reviews</div>
              </div>

              {/* Host */}
              <div className="mb-4 p-3 rounded-xl flex items-center gap-3" style={{ background: 'rgba(238,238,240,0.04)', border: '1px solid rgba(238,238,240,0.06)' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'rgba(139,92,246,0.2)', color: '#A78BFA' }}>
                  {property.host.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-medium" style={{ color: '#EEEEF0' }}>{property.host}</div>
                  <div className="flex items-center gap-1">
                    <StarIcon className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs" style={{ color: '#9898A0' }}>{property.hostRating} host rating</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                className="w-full btn-violet py-3 rounded-xl text-sm font-semibold mb-3"
              >
                Book Now
              </button>
              <button
                onClick={handleSaveToggle}
                className="w-full py-3 rounded-xl text-sm font-semibold"
                style={{ background: saved ? 'rgba(239,68,68,0.1)' : 'rgba(238,238,240,0.06)', border: saved ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(238,238,240,0.1)', color: saved ? '#FCA5A5' : '#EEEEF0' }}
              >
                {saved ? '♥ Saved to Wishlist' : '♡ Save to Wishlist'}
              </button>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        <div className="mt-10">
          <h2 className="text-xl font-bold font-display mb-5" style={{ color: '#EEEEF0' }}>Similar Properties You Might Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SIMILAR.map(p => (
              <Link key={p.id} href={`/property/${p.id}`} className="card-beacon rounded-2xl overflow-hidden block hover:scale-[1.02] transition-transform duration-300">
                <div className="relative h-36">
                  <img src={p.image} alt={p.alt} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-bold" style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', color: '#A78BFA' }}>
                    {p.matchScore}% Match
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-sm font-semibold mb-1" style={{ color: '#EEEEF0' }}>{p.title}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: '#9898A0' }}>{p.city}</span>
                    <span className="text-sm font-bold" style={{ color: '#A78BFA' }}>₹{(p.price / 1000).toFixed(0)}k/mo</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
