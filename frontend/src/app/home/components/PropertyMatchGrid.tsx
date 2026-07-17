'use client';

import React, { useEffect, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface Property {
  id: number;
  image: string;
  alt: string;
  confidence: number;
  price: string;
  address: string;
  city: string;
  beds: number;
  baths: number;
  sqft: string;
  tags: string[];
  priceChange: string;
  positive: boolean;
  span?: string;
}

const properties: Property[] = [
{
  id: 1,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1544beaf4-1772229987323.png",
  alt: 'Modern two-story house with white facade and attached garage in suburban neighborhood',
  confidence: 97,
  price: '$648,000',
  address: '2847 Meridian Way',
  city: 'Austin, TX 78701',
  beds: 4,
  baths: 3,
  sqft: '2,340',
  tags: ['Walkable', 'Top Schools'],
  priceChange: '+2.1% / yr',
  positive: true,
  span: 'col-span-2'
},
{
  id: 2,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_16bc71691-1767021511546.png",
  alt: 'Craftsman style single-family home with front porch and mature trees on quiet street',
  confidence: 91,
  price: '$412,500',
  address: '509 Lakeview Terrace',
  city: 'Denver, CO 80203',
  beds: 3,
  baths: 2,
  sqft: '1,820',
  tags: ['Quiet Zone', 'Transit+'],
  priceChange: '+3.4% / yr',
  positive: true,
  span: 'col-span-1'
},
{
  id: 3,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_10c328273-1772229988630.png",
  alt: 'Contemporary luxury home with floor-to-ceiling windows overlooking landscaped backyard at dusk',
  confidence: 88,
  price: '$1,125,000',
  address: '14 Crestwood Circle',
  city: 'Seattle, WA 98101',
  beds: 5,
  baths: 4,
  sqft: '3,680',
  tags: ['Cap Rate 6.2%', 'Emerging ZIP'],
  priceChange: '+5.8% / yr',
  positive: true,
  span: 'col-span-1'
},
{
  id: 4,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_139fe6888-1772063401758.png",
  alt: 'Mid-century modern ranch home with desert landscaping and mountain views',
  confidence: 85,
  price: '$389,900',
  address: '7721 Sonoran Pass',
  city: 'Phoenix, AZ 85001',
  beds: 3,
  baths: 2,
  sqft: '1,640',
  tags: ['Short Commute', 'Value Pick'],
  priceChange: '+1.9% / yr',
  positive: true,
  span: 'col-span-1'
},
{
  id: 5,
  image: "https://images.unsplash.com/photo-1666601248988-cd17421bbb29",
  alt: 'Victorian rowhouse with bay windows and ornate trim on tree-lined urban street',
  confidence: 82,
  price: '$875,000',
  address: '318 Ashbury Heights',
  city: 'San Francisco, CA 94117',
  beds: 4,
  baths: 3,
  sqft: '2,100',
  tags: ['Walkable', 'Historic Dist.'],
  priceChange: '+0.7% / yr',
  positive: true,
  span: 'col-span-1'
},
{
  id: 6,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c5cbbb6d-1772229988042.png",
  alt: 'New construction home with stone accent wall and two-car garage in planned community',
  confidence: 79,
  price: '$524,000',
  address: '1092 Northgate Drive',
  city: 'Nashville, TN 37201',
  beds: 4,
  baths: 3,
  sqft: '2,560',
  tags: ['New Build', 'Yard'],
  priceChange: '+4.2% / yr',
  positive: true,
  span: 'col-span-2'
}];


function PropertyCard({ property, delay }: {property: Property;delay: number;}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('card-visible'), delay);
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={`card-hidden card-beacon rounded-2xl overflow-hidden ${property.span || ''}`}
      style={{ minHeight: 280 }}>
      
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <AppImage
          src={property.image}
          alt={property.alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105" />
        
        {/* Confidence badge */}
        <div className="absolute top-3 left-3 confidence-badge text-xs font-bold px-2.5 py-1 rounded-full tracking-wide">
          {property.confidence}% Match
        </div>
        {/* Price trajectory */}
        <div
          className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{
            background: 'rgba(9,9,11,0.7)',
            color: property.positive ? '#34D399' : '#F87171',
            backdropFilter: 'blur(8px)'
          }}>
          
          {property.priceChange}
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(9,9,11,0.8) 0%, transparent 60%)' }} />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-bold text-lg leading-tight" style={{ color: '#EEEEF0' }}>{property.price}</p>
              <p className="text-sm mt-0.5" style={{ color: '#9898A0' }}>{property.address}</p>
              <p className="text-xs" style={{ color: '#3A3A45' }}>{property.city}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs" style={{ color: '#9898A0' }}>
          <span className="flex items-center gap-1">
            <Icon name="HomeIcon" size={13} className="opacity-60" />
            {property.beds} bd
          </span>
          <span className="flex items-center gap-1">
            <Icon name="SparklesIcon" size={13} className="opacity-60" />
            {property.baths} ba
          </span>
          <span>{property.sqft} sqft</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {property.tags.map((tag) =>
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(139,92,246,0.1)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.2)' }}>
            
              {tag}
            </span>
          )}
        </div>
      </div>
    </div>);

}

export default function PropertyMatchGrid() {
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {el.classList.add('section-visible');obs.unobserve(el);}
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-24 px-6 md:px-10" id="matches">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div ref={headRef} className="section-hidden mb-12 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-px" style={{ background: '#8B5CF6' }} />
            <span className="text-xs font-semibold tracking-[0.3em] uppercase" style={{ color: '#8B5CF6' }}>
              Engine Output — Live Sample
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight" style={{ color: '#EEEEF0' }}>
            The engine already found<br />
            <span className="text-gradient-violet">six homes worth your attention.</span>
          </h2>
          <p className="text-base max-w-xl" style={{ color: '#9898A0' }}>
            These are real listings matched against a composite buyer profile: 32-year-old, $650K budget, hybrid commute, school district matters. Confidence scores reflect how tightly each property fits the full signal set.
          </p>
        </div>

        {/* Bento grid — varied spans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((p, i) =>
          <div
            key={p.id}
            className={`group ${p.id === 1 || p.id === 6 ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
            
              <PropertyCard property={p} delay={i * 120} />
            </div>
          )}
        </div>

        {/* System note */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs" style={{ color: '#3A3A45' }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#8B5CF6', boxShadow: '0 0 6px #8B5CF6' }} />
          <span>4,218,334 listings indexed · Updated 6 minutes ago · 38 signal dimensions active</span>
        </div>
      </div>
    </section>);

}