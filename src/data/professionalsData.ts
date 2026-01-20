import type { Professional, ProfessionalField, Location } from '../types/professionals';

export const MEDICAL_FIELDS: ProfessionalField[] = [
    { key: 'pediatric-neurologist', label: 'נוירולוג ילדים', category: 'medical' },
    { key: 'pediatric-psychiatrist', label: 'פסיכיאטר ילדים', category: 'medical' },
    { key: 'pediatric-immunologist', label: 'אימונולוג ילדים', category: 'medical' },
    { key: 'infectious-disease', label: 'מומחה למחלות זיהומיות', category: 'medical' },
    { key: 'pediatrician', label: 'רופא ילדים', category: 'medical' },
    { key: 'rheumatologist', label: 'ראומטולוג ילדים', category: 'medical' },
    { key: 'ent', label: 'רופא אף אוזן גרון', category: 'medical' },
];

export const HOLISTIC_FIELDS: ProfessionalField[] = [
    { key: 'naturopath', label: 'נטורופת/ית', category: 'holistic' },
    { key: 'homeopath', label: 'הומאופת/ית', category: 'holistic' },
    { key: 'functional-medicine', label: 'רפואה פונקציונלית', category: 'holistic' },
    { key: 'nutritionist', label: 'תזונאי/ת קלינית', category: 'holistic' },
    { key: 'acupuncture', label: 'דיקור סיני', category: 'holistic' },
    { key: 'chinese-medicine', label: 'רפואה סינית', category: 'holistic' },
    { key: 'reflexology', label: 'רפלקסולוגיה', category: 'holistic' },
    { key: 'herbalist', label: 'הרבליסט/צמחי מרפא', category: 'holistic' },
    { key: 'bach-flowers', label: 'פרחי באך', category: 'holistic' },
];

export const THERAPY_FIELDS: ProfessionalField[] = [
    { key: 'occupational-therapist', label: 'מרפא/ה בעיסוק', category: 'therapy' },
    { key: 'speech-therapist', label: 'קלינאי/ת תקשורת', category: 'therapy' },
    { key: 'psychologist', label: 'פסיכולוג/ית', category: 'therapy' },
    { key: 'cbt-therapist', label: 'מטפל/ת CBT', category: 'therapy' },
    { key: 'art-therapist', label: 'מטפל/ת באומנות', category: 'therapy' },
    { key: 'play-therapist', label: 'מטפל/ת במשחק', category: 'therapy' },
    { key: 'family-therapist', label: 'מטפל/ת משפחתי', category: 'therapy' },
    { key: 'sensory-integration', label: 'אינטגרציה סנסורית', category: 'therapy' },
];

export const ALL_FIELDS: ProfessionalField[] = [
    ...MEDICAL_FIELDS,
    ...HOLISTIC_FIELDS,
    ...THERAPY_FIELDS,
];

export const LOCATIONS: Location[] = [
    { key: 'tel-aviv', label: 'תל אביב', region: 'מרכז' },
    { key: 'bet-shemesh', label: 'בית שמש', region: 'ירושלים' },
    { key: 'hod-hasharon', label: 'הוד השרון', region: 'מרכז' },
    { key: 'ramat-hasharon', label: 'רמת השרון', region: 'מרכז' },
    { key: 'zur-yigal', label: 'צור יגאל', region: 'מרכז' },
    { key: 'jerusalem', label: 'ירושלים', region: 'ירושלים' },
    { key: 'haifa', label: 'חיפה', region: 'צפון' },
    { key: 'pardes-hana-karkur', label: 'פרדס-חנה כרכור', region: 'שרון' },
    { key: 'kiryat-tivon', label: 'קרית טבעון', region: 'צפון' },
    { key: 'megadim', label: 'מגדים', region: 'חיפה' },
    { key: 'beer-sheva', label: 'באר שבע', region: 'דרום' },
    { key: 'ramat-gan', label: 'רמת גן', region: 'מרכז' },
    { key: 'petah-tikva', label: 'פתח תקווה', region: 'מרכז' },
    { key: 'rishon-lezion', label: 'ראשון לציון', region: 'מרכז' },
    { key: 'netanya', label: 'נתניה', region: 'שרון' },
    { key: 'ashdod', label: 'אשדוד', region: 'דרום' },
    { key: 'herzliya', label: 'הרצליה', region: 'שרון' },
    { key: 'kfar-saba', label: 'כפר סבא', region: 'שרון' },
    { key: 'raanana', label: 'רעננה', region: 'שרון' },
    { key: 'modiin', label: 'מודיעין', region: 'מרכז' },
    { key: 'rehovot', label: 'רחובות', region: 'מרכז' },
    { key: 'nazareth', label: 'נצרת', region: 'צפון' },
    { key: 'yagur', label: 'יגור', region: 'חיפה' },
    { key: 'online', label: 'מקוון (אונליין)', region: 'כל הארץ' },
    { key: 'n/a', label: 'יישוב לא ברשימה', region: 'לא ידוע' },
];

export const getFieldsByCategory = (category: 'medical' | 'holistic' | 'therapy'): ProfessionalField[] => {
    switch (category) {
        case 'medical':
            return MEDICAL_FIELDS;
        case 'holistic':
            return HOLISTIC_FIELDS;
        case 'therapy':
            return THERAPY_FIELDS;
        default:
            return [];
    }
};

export const filterProfessionals = (
    professionals: Professional[],
    category: 'medical' | 'holistic' | 'therapy',
    filters: { field: string; location: string; searchQuery: string }
): Professional[] => {
    return professionals.filter((prof) => {
        if (prof.category !== category) return false;
        if (filters.field && filters.field !== 'all' && prof.fieldKey !== filters.field) return false;
        if (filters.location && filters.location !== 'all' && prof.locationKey !== filters.location) return false;
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            const searchableText = `${prof.name} ${prof.field} ${prof.location} ${prof.description || ''}`.toLowerCase();
            if (!searchableText.includes(query)) return false;
        }
        return true;
    });
};