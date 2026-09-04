import React from 'react';
import type { IconType } from 'react-icons';
import { FiCalendar, FiFileText, FiBarChart2 } from 'react-icons/fi';
import { MdNewspaper } from 'react-icons/md';
import MediaArticlesAdmin from '@/pages/MediaArticlesAdmin/MediaArticlesAdmin';
import PdfAdminPage from '@/pages/PdfAdminPage/PdfAdminPage';
import { SOCAdminPage } from '@/features';
import EventsAdmin from '@/pages/Admin/EventsAdmin/EventsAdmin';

export type AdminTabId = 'events' | 'media' | 'pdf' | 'surveys';

export interface AdminSection {
    id: AdminTabId;
    label: string;
    icon: IconType;
    component: React.ComponentType;
}

export const ADMIN_SECTIONS: AdminSection[] = [
    { id: 'events', label: 'פעילויות ואירועים', icon: FiCalendar, component: EventsAdmin },
    { id: 'media', label: 'פורסם בתקשורת', icon: MdNewspaper, component: MediaArticlesAdmin },
    { id: 'pdf', label: 'קבצי PDF', icon: FiFileText, component: PdfAdminPage },
    { id: 'surveys', label: 'סקר מצב הילדים', icon: FiBarChart2, component: SOCAdminPage },
];

export const DEFAULT_TAB: AdminTabId = 'events';