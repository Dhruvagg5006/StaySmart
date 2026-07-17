'use client';

import React, { useEffect, useRef, useState } from 'react';
import AppImage from '@/components/ui/AppImage';

interface Testimonial {
  id: number;
  avatar: string;
  avatarAlt: string;
  name: string;
  role: string;
  searchQuery: string;
  matchResult: string;
  matchCity: string;
  matchScore: number;
  quote: string;
}

const testimonials: Testimonial[] = [
{
  id: 1,
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_103b528db-1763293982935.png",
  avatarAlt: 'Young woman with brown hair smiling in professional headshot against neutral background',
  name: 'Priya Nambiar',
  role: 'Software Engineer, relocated from Bangalore',
  searchQuery: '"Seattle, $700K, walkable, good schools, quiet"',
  matchResult: '14 Crestwood Circle, Seattle',
  matchCity: 'WA 98101',
  matchScore: 94,
  quote: 'I had 3 weeks to choose a city and a house. Beacon gave me one address. It was right.'
},
{
  id: 2,
  avatar: "https://images.unsplash.com/photo-1715005881129-266ccdd75e43",
  avatarAlt: 'Young Black man with short hair in casual shirt against bright background',
  name: 'Marcus Webb',
  role: 'First-time buyer, Austin TX',
  searchQuery: '"Austin, under $680K, yard, short commute to Domain"',
  matchResult: '2847 Meridian Way, Austin',
  matchCity: 'TX 78701',
  matchScore: 97,
  quote: 'I was on Zillow every night for 4 months. Beacon found it in 11 seconds. I closed in 22 days.'
},
{
  id: 3,
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1fd83305f-1763291739924.png",
  avatarAlt: 'Middle-aged Asian man in business casual attire with confident expression',
  name: 'Derek Liang',
  role: 'Real estate investor, 14-unit portfolio',
  searchQuery: '"Emerging ZIPs, cap rate >6%, Nashville or Phoenix"',
  matchResult: '1092 Northgate Drive, Nashville',
  matchCity: 'TN 37201',
  matchScore: 88,
  quote: 'The cap-rate arbitrage signal is unlike anything I\'ve seen. Found a ZIP before it hit the mainstream feeds.'
},
{
  id: 4,
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1282e6542-1763299241341.png",
  avatarAlt: 'Hispanic woman with dark hair in professional setting looking directly at camera',
  name: 'Sofia Reyes',
  role: 'Product Manager, Denver CO',
  searchQuery: '"Denver, $430K, transit access, no flight path noise"',
  matchResult: '509 Lakeview Terrace, Denver',
  matchCity: 'CO 80203',
  matchScore: 91,
  quote: 'The noise-level data is what got me. My last apartment was under a flight path. Beacon flagged it before I even asked.'
}];


const CIRCUMFERENCE = 2 * Math.PI * 36; // r=36

function MatchRing({ score, animate }: {score: number;animate: boolean;}) {
  const offset = CIRCUMFERENCE - score / 100 * CIRCUMFERENCE;
  return (
    <div className="relative w-20 h-20 flex-shrink-0">
      <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
        {/* Track */}
        <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(238,238,240,0.06)" strokeWidth="4" />
        {/* Fill */}
        <circle
          cx="40" cy="40" r="36"
          fill="none"
          stroke="#8B5CF6"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={animate ? offset : CIRCUMFERENCE}
          style={{
            transition: animate ? 'stroke-dashoffset 1.8s cubic-bezier(0.22,1,0.36,1)' : 'none',
            filter: 'drop-shadow(0 0 6px rgba(139,92,246,0.6))'
          }} />
        
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-lg font-bold" style={{ color: '#EEEEF0' }}>{score}%</span>
        <span className="text-[9px] tracking-widest uppercase" style={{ color: '#8B5CF6' }}>match</span>
      </div>
    </div>);

}

function TestimonialCard({ t, delay }: {t: Testimonial;delay: number;}) {
  const ref = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add('card-visible');
            setAnimate(true);
          }, delay);
          obs.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className="card-hidden card-beacon rounded-2xl p-6 space-y-5">
      {/* Search query */}
      <div
        className="text-xs font-mono px-3 py-2 rounded-lg"
        style={{ background: 'rgba(139,92,246,0.08)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.15)' }}>
        
        Search: {t.searchQuery}
      </div>

      {/* Match result + ring */}
      <div className="flex items-center gap-4">
        <MatchRing score={t.matchScore} animate={animate} />
        <div>
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#8B5CF6' }}>Beacon matched</p>
          <p className="font-semibold text-sm" style={{ color: '#EEEEF0' }}>{t.matchResult}</p>
          <p className="text-xs" style={{ color: '#9898A0' }}>{t.matchCity}</p>
        </div>
      </div>

      {/* Quote */}
      <p className="text-sm leading-relaxed italic" style={{ color: '#9898A0' }}>
        &ldquo;{t.quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2" style={{ borderTop: '1px solid rgba(238,238,240,0.06)' }}>
        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
          <AppImage src={t.avatar} alt={t.avatarAlt} width={36} height={36} className="object-cover w-full h-full" />
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: '#EEEEF0' }}>{t.name}</p>
          <p className="text-xs" style={{ color: '#9898A0' }}>{t.role}</p>
        </div>
      </div>
    </div>);

}

export default function TestimonialsSection() {
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
    <section className="py-24 px-6 md:px-10" id="testimonials">
      <div className="max-w-6xl mx-auto">
        <div ref={headRef} className="section-hidden mb-12 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-px" style={{ background: '#8B5CF6' }} />
            <span className="text-xs font-semibold tracking-[0.3em] uppercase" style={{ color: '#8B5CF6' }}>
              Real Searches · Real Matches
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: '#EEEEF0' }}>
            The engine doesn&apos;t guess.<br />
            <span className="text-gradient-violet">It knows.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t, i) =>
          <TestimonialCard key={t.id} t={t} delay={i * 150} />
          )}
        </div>
      </div>
    </section>);

}