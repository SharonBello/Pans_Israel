import type { EventItem } from '@/types/event';

/**
 * "Add to calendar" helpers: a Google Calendar link and an .ics file (Apple, Outlook, others).
 * Event dates/times are entered as Israel wall-clock time and converted to UTC here,
 * so the event lands at the right hour in any calendar, in any time zone.
 */

const EVENT_TIME_ZONE = 'Asia/Jerusalem';
/** Used when an event has a start time but no end time */
const DEFAULT_DURATION_MIN = 90;
/** Google's link carries the description in the URL, so keep it short */
const GOOGLE_DETAILS_MAX = 600;

type CalendarTimes =
    | { allDay: false; start: Date; end: Date }
    | { allDay: true; startDate: string; endDate: string }; // 'YYYYMMDD', end is exclusive

// ── time zone ────────────────────────────────────────────────────────────────

/** How far EVENT_TIME_ZONE is ahead of UTC (ms) at the given instant — handles summer time */
const zoneOffsetMs = (instant: Date): number => {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: EVENT_TIME_ZONE,
        hourCycle: 'h23',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).formatToParts(instant);
    const get = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((p) => p.type === type)?.value);
    const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
    return asUtc - instant.getTime();
};

/** '2026-11-05' + '16:30' in Israel → the matching UTC instant */
const israelTimeToUtc = (date: string, time: string): Date => {
    const [y, m, d] = date.split('-').map(Number);
    const [hh, mm] = time.split(':').map(Number);
    const wallClockAsUtc = Date.UTC(y, m - 1, d, hh, mm);
    // two passes, so a time right next to a summer-time switch still resolves correctly
    const firstGuess = wallClockAsUtc - zoneOffsetMs(new Date(wallClockAsUtc));
    return new Date(wallClockAsUtc - zoneOffsetMs(new Date(firstGuess)));
};

/** Date → '20261105T143000Z' */
const toUtcStamp = (d: Date): string => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

/** '2026-11-05' → '20261105', optionally shifted by whole days */
const toDateStamp = (date: string, addDays = 0): string => {
    const [y, m, d] = date.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d + addDays)).toISOString().slice(0, 10).replace(/-/g, '');
};

// ── event times ──────────────────────────────────────────────────────────────

/** Start/end from the program when there is one, else the event's time; no time → all-day */
export const getCalendarTimes = (event: EventItem): CalendarTimes => {
    const program = event.program ?? [];
    const startTime = program[0]?.startTime || event.time || '';
    const endTime = program[program.length - 1]?.endTime || '';

    if (!startTime) {
        return { allDay: true, startDate: toDateStamp(event.date), endDate: toDateStamp(event.date, 1) };
    }

    const start = israelTimeToUtc(event.date, startTime);
    let end = endTime
        ? israelTimeToUtc(event.date, endTime)
        : new Date(start.getTime() + DEFAULT_DURATION_MIN * 60_000);
    if (end <= start) end = new Date(end.getTime() + 24 * 60 * 60_000); // ends after midnight
    return { allDay: false, start, end };
};

const detailsText = (event: EventItem, pageUrl: string, maxDescription?: number): string => {
    let description = event.subtitle ? `${event.subtitle}\n\n${event.description}` : event.description;
    if (maxDescription && description.length > maxDescription) {
        description = `${description.slice(0, maxDescription).trimEnd()}…`;
    }
    return `${description}\n\nפרטים, תוכנית והרשמה: ${pageUrl}`.trim();
};

// ── Google Calendar ──────────────────────────────────────────────────────────

export const googleCalendarUrl = (event: EventItem, pageUrl: string): string => {
    const times = getCalendarTimes(event);
    const dates = times.allDay
        ? `${times.startDate}/${times.endDate}`
        : `${toUtcStamp(times.start)}/${toUtcStamp(times.end)}`;
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: event.title,
        details: detailsText(event, pageUrl, GOOGLE_DETAILS_MAX),
        location: event.location,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}&dates=${dates}`;
};

// ── .ics file (RFC 5545) ─────────────────────────────────────────────────────

/** Escape text for an .ics property value */
const icsText = (value: string): string =>
    value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

/** .ics lines may be at most 75 bytes; longer ones continue on the next line after a space */
const foldLine = (line: string): string => {
    const encoder = new TextEncoder();
    const chunks: string[] = [];
    let current = '';
    let bytes = 0;
    for (const ch of line) {
        const size = encoder.encode(ch).length;
        if (bytes + size > 75) {
            chunks.push(current);
            current = ` ${ch}`;
            bytes = 1 + size;
        } else {
            current += ch;
            bytes += size;
        }
    }
    chunks.push(current);
    return chunks.join('\r\n');
};

export const buildIcs = (event: EventItem, pageUrl: string, now: Date = new Date()): string => {
    const times = getCalendarTimes(event);
    const when = times.allDay
        ? [`DTSTART;VALUE=DATE:${times.startDate}`, `DTEND;VALUE=DATE:${times.endDate}`]
        : [`DTSTART:${toUtcStamp(times.start)}`, `DTEND:${toUtcStamp(times.end)}`];

    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//PANS PANDAS Israel//Events//HE',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:${event.id}@pans-pandas-israel`,
        `DTSTAMP:${toUtcStamp(now)}`,
        ...when,
        `SUMMARY:${icsText(event.title)}`,
        `DESCRIPTION:${icsText(detailsText(event, pageUrl))}`,
        `LOCATION:${icsText(event.location)}`,
        `URL:${pageUrl}`,
        'END:VEVENT',
        'END:VCALENDAR',
    ];
    return `${lines.map(foldLine).join('\r\n')}\r\n`;
};