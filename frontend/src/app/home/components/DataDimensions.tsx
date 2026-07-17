'use client';

import React, { useEffect, useRef } from 'react';
import Icon, { type IconName } from '@/components/ui/AppIcon';

interface Dimension {
  id: number;
  icon: IconName;
  name: string;
  description: string;
  backTitle: string;
  backValue: string;
  backDetail: string;
  weight: number;
}

const dimensions: Dimension[] = [
  {
    id: 1,
    icon: 'ClockIcon',
    name: 'Commute Time',
    description: 'Door-to-door transit modeling across 6 transport modes',
    backTitle: 'Algorithm Output',
    backValue: '18 min avg',
    backDetail: 'Analyzed 847 routes from this address to your stated work ZIP. Peak-hour variance: ±4 min. Confidence: 96%.',
    weight: 94,
  },
  {
    id: 2,
    icon: 'AcademicCapIcon',
    name: 'School Ratings',
    description: 'District performance, test scores, and parent sentiment signals',
    backTitle: 'Algorithm Output',
    backValue: '8.7 / 10',
    backDetail: 'Composite from GreatSchools, state test data, and 2,340 parent reviews. District trending +0.4 pts over 3 years.',
    weight: 87,
  },
  {
    id: 3,
    icon: 'ArrowTrendingUpIcon',
    name: 'Price Trajectory',
    description: 'ML-forecast of 12, 24, and 60-month price movement',
    backTitle: 'Algorithm Output',
    backValue: '+3.8% / yr',
    backDetail: 'Based on 14-year sales history, permit filings, and migration inflow. ZIP code outperforms metro median by 1.2%.',
    weight: 91,
  },
  {
    id: 4,
    icon: 'SpeakerXMarkIcon',
    name: 'Noise Levels',
    description: 'Acoustic mapping from traffic, flight paths, and commercial zones',
    backTitle: 'Algorithm Output',
    backValue: '38 dB avg',
    backDetail: 'Library-quiet threshold is 40 dB. This block averages 38 dB at 10pm. Nearest highway: 1.4 miles. Flight path: none.',
    weight: 78,
  },
  {
    id: 5,
    icon: 'MapPinIcon',
    name: 'Walkability',
    description: 'Pedestrian access to groceries, parks, healthcare, and transit',
    backTitle: 'Algorithm Output',
    backValue: 'Walk Score 82',
    backDetail: 'Whole Foods: 0.3mi. Nearest park: 0.1mi. Urgent care: 0.8mi. Bus line: 200ft. Bike lane: direct access.',
    weight: 83,
  },
  {
    id: 6,
    icon: 'ShieldCheckIcon',
    name: 'Safety Index',
    description: 'Crime rate normalization against city and national baselines',
    backTitle: 'Algorithm Output',
    backValue: '91st Percentile',
    backDetail: 'Property crime 62% below city average. Violent crime 78% below metro. Trend: -4.1% YoY for 3 consecutive years.',
    weight: 89,
  },
  {
    id: 7,
    icon: 'SunIcon',
    name: 'Green Space',
    description: 'Park access, tree canopy coverage, and air quality index',
    backTitle: 'Algorithm Output',
    backValue: '34% canopy',
    backDetail: 'Above 80th percentile nationally. 3 parks within 0.5mi. AQI annual average: 28 (Good). Urban heat island: low.',
    weight: 72,
  },
  {
    id: 8,
    icon: 'CurrencyDollarIcon',
    name: 'Mortgage Signal',
    description: 'Real-time rate feeds correlated to your credit profile range',
    backTitle: 'Algorithm Output',
    backValue: '6.42% est.',
    backDetail: '30-yr fixed for 740+ FICO on this price point. Monthly: $3,240. DTI projection: 28% (excellent). Lock window: now.',
    weight: 95,
  },
];

function DimensionCard({ dim, delay }: { dim: Dimension; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
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
    <div ref={ref} className="card-hidden flip-card h-52">
      <div className="flip-card-inner">
        {/* Front */}
        <div
          className="flip-front card-beacon rounded-2xl p-5 flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)' }}
            >
              <Icon name={dim.icon} size={20} className="text-violet" />
            </div>
            <span className="text-xs font-semibold" style={{ color: '#8B5CF6' }}>
              {dim.weight}% weight
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-base" style={{ color: '#EEEEF0' }}>{dim.name}</h3>
            <p className="text-xs leading-relaxed" style={{ color: '#9898A0' }}>{dim.description}</p>
          </div>
          <p className="text-xs tracking-widest uppercase" style={{ color: '#3A3A45' }}>Hover to see output →</p>
        </div>

        {/* Back */}
        <div
          className="flip-back rounded-2xl p-5 flex flex-col justify-between"
          style={{ background: 'rgba(30,19,50,0.95)', border: '1px solid rgba(139,92,246,0.4)' }}
        >
          <div>
            <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#8B5CF6' }}>{dim.backTitle}</p>
            <p className="font-display text-3xl font-bold" style={{ color: '#EEEEF0' }}>{dim.backValue}</p>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: '#9898A0' }}>{dim.backDetail}</p>
          <div className="w-full h-px" style={{ background: 'linear-gradient(to right, #8B5CF6, transparent)' }} />
        </div>
      </div>
    </div>
  );
}

export default function DataDimensions() {
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { el.classList.add('section-visible'); obs.unobserve(el); }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-24 px-6 md:px-10" style={{ background: 'rgba(30,19,50,0.2)' }}>
      <div className="max-w-6xl mx-auto">
        <div ref={headRef} className="section-hidden mb-12 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-px" style={{ background: '#8B5CF6' }} />
            <span className="text-xs font-semibold tracking-[0.3em] uppercase" style={{ color: '#8B5CF6' }}>
              Signal Architecture
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: '#EEEEF0' }}>
            38 signals. One verdict.
          </h2>
          <p className="text-base max-w-xl" style={{ color: '#9898A0' }}>
            Most search engines filter by bedrooms and price. Beacon weighs 38 dimensions simultaneously. Hover each card to see what the algorithm actually computes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dimensions.map((dim, i) => (
            <DimensionCard key={dim.id} dim={dim} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}