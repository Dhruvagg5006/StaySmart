'use client';

import React, { useEffect, useRef } from 'react';
// Local lightweight Icon fallback to avoid missing module import during build.
// This mirrors the minimal API used in this component: name, size, style.
const Icon: React.FC<{ name: string; size?: number; style?: React.CSSProperties }> = ({ size = 16, style }) => (
  <span
    aria-hidden
    style={{ display: 'inline-flex', width: size, height: size, alignItems: 'center', justifyContent: 'center', ...style }}
  >
    {/* simple placeholder SVG */}
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" fill="transparent" />
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  </span>
);

interface AppDownloadSectionProps {
  onFindMatch: () => void;
}

export default function AppDownloadSection({ onFindMatch }: AppDownloadSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
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
    <section className="py-24 px-6 md:px-10" id="download" style={{ background: 'rgba(30,19,50,0.3)' }}>
      <div className="max-w-4xl mx-auto">
        <div ref={ref} className="section-hidden text-center space-y-10">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-px" style={{ background: '#8B5CF6' }} />
            <span className="text-xs font-semibold tracking-[0.3em] uppercase" style={{ color: '#8B5CF6' }}>
              Get the App
            </span>
            <div className="w-6 h-px" style={{ background: '#8B5CF6' }} />
          </div>

          <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight" style={{ color: '#EEEEF0' }}>
            Your first three matches<br />
            <span className="text-gradient-violet">are already waiting.</span>
          </h2>

          <p className="text-base max-w-lg mx-auto" style={{ color: '#9898A0' }}>
            Beacon has been running on your profile since you landed on this page. Tap below to claim your results — no signup required to see your first match.
          </p>

          {/* Primary CTA */}
          <div>
            <button
              onClick={onFindMatch}
              className="btn-violet text-lg px-10 py-5 rounded-2xl font-bold inline-flex items-center gap-3"
            >
              <Icon name="MagnifyingGlassIcon" size={22} />
              Find My Match
            </button>
          </div>

          {/* App store row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            {/* iOS */}
            <a
              href="#"
              className="flex items-center gap-3 px-6 py-4 rounded-xl transition-all hover:border-violet-glow"
              style={{ background: 'rgba(238,238,240,0.04)', border: '1px solid rgba(238,238,240,0.1)' }}
            >
              <Icon name="DevicePhoneMobileIcon" size={24} style={{ color: '#EEEEF0' }} />
              <div className="text-left">
                <p className="text-xs" style={{ color: '#9898A0' }}>Download on the</p>
                <p className="font-semibold text-sm" style={{ color: '#EEEEF0' }}>App Store</p>
              </div>
            </a>

            {/* QR placeholder */}
            <div
              className="w-20 h-20 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)' }}
            >
              <div className="grid grid-cols-5 gap-0.5 p-1">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-sm"
                    style={{
                      background: [0,1,2,5,6,7,10,14,17,18,19,21,22,23,24].includes(i)
                        ? '#8B5CF6' : 'rgba(139,92,246,0.15)',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Android */}
            <a
              href="#"
              className="flex items-center gap-3 px-6 py-4 rounded-xl transition-all hover:border-violet-glow"
              style={{ background: 'rgba(238,238,240,0.04)', border: '1px solid rgba(238,238,240,0.1)' }}
            >
              <Icon name="DevicePhoneMobileIcon" size={24} style={{ color: '#EEEEF0' }} />
              <div className="text-left">
                <p className="text-xs" style={{ color: '#9898A0' }}>Get it on</p>
                <p className="font-semibold text-sm" style={{ color: '#EEEEF0' }}>Google Play</p>
              </div>
            </a>
          </div>

          <p className="text-xs tracking-widest uppercase" style={{ color: '#3A3A45' }}>
            Free · No credit card · iOS 16+ · Android 12+
          </p>
        </div>
      </div>
    </section>
  );
}