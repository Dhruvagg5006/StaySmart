import React from 'react';
import AppLogo from '@/components/ui/AppLogo';

export default function Footer() {
  return (
    <footer className="border-t py-10 px-6 md:px-10" style={{ borderColor: 'rgba(238,238,240,0.06)' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <AppLogo text="Beacon" iconName="SignalIcon" size={22} className="text-phosphor-dim" />
        <nav className="flex items-center gap-6 text-sm" style={{ color: '#9898A0' }}>
          <a href="#" className="hover:text-phosphor transition-colors">How It Works</a>
          <span style={{ color: '#3A3A45' }}>·</span>
          <a href="#" className="hover:text-phosphor transition-colors">For Investors</a>
          <span style={{ color: '#3A3A45' }}>·</span>
          <a href="#" className="hover:text-phosphor transition-colors">Blog</a>
          <span style={{ color: '#3A3A45' }}>·</span>
          <a href="#" className="hover:text-phosphor transition-colors">Privacy</a>
          <span style={{ color: '#3A3A45' }}>·</span>
          <a href="#" className="hover:text-phosphor transition-colors">Terms</a>
        </nav>
        <p className="text-sm" style={{ color: '#9898A0' }}>© 2026 Beacon Technologies</p>
      </div>
    </footer>
  );
}