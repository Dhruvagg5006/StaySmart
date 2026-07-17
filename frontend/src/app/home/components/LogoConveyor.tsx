import React from 'react';

const sources = [
  { name: 'MLS Network', abbr: 'MLS' },
  { name: 'Zillow API', abbr: 'ZILLOW' },
  { name: 'Census Bureau', abbr: 'CENSUS' },
  { name: 'Walk Score', abbr: 'WALKSCORE' },
  { name: 'Redfin Data', abbr: 'REDFIN' },
  { name: 'Mortgage Rates', abbr: 'RATES' },
  { name: 'School Ratings', abbr: 'NICHE' },
  { name: 'Crime Index', abbr: 'CRIMEMAPPING' },
  { name: 'Noise Levels', abbr: 'SOUNDPRINT' },
  { name: 'Transit Score', abbr: 'TRANSIT' },
];

function LogoItem({ item }: { item: typeof sources[0] }) {
  return (
    <div className="flex items-center gap-2 px-6 flex-shrink-0">
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#8B5CF6' }} />
      <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#9898A0' }}>
        {item.abbr}
      </span>
    </div>
  );
}

export default function LogoConveyor() {
  const doubled = [...sources, ...sources];
  return (
    <div className="w-full overflow-hidden py-4" style={{ borderTop: '1px solid rgba(238,238,240,0.06)', borderBottom: '1px solid rgba(238,238,240,0.06)' }}>
      <div className="conveyor-track">
        {doubled.map((item, i) => (
          <LogoItem key={i} item={item} />
        ))}
      </div>
    </div>
  );
}