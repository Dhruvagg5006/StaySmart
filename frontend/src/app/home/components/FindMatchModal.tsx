'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FindMatchModalProps {
  open: boolean;
  onClose: () => void;
}

const chips = ['Yard', 'Walkable', 'Quiet', 'Short Commute', 'Top Schools', 'No HOA', 'Garage', 'Home Office'];
const budgetRanges = ['Under $400K', '$400K–$600K', '$600K–$800K', '$800K–$1.2M', '$1.2M+'];

export default function FindMatchModal({ open, onClose }: FindMatchModalProps) {
  const [step, setStep] = useState(1);
  const [city, setCity] = useState('');
  const [budget, setBudget] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  // Reset on close
  useEffect(() => {
    if (!open) { setStep(1); setCity(''); setBudget(''); setSelected([]); }
  }, [open]);

  const toggleChip = (chip: string) => {
    setSelected(prev => prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]);
  };

  return (
    <div
      className={`modal-overlay fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 ${open ? 'open' : ''}`}
      style={{ background: 'rgba(9,9,11,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="modal-panel w-full max-w-lg rounded-2xl overflow-hidden"
        style={{ background: '#0F0F12', border: '1px solid rgba(139,92,246,0.3)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid rgba(238,238,240,0.06)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(139,92,246,0.15)' }}
            >
              <Icon name="SignalIcon" size={16} className="text-violet" />
            </div>
            <span className="font-semibold text-sm" style={{ color: '#EEEEF0' }}>
              {step === 1 ? 'Tell Beacon what you need' : 'Get the app · Claim your matches'}
            </span>
          </div>
          <button onClick={onClose} style={{ color: '#9898A0' }} className="hover:text-phosphor transition-colors">
            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex px-6 pt-4 gap-2">
          {[1, 2].map(s => (
            <div
              key={s}
              className="h-1 flex-1 rounded-full transition-all duration-500"
              style={{ background: step >= s ? '#8B5CF6' : 'rgba(238,238,240,0.08)' }}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="px-6 pb-6 pt-5 space-y-5">
            {/* City */}
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#9898A0' }}>
                City or ZIP code
              </label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="e.g. Austin TX, 78701, Denver…"
                className="input-beacon w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#9898A0' }}>
                Budget range
              </label>
              <div className="flex flex-wrap gap-2">
                {budgetRanges.map(b => (
                  <button
                    key={b}
                    onClick={() => setBudget(b)}
                    className={`chip text-xs px-3 py-1.5 rounded-full ${budget === b ? 'active' : ''}`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Must-haves */}
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#9898A0' }}>
                Must-haves
              </label>
              <div className="flex flex-wrap gap-2">
                {chips.map(c => (
                  <button
                    key={c}
                    onClick={() => toggleChip(c)}
                    className={`chip text-xs px-3 py-1.5 rounded-full ${selected.includes(c) ? 'active' : ''}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!city}
              className="btn-violet w-full py-4 rounded-xl font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Run the Engine →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="px-6 pb-6 pt-5 space-y-6 text-center">
            {/* Pulse indicator */}
            <div className="flex items-center justify-center gap-3 py-4">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: '#8B5CF6', boxShadow: '0 0 0 8px rgba(139,92,246,0.12), 0 0 0 16px rgba(139,92,246,0.06)' }}
              />
              <p className="font-semibold text-base" style={{ color: '#EEEEF0' }}>
                Your 3 matches are ready.
              </p>
            </div>

            <p className="text-sm" style={{ color: '#9898A0' }}>
              Beacon analyzed <span style={{ color: '#EEEEF0' }}>4.2M listings</span> against your profile in {city}. Download the app to unlock your results.
            </p>

            {/* App buttons */}
            <div className="flex flex-col gap-3">
              <a
                href="#"
                className="flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-sm"
                style={{ background: '#8B5CF6', color: '#fff' }}
              >
                <Icon name="DevicePhoneMobileIcon" size={20} />
                Download for iOS
              </a>
              <a
                href="#"
                className="flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-sm"
                style={{ background: 'rgba(238,238,240,0.06)', color: '#EEEEF0', border: '1px solid rgba(238,238,240,0.1)' }}
              >
                <Icon name="DevicePhoneMobileIcon" size={20} />
                Download for Android
              </a>
            </div>

            {/* QR */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <div className="w-px h-8" style={{ background: 'rgba(238,238,240,0.06)' }} />
              <p className="text-xs" style={{ color: '#9898A0' }}>or scan QR code</p>
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
              >
                <div className="grid grid-cols-4 gap-0.5 p-1">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-sm"
                      style={{ background: [0,1,4,5,10,11,14,15,2,8,13].includes(i) ? '#8B5CF6' : 'rgba(139,92,246,0.12)' }}
                    />
                  ))}
                </div>
              </div>
              <div className="w-px h-8" style={{ background: 'rgba(238,238,240,0.06)' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}