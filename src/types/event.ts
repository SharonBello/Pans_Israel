import type { Timestamp } from 'firebase/firestore';

export type EventFormat = 'online' | 'in-person' | 'hybrid';

/** Stored in Firestore `events` collection */
export interface EventItem {
    id: string;
    title: string;
    subtitle: string;
    badge: string;              // e.g. 'בקרוב', 'השבוע', 'וובינר חינם'
    date: string;               // ISO date 'YYYY-MM-DD'
    time?: string;              // 'HH:mm' (optional)
    format: EventFormat;
    location: string;           // 'זום (מקוון)' / 'המרכז הרפואי מאיר, כפר סבא'
    description: string;
    registrationUrl?: string;   // empty/undefined until registration opens
    registrationLabel?: string; // default 'להרשמה'
    imageUrl?: string;          // poster (Storage download URL or external)
    imageAlt?: string;
    accent: string;             // hex colour for the home-page row stripe
    published: boolean;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

/** What the admin form edits (no id / timestamps) */
export type EventFormData = Omit<EventItem, 'id' | 'createdAt' | 'updatedAt'>;

export const EMPTY_EVENT_FORM: EventFormData = {
    title: '',
    subtitle: '',
    badge: 'בקרוב',
    date: new Date().toISOString().split('T')[0],
    time: '',
    format: 'online',
    location: '',
    description: '',
    registrationUrl: '',
    registrationLabel: 'להרשמה',
    imageUrl: '',
    imageAlt: '',
    accent: '#4a90d9',
    published: false,
};

export const FORMAT_LABELS: Record<EventFormat, string> = {
    online: 'מקוון',
    'in-person': 'פרונטלי',
    hybrid: 'היברידי',
};

export const ACCENT_PRESETS = ['#4a90d9', '#6d8c84', '#8b6fb0', '#e67e22', '#c0392b', '#023373'];

/** 'YYYY-MM-DD' (+ 'HH:mm') → '7 בספטמבר 2026 · 20:30' */
export const formatEventDateLabel = (date: string, time?: string): string => {
    const d = new Date(`${date}T00:00:00`);
    const label = d.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
    return time ? `${label} · ${time}` : label;
};