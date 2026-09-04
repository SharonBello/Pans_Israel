export type FeaturedEvent = {
    id: string;
    badge: string;
    title: string;
    subtitle: string;
    date: string;      // ISO date, used for <time dateTime> and for hiding past events
    dateLabel: string; // human-readable Hebrew date (+ time if relevant)
    location: string;
    description: string;
    registrationUrl?: string; // undefined until registration opens
    registrationLabel?: string;
    image?: string;    // used by the card layout on /activities
    imageAlt?: string;
    accent?: string;   // edge-stripe / button colour for the home-page row
};

export const FEATURED_EVENTS: FeaturedEvent[] = [
    {
        id: 'pandas-webinar-2026-09',
        badge: 'השבוע',
        title: 'מה קרה לילד שלי? — וובינר בנושא תסמונת PANDAS',
        subtitle: 'להורים ולאנשי מקצוע · בזום',
        date: '2026-09-07',
        dateLabel: '7 בספטמבר 2026 · 20:30',
        location: 'זום (מקוון)',
        description:
            '1 מתוך 200 ילדים יפתח תסמונת פאנדס. המרצים: ד"ר רייצ\'ל רוט – מתמחה במצבים נוירופסיכיאטריים אוטואימוניים בילדים; ד"ר אור שמש – חוקר באוניברסיטה העברית; ד"ר יפעת גביש – פסיכותרפיסטית CBT, על הזווית ההורית.',
        registrationUrl: 'https://panspandas.vercel.app/register/g80m6q',
        registrationLabel: 'להרשמה לוובינר',
        image: '/images/events/webinar.jpeg',
        imageAlt: 'וובינר מה קרה לילד שלי — תסמונת PANDAS',
        accent: '#4a90d9',
    },
    {
        id: 'meir-conference-2026',
        badge: 'בקרוב',
        title: 'הכנס הרפואי הראשון בישראל לנוירואימונולוגיה ו‑PANS/PANDAS',
        subtitle: 'כנס מקצועי לרופאים ואנשי מקצוע',
        date: '2026-11-06',
        dateLabel: '6 בנובמבר 2026',
        location: 'המרכז הרפואי מאיר, כפר סבא',
        description:
            'לראשונה בישראל — כנס רפואי המוקדש לתסמונות PANS/PANDAS ולנוירואימונולוגיה בילדים. פרטים נוספים והרשמה יפורסמו בקרוב.',
        registrationUrl: undefined,
        registrationLabel: 'לפרטים והרשמה',
        image: '/images/events/conference1.png',
        imageAlt: 'כנס נוירואימונולוגיה ו‑PANS/PANDAS במרכז הרפואי מאיר',
        accent: '#6d8c84',
    },
];