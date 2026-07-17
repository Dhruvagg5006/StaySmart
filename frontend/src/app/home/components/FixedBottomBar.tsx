'use client';

import React, { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FixedBottomBarProps {
  onFindMatch: () => void;
}

export default function FixedBottomBar({ onFindMatch }: FixedBottomBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 1.5);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`bottom-bar fixed bottom-0 left-0 right-0 z-40 ${visible ? 'visible' : ''}`}
      style={{ background: 'rgba(9,9,11,0.92)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(139,92,246,0.2)' }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: '#8B5CF6', boxShadow: '0 0 0 4px rgba(139,92,246,0.15)' }}
          />
          <p className="text-sm font-medium hidden sm:block" style={{ color: '#9898A0' }}>
            Beacon is analyzing <span style={{ color: '#EEEEF0' }}>4.2M listings</span> right now.
          </p>
          <p className="text-sm font-medium sm:hidden" style={{ color: '#9898A0' }}>
            Your matches are ready.
          </p>
        </div>
        <button
          onClick={onFindMatch}
          className="btn-violet px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 flex-shrink-0"
        >
          <Icon name="MagnifyingGlassIcon" size={16} />
          Find My Match
        </button>
      </div>
    </div>
  );
}