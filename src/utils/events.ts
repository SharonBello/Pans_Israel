import { FEATURED_EVENTS, type FeaturedEvent } from '@/data/eventsData';

/** Events whose date hasn't passed yet, soonest first. */
export const getUpcomingEvents = (
    events: FeaturedEvent[] = FEATURED_EVENTS,
    now: Date = new Date(),
): FeaturedEvent[] => {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return events
        .filter((e) => new Date(e.date) >= today)
        .sort((a, b) => a.date.localeCompare(b.date));
};