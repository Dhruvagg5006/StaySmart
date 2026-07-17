'use client';

import React, { useState } from 'react';
import LogoConveyor from './LogoConveyor';

interface HeroSectionProps {
  onFindMatch: () => void;
}

export default function HeroSection({ onFindMatch }: HeroSectionProps) {
  const [query, setQuery] = useState('');

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden">
      {/* Atmospheric depth — background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Blob 1 — far, slow */}
        <div
          className="blob-1 absolute rounded-full"
          style={{
            width: 700,
            height: 700,
            top: '5%',
            left: '-10%',
            background: 'radial-gradient(circle, rgba(30,19,50,0.8) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Blob 2 — mid */}
        <div
          className="blob-2 absolute rounded-full"
          style={{
            width: 500,
            height: 500,
            top: '40%',
            right: '-5%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Blob 3 — accent pulse */}
        <div
          className="blob-3 absolute rounded-full"
          style={{
            width: 300,
            height: 300,
            bottom: '15%',
            left: '30%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        {/* Grid lines — subtle */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(238,238,240,1) 1px, transparent 1px), linear-gradient(90deg, rgba(238,238,240,1) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center space-y-12">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-px" style={{ background: '#8B5CF6' }} />
          <span className="text-xs font-semibold tracking-[0.3em] uppercase" style={{ color: '#8B5CF6' }}>
            ML-Powered Real Estate Intelligence
          </span>
          <div className="w-8 h-px" style={{ background: '#8B5CF6' }} />
        </div>

        {/* Headline */}
        <div className="space-y-4">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight" style={{ color: '#EEEEF0' }}>
            Your next home
          </h1>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight">
            <span className="text-gradient-violet">already exists</span>
          </h1>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight" style={{ color: '#EEEEF0' }}>
            in the data.
          </h1>
        </div>

        <p className="text-lg md:text-xl max-w-xl mx-auto leading-relaxed" style={{ color: '#9898A0' }}>
          Beacon&apos;s engine digests 4.2M listings, live mortgage rates, and 38 neighborhood signals to surface the three properties you&apos;d actually choose — before you start searching.
        </p>

        {/* Input + CTA */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Enter a city or ZIP code"
              className="input-beacon w-full px-5 py-4 rounded-xl text-base"
            />
            {/* Blinking cursor visual when empty */}
            {!query && (
              <span
                className="cursor-blink absolute right-5 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                style={{ background: '#8B5CF6' }}
              />
            )}
          </div>
          <button
            onClick={onFindMatch}
            className="btn-violet px-7 py-4 rounded-xl text-base font-semibold whitespace-nowrap"
          >
            Find My Match
          </button>
        </div>

        {/* Sub-label */}
        <p className="text-xs tracking-widest uppercase" style={{ color: '#3A3A45' }}>
          No account required · First 3 matches free · iOS & Android
        </p>
      </div>

      {/* Logo conveyor — below hero content */}
      <div className="relative z-10 w-full mt-16">
        <p className="text-center text-xs tracking-[0.3em] uppercase mb-4" style={{ color: '#3A3A45' }}>
          Data sources powering the engine
        </p>
        <LogoConveyor />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-xs tracking-widest uppercase" style={{ color: '#3A3A45' }}>Scroll</span>
        <div className="w-px h-8 overflow-hidden" style={{ background: 'rgba(238,238,240,0.08)' }}>
          <div
            className="w-full h-1/2"
            style={{
              background: 'linear-gradient(to bottom, #8B5CF6, transparent)',
              animation: 'blob-drift-3 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </section>
  );
}