'use client';

export interface WishlistProperty {
  id: string;
  title: string;
  city: string;
  area: string;
  price: number;
  bedrooms: number;
  sqft: number;
  matchScore: number;
  safetyScore: number;
  priceStatus: 'Overpriced' | 'Fair Value' | 'Undervalued';
  fakeConfidence: number;
  rating: number;
  image: string;
  alt: string;
  aiReason: string;
  type: string;
  savedAt: number;
}

const KEY = 'staysmart_wishlist';

export function getWishlist(): WishlistProperty[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function isInWishlist(id: string): boolean {
  return getWishlist().some(p => p.id === id);
}

export function addToWishlist(property: WishlistProperty): void {
  const list = getWishlist();
  if (!list.some(p => p.id === property.id)) {
    localStorage.setItem(KEY, JSON.stringify([{ ...property, savedAt: Date.now() }, ...list]));
    window.dispatchEvent(new Event('wishlist-updated'));
  }
}

export function removeFromWishlist(id: string): void {
  const list = getWishlist().filter(p => p.id !== id);
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event('wishlist-updated'));
}

export function toggleWishlist(property: WishlistProperty): boolean {
  if (isInWishlist(property.id)) {
    removeFromWishlist(property.id);
    return false;
  } else {
    addToWishlist(property);
    return true;
  }
}
