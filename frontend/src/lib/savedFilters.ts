'use client';

export interface SavedFilter {
  id: string;
  name: string;
  city: string;
  budget: { min: number; max: number };
  amenities: string[];
  commuteMax: number; // minutes
  bedrooms: number;
  type: string;
  resultCount: number;
  lastRun: string; // ISO date string
  createdAt: string;
}

const STORAGE_KEY = 'staysmart_saved_filters';

export function getSavedFilters(): SavedFilter[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : getDefaultFilters();
  } catch {
    return getDefaultFilters();
  }
}

export function deleteSavedFilter(id: string): void {
  if (typeof window === 'undefined') return;
  const filters = getSavedFilters().filter(f => f.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  window.dispatchEvent(new Event('saved-filters-updated'));
}

export function saveFilter(filter: Omit<SavedFilter, 'id' | 'createdAt'>): SavedFilter {
  const newFilter: SavedFilter = {
    ...filter,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  const filters = getSavedFilters();
  filters.unshift(newFilter);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  window.dispatchEvent(new Event('saved-filters-updated'));
  return newFilter;
}

function getDefaultFilters(): SavedFilter[] {
  const defaults: SavedFilter[] = [
    {
      id: 'default-1',
      name: 'Remote Work in Bangalore',
      city: 'Bangalore',
      budget: { min: 15000, max: 30000 },
      amenities: ['WiFi', 'Gym', 'Security'],
      commuteMax: 20,
      bedrooms: 2,
      type: 'Apartment',
      resultCount: 14,
      lastRun: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'default-2',
      name: 'Budget Studio Gurugram',
      city: 'Gurugram',
      budget: { min: 10000, max: 22000 },
      amenities: ['WiFi', 'Parking'],
      commuteMax: 15,
      bedrooms: 1,
      type: 'Studio',
      resultCount: 8,
      lastRun: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'default-3',
      name: 'Pet-Friendly Mumbai Flat',
      city: 'Mumbai',
      budget: { min: 25000, max: 50000 },
      amenities: ['Pet Friendly', 'Pool', 'Security', 'Parking'],
      commuteMax: 30,
      bedrooms: 2,
      type: 'Apartment',
      resultCount: 5,
      lastRun: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'default-4',
      name: 'Luxury Villa Hyderabad',
      city: 'Hyderabad',
      budget: { min: 40000, max: 80000 },
      amenities: ['Pool', 'Gym', 'Security', 'Parking', 'WiFi'],
      commuteMax: 25,
      bedrooms: 3,
      type: 'Villa',
      resultCount: 3,
      lastRun: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  return defaults;
}
