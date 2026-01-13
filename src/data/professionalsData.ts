import type { Professional, ProfessionalField, Location } from '../types/professionals';

// Medical professional fields
export const MEDICAL_FIELDS: ProfessionalField[] = [
    { key: 'pediatric-neurologist', label: 'נוירולוג ילדים', category: 'medical' },
    { key: 'pediatric-psychiatrist', label: 'פסיכיאטר ילדים', category: 'medical' },
    { key: 'pediatric-immunologist', label: 'אימונולוג ילדים', category: 'medical' },
    { key: 'infectious-disease', label: 'מומחה למחלות זיהומיות', category: 'medical' },
    { key: 'pediatrician', label: 'רופא ילדים', category: 'medical' },
    { key: 'rheumatologist', label: 'ראומטולוג ילדים', category: 'medical' },
    { key: 'ent', label: 'רופא אף אוזן גרון', category: 'medical' },
];

// Holistic medicine fields
export const HOLISTIC_FIELDS: ProfessionalField[] = [
    { key: 'naturopath', label: 'נטורופת/ית', category: 'holistic' },
    { key: 'homeopath', label: 'הומאופת/ית', category: 'holistic' },
    { key: 'functional-medicine', label: 'רפואה פונקציונלית', category: 'holistic' },
    { key: 'nutritionist', label: 'תזונאי/ת קלינית', category: 'holistic' },
    { key: 'acupuncture', label: 'דיקור סיני', category: 'holistic' },
    { key: 'chinese-medicine', label: 'רפואה סינית', category: 'holistic' },
    { key: 'reflexology', label: 'רפלקסולוגיה', category: 'holistic' },
];

// Therapy fields
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

// All fields combined
export const ALL_FIELDS: ProfessionalField[] = [
    ...MEDICAL_FIELDS,
    ...HOLISTIC_FIELDS,
    ...THERAPY_FIELDS,
];

// Locations in Israel
export const LOCATIONS: Location[] = [
    { key: 'tel-aviv', label: 'תל אביב', region: 'מרכז' },
    { key: 'jerusalem', label: 'ירושלים', region: 'ירושלים' },
    { key: 'haifa', label: 'חיפה', region: 'צפון' },
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
    { key: 'online', label: 'מקוון (אונליין)', region: 'כל הארץ' },
];

