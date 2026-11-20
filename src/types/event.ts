import type { Timestamp } from 'firebase/firestore';

export type EventFormat = 'online' | 'in-person' | 'hybrid';

/** Lecturer / panelist in an event program */
export interface EventSpeaker {
    id: string;
    name: string;               // 'ד״ר יובל שפריר'
    role: string;               // 'נוירולוגיית ילדים, ארצות הברית'
    bio: string;                // paragraphs separated by a blank line
    imageUrl: string;           // optional headshot (Cloudinary / external URL), '' if none
}

/** One slot in an event program (agenda) */
export interface EventSession {
    id: string;
    startTime: string;          // 'HH:mm'
    endTime: string;            // 'HH:mm', '' if open-ended
    title: string;
    subtitle: string;           // e.g. 'עמותת PANDAS ישראל', '' if none
    speakers: EventSpeaker[];   // [] for registration, breaks, etc.
}

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
    imageUrl?: string;          // poster / invite (Cloudinary or external URL)
    imageAlt?: string;
    accent: string;             // hex colour for stripes, date tiles and buttons
    program?: EventSession[];   // optional — the program section shows only when non-empty
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
    program: [],
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

/** DOM id of an event's card on /activities — used for #anchor links from the home page */
export const eventAnchorId = (id: string): string => `event-${id}`;