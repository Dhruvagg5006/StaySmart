'use client';

export interface NotificationMatch {
  filterId: string;
  filterName: string;
  newCount: number;
  propertyIds: string[];
  seenAt: number | null;
}

const STORAGE_KEY = 'staysmart_notifications';
const FRESH_PROPERTY_KEY = 'staysmart_fresh_properties';

export function getNotifications(): NotificationMatch[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    // Seed with mock notifications
    const defaults: NotificationMatch[] = [
      { filterId: 'default-1', filterName: 'Remote Work in Bangalore', newCount: 3, propertyIds: ['2', '5', '7'], seenAt: null },
      { filterId: 'default-2', filterName: 'Budget Studio Gurugram', newCount: 1, propertyIds: ['1'], seenAt: null },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  } catch {
    return [];
  }
}

export function getTotalUnreadCount(): number {
  return getNotifications().filter(n => n.seenAt === null).reduce((sum, n) => sum + n.newCount, 0);
}

export function markAllRead(): void {
  if (typeof window === 'undefined') return;
  const notifications = getNotifications().map(n => ({ ...n, seenAt: Date.now() }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  window.dispatchEvent(new Event('notifications-updated'));
}

export function getFreshPropertyIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FRESH_PROPERTY_KEY);
    if (raw) return JSON.parse(raw);
    // Seed fresh properties
    const fresh = ['1', '2', '5'];
    localStorage.setItem(FRESH_PROPERTY_KEY, JSON.stringify(fresh));
    return fresh;
  } catch {
    return [];
  }
}

export function dismissFreshProperty(id: string): void {
  if (typeof window === 'undefined') return;
  const fresh = getFreshPropertyIds().filter(pid => pid !== id);
  localStorage.setItem(FRESH_PROPERTY_KEY, JSON.stringify(fresh));
  window.dispatchEvent(new Event('fresh-properties-updated'));
}