// Mock data for professionals (replace with CMS data later)
export const MOCK_PROFESSIONALS: Professional[] = [
    // Medical Professionals
    {
        id: 'med-1',
        name: 'ד"ר יעל כהן',
        field: 'נוירולוג ילדים',
        fieldKey: 'pediatric-neurologist',
        location: 'תל אביב',
        locationKey: 'tel-aviv',
        phone: '03-1234567',
        email: 'dr.cohen@example.com',
        address: 'רח\' דיזנגוף 100, תל אביב',
        description: 'מתמחה בנוירולוגיית ילדים עם ניסיון רב בתסמונות PANDAS/PANS. גישה חמה ומקצועית.',
        acceptingNewPatients: true,
        category: 'medical',
    },
    {
        id: 'med-2',
        name: 'ד"ר משה לוי',
        field: 'פסיכיאטר ילדים',
        fieldKey: 'pediatric-psychiatrist',
        location: 'ירושלים',
        locationKey: 'jerusalem',
        phone: '02-9876543',
        email: 'dr.levi@example.com',
        address: 'רח\' הנביאים 50, ירושלים',
        description: 'פסיכיאטר ילדים ונוער עם התמחות בהפרעות חרדה ו-OCD הקשורות לזיהומים.',
        acceptingNewPatients: true,
        category: 'medical',
    },
    {
        id: 'med-3',
        name: 'ד"ר שרה אברהם',
        field: 'אימונולוג ילדים',
        fieldKey: 'pediatric-immunologist',
        location: 'חיפה',
        locationKey: 'haifa',
        phone: '04-5551234',
        address: 'רמב"ם, חיפה',
        description: 'מומחית לאימונולוגיה קלינית בילדים, מכירה את תסמונות PANDAS/PANS.',
        acceptingNewPatients: false,
        category: 'medical',
    },
    {
        id: 'med-4',
        name: 'ד"ר דניאל רוזן',
        field: 'מומחה למחלות זיהומיות',
        fieldKey: 'infectious-disease',
        location: 'רמת גן',
        locationKey: 'ramat-gan',
        phone: '03-7771234',
        email: 'dr.rosen@example.com',
        address: 'בית חולים שיבא, רמת גן',
        description: 'מומחה למחלות זיהומיות בילדים עם ידע בטיפול בזיהומי סטרפטוקוק.',
        acceptingNewPatients: true,
        category: 'medical',
    },

    // Holistic Medicine
    {
        id: 'hol-1',
        name: 'מירב שמיר',
        field: 'נטורופת/ית',
        fieldKey: 'naturopath',
        location: 'תל אביב',
        locationKey: 'tel-aviv',
        phone: '054-1234567',
        email: 'merav@example.com',
        website: 'https://example.com',
        address: 'רח\' אבן גבירול 80, תל אביב',
        description: 'נטורופתית קלינית עם התמחות בבריאות ילדים ותמיכה במערכת החיסון.',
        acceptingNewPatients: true,
        category: 'holistic',
    },
    {
        id: 'hol-2',
        name: 'אורית גולן',
        field: 'הומאופת/ית',
        fieldKey: 'homeopath',
        location: 'ירושלים',
        locationKey: 'jerusalem',
        phone: '052-9876543',
        description: 'הומאופתית קלאסית עם ניסיון בטיפול בילדים עם בעיות התנהגותיות.',
        acceptingNewPatients: true,
        category: 'holistic',
    },
    {
        id: 'hol-3',
        name: 'ד"ר רונית ברק',
        field: 'רפואה פונקציונלית',
        fieldKey: 'functional-medicine',
        location: 'הרצליה',
        locationKey: 'herzliya',
        phone: '09-1112222',
        email: 'dr.barak@example.com',
        website: 'https://example.com',
        description: 'רופאה לרפואה פונקציונלית המתמקדת באיתור שורש הבעיה וטיפול הוליסטי.',
        acceptingNewPatients: true,
        category: 'holistic',
    },
    {
        id: 'hol-4',
        name: 'נועה כץ',
        field: 'תזונאי/ת קלינית',
        fieldKey: 'nutritionist',
        location: 'מקוון (אונליין)',
        locationKey: 'online',
        phone: '050-3334444',
        email: 'noa@example.com',
        description: 'תזונאית קלינית המתמחה בתזונה אנטי-דלקתית ותמיכה במערכת החיסון בילדים.',
        acceptingNewPatients: true,
        category: 'holistic',
    },

    // Therapy
    {
        id: 'ther-1',
        name: 'רחל דוד',
        field: 'מרפא/ה בעיסוק',
        fieldKey: 'occupational-therapist',
        location: 'תל אביב',
        locationKey: 'tel-aviv',
        phone: '03-4445566',
        email: 'rachel@example.com',
        address: 'רח\' קינג ג\'ורג\' 30, תל אביב',
        description: 'מרפאה בעיסוק ילדים עם התמחות באינטגרציה סנסורית ופרקסיה.',
        acceptingNewPatients: true,
        category: 'therapy',
    },
    {
        id: 'ther-2',
        name: 'יוסי מזרחי',
        field: 'פסיכולוג/ית',
        fieldKey: 'psychologist',
        location: 'באר שבע',
        locationKey: 'beer-sheva',
        phone: '08-6667777',
        email: 'yossi@example.com',
        description: 'פסיכולוג קליני ילדים ונוער, מתמחה בחרדות ו-OCD.',
        acceptingNewPatients: true,
        category: 'therapy',
    },
    {
        id: 'ther-3',
        name: 'דנה פרידמן',
        field: 'מטפל/ת CBT',
        fieldKey: 'cbt-therapist',
        location: 'רעננה',
        locationKey: 'raanana',
        phone: '054-8889999',
        email: 'dana@example.com',
        description: 'מטפלת CBT לילדים ונוער עם ניסיון בטיפול בהפרעות חרדה ו-OCD.',
        acceptingNewPatients: false,
        category: 'therapy',
    },
    {
        id: 'ther-4',
        name: 'עדי שלום',
        field: 'קלינאי/ת תקשורת',
        fieldKey: 'speech-therapist',
        location: 'חיפה',
        locationKey: 'haifa',
        phone: '04-1112233',
        address: 'רח\' הנשיא 15, חיפה',
        description: 'קלינאית תקשורת המתמחה בילדים עם קשיי שפה והבעה.',
        acceptingNewPatients: true,
        category: 'therapy',
    },
    {
        id: 'ther-5',
        name: 'מיכל אורן',
        field: 'מטפל/ת באומנות',
        fieldKey: 'art-therapist',
        location: 'מקוון (אונליין)',
        locationKey: 'online',
        phone: '052-4445555',
        email: 'michal@example.com',
        description: 'מטפלת באומנות לילדים, עוזרת לביטוי רגשי דרך יצירה.',
        acceptingNewPatients: true,
        category: 'therapy',
    },
];

// Helper function to get fields by category
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

// Helper function to filter professionals
export const filterProfessionals = (
    professionals: Professional[],
    category: 'medical' | 'holistic' | 'therapy',
    filters: { field: string; location: string; searchQuery: string }
): Professional[] => {
    return professionals.filter((prof) => {
        // Filter by category
        if (prof.category !== category) return false;

        // Filter by field
        if (filters.field && filters.field !== 'all' && prof.fieldKey !== filters.field) {
            return false;
        }

        // Filter by location
        if (filters.location && filters.location !== 'all' && prof.locationKey !== filters.location) {
            return false;
        }

        // Filter by search query
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            const searchableText = `${prof.name} ${prof.field} ${prof.location} ${prof.description || ''}`.toLowerCase();
            if (!searchableText.includes(query)) {
                return false;
            }
        }

        return true;
    });
};