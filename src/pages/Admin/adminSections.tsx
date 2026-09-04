import React from 'react';
import type { IconType } from 'react-icons';
import { FiCalendar, FiFileText, FiBarChart2, FiMessageSquare, FiBookOpen, FiUsers } from 'react-icons/fi';
import { MdNewspaper } from 'react-icons/md';
import EventsAdmin from '@/pages/Admin/EventsAdmin/EventsAdmin';
import TestimonialsAdmin from '@/pages/Admin/TestimonialsAdmin/TestimonialsAdmin';
import BlogAdmin from '@/pages/Admin/BlogAdmin/BlogAdmin';
import VolunteersAdmin from '@/pages/Admin/VolunteersAdmin/VolunteersAdmin';
import MediaArticlesAdmin from '@/pages/MediaArticlesAdmin/MediaArticlesAdmin';
import PdfAdminPage from '@/pages/PdfAdminPage/PdfAdminPage';
import { SOCAdminPage } from '@/features';

export type AdminTabId = 'events' | 'testimonials' | 'blog' | 'volunteers' | 'media' | 'pdf' | 'surveys';

export interface AdminSection {
    id: AdminTabId;
    label: string;
    icon: IconType;
    component: React.ComponentType;
}

export const ADMIN_SECTIONS: AdminSection[] = [
    { id: 'events', label: 'פעילויות ואירועים', icon: FiCalendar, component: EventsAdmin },
    { id: 'testimonials', label: 'אישור עדויות', icon: FiMessageSquare, component: TestimonialsAdmin },
    { id: 'blog', label: 'מאמרי קהילה', icon: FiBookOpen, component: BlogAdmin },
    { id: 'volunteers', label: 'אישור מתנדבים', icon: FiUsers, component: VolunteersAdmin },
    { id: 'media', label: 'פורסם בתקשורת', icon: MdNewspaper, component: MediaArticlesAdmin },
    { id: 'pdf', label: 'קבצי PDF', icon: FiFileText, component: PdfAdminPage },
    { id: 'surveys', label: 'סקר מצב הילדים', icon: FiBarChart2, component: SOCAdminPage },
];

export const DEFAULT_TAB: AdminTabId = 'events';