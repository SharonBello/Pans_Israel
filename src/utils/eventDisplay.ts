import type { EventItem } from '@/types/event';

/** Today as 'YYYY-MM-DD' in the visitor's local time zone (event dates are local dates) */
export const localTodayIso = (now: Date = new Date()): string => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

/** Upcoming (today included) soonest-first, past newest-first */
export const splitEventsByDate = (
    events: EventItem[],
    today: string = localTodayIso(),
): { upcoming: EventItem[]; past: EventItem[] } => ({
    upcoming: events.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date)),
    past: events.filter((e) => e.date < today).sort((a, b) => b.date.localeCompare(a.date)),
});

export interface EventDateParts {
    day: number;        // 5
    month: string;      // 'נובמבר'
    year: number;       // 2026
    weekday: string;    // 'יום חמישי'
    long: string;       // 'יום חמישי, 5 בנובמבר 2026'
}

export const getEventDateParts = (date: string): EventDateParts => {
    const d = new Date(`${date}T00:00:00`);
    return {
        day: d.getDate(),
        month: d.toLocaleDateString('he-IL', { month: 'long' }),
        year: d.getFullYear(),
        weekday: d.toLocaleDateString('he-IL', { weekday: 'long' }),
        long: d.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    };
};

/**
 * '16:30–20:00' taken from the program when the event has one,
 * otherwise the event's own time ('20:30'), or '' when neither is set.
 */
export const getEventTimeLabel = (event: EventItem): string => {
    const program = event.program ?? [];
    if (program.length) {
        const start = program[0].startTime;
        const end = program[program.length - 1].endTime;
        return end && end !== start ? `${start}–${end}` : start;
    }
    return event.time ?? '';
};