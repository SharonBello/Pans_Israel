import type { Timestamp } from 'firebase/firestore';
import type { BaseSurveyResponse } from '../../shared/types/baseSurveyTypes';

/**
 * Public statistics for the "מצב ילדינו" survey.
 * Computed on the admin page (admins can read the raw responses) and published as ONE
 * document; the public results page reads only that document, never individual responses.
 */

export interface ChartData {
    name: string;
    value: number;
    color?: string;
}

export interface GaugeData {
    name: string;
    value: number;
    fill: string;
}

export interface SOCPublicStats {
    totalCount: number;
    familyCount: number;
    remissionRate: string;     // '37%'
    avgOnsetAge: string;       // '6.7'
    genderData: ChartData[];
    triggerData: ChartData[];
    symptomData: ChartData[];
    diagnosedByData: ChartData[];
    treatmentData: ChartData[];
    outlookData: GaugeData[];
    difficultyData: GaugeData[];
    comorbidData: ChartData[];
    familyAutoimmuneData: ChartData[];
    familyPsychiatricData: ChartData[];
    misdiagnosesData: ChartData[];
    publishedAt?: Timestamp;   // set by the server when published
}

export const CHART_COLORS = [
    '#023373', // Primary
    '#6CA6D9', // Medium
    '#E67E22', // Accent
    '#4CAF50', // Success
    '#A7D5F2', // Light
    '#9C27B0', // Purple
    '#FF5722', // Deep Orange
    '#00BCD4', // Cyan
];

// ── helpers (same calculations the results page used before) ─────────────────

const calculatePercentages = (
    responses: BaseSurveyResponse[],
    questionId: string,
    options: Array<{ value: string; label: string }>,
): ChartData[] => {
    const counts: Record<string, number> = {};
    options.forEach((opt) => (counts[opt.value] = 0));

    responses.forEach((response) => {
        const answer = response.answers[questionId];
        if (typeof answer === 'string' && counts[answer] !== undefined) {
            counts[answer]++;
        } else if (typeof answer === 'boolean') {
            const key = answer ? 'yes' : 'no';
            if (counts[key] !== undefined) counts[key]++;
        }
    });

    return options
        .map((opt, index) => ({
            name: opt.label,
            value: counts[opt.value] || 0,
            color: CHART_COLORS[index % CHART_COLORS.length],
        }))
        .filter((d) => d.value > 0);
};

const calculateAverageScale = (responses: BaseSurveyResponse[], questionId: string): number => {
    const values = responses
        .map((r) => r.answers[questionId])
        .filter((v): v is number => typeof v === 'number');
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
};

/** % of responses whose multi-choice answer `questionId` includes each option, largest first */
const multiChoicePercentages = (
    responses: BaseSurveyResponse[],
    questionId: string,
    options: Array<{ id: string; label: string }>,
): ChartData[] =>
    options
        .map((o) => {
            const count = responses.filter((r) => {
                const answer = r.answers[questionId];
                return Array.isArray(answer) && answer.includes(o.id);
            }).length;
            return {
                name: o.label,
                value: responses.length > 0 ? Math.round((count / responses.length) * 100) : 0,
            };
        })
        .filter((d) => d.value > 0)
        .sort((a, b) => b.value - a.value);

const SYMPTOM_QUESTIONS = [
    { id: 'symptom_ocd', label: 'OCD' },
    { id: 'symptom_anxiety', label: 'חרדה' },
    { id: 'symptom_separation_anxiety', label: 'חרדת פרידה' },
    { id: 'symptom_mood_swings', label: 'שינויי מצב רוח' },
    { id: 'symptom_irritability', label: 'עצבנות' },
    { id: 'symptom_aggression', label: 'תוקפנות' },
    { id: 'symptom_depression', label: 'דיכאון' },
    { id: 'symptom_tics_motor', label: 'טיקים מוטוריים' },
    { id: 'symptom_tics_vocal', label: 'טיקים קוליים' },
    { id: 'symptom_sensory_sensitivity', label: 'רגישות חושית' },
    { id: 'symptom_sleep_issues', label: 'בעיות שינה' },
    { id: 'symptom_eating_issues', label: 'בעיות אכילה' },
    { id: 'symptom_urinary_issues', label: 'בעיות במתן שתן' },
    { id: 'symptom_cognitive_decline', label: 'ירידה קוגניטיבית' },
    { id: 'symptom_handwriting_decline', label: 'ירידה בכתב יד' },
    { id: 'symptom_regression', label: 'רגרסיה' },
    { id: 'symptom_hallucinations', label: 'הזיות' },
];

// ── public ───────────────────────────────────────────────────────────────────

export const buildSOCStats = (
    responses: BaseSurveyResponse[],
    totalCount: number,
    familyCount: number,
): SOCPublicStats => {
    const remitted = responses.filter(
        (r) =>
            r.answers.symptoms_remitted === 'full_remission' ||
            r.answers.symptoms_remitted === 'mostly_managed',
    ).length;

    const onsetAges = responses
        .map((r) => r.answers.child_onset_age)
        .filter((age): age is number => typeof age === 'number');

    return {
        totalCount,
        familyCount,
        remissionRate: responses.length > 0 ? `${Math.round((remitted / responses.length) * 100)}%` : '0%',
        avgOnsetAge:
            onsetAges.length > 0
                ? (onsetAges.reduce((sum, age) => sum + age, 0) / onsetAges.length).toFixed(1)
                : '0',

        genderData: calculatePercentages(responses, 'child_gender', [
            { value: 'male', label: 'זכר' },
            { value: 'female', label: 'נקבה' },
            { value: 'other', label: 'אחר' },
        ]),

        triggerData: calculatePercentages(responses, 'primary_trigger', [
            { value: 'strep', label: 'סטרפטוקוק' },
            { value: 'mycoplasma', label: 'מיקופלזמה' },
            { value: 'lyme', label: 'ליים' },
            { value: 'flu', label: 'שפעת' },
            { value: 'covid', label: 'COVID-19' },
            { value: 'ebv', label: 'EBV' },
            { value: 'unknown', label: 'לא ידוע' },
            { value: 'other', label: 'אחר' },
        ]),

        symptomData: SYMPTOM_QUESTIONS.map((q) => ({
            name: q.label,
            value: Math.round(calculateAverageScale(responses, q.id) * 20),
        }))
            .filter((s) => s.value > 0)
            .sort((a, b) => b.value - a.value),

        diagnosedByData: calculatePercentages(responses, 'diagnosed_by', [
            { value: 'pediatrician', label: 'רופא ילדים' },
            { value: 'neurologist', label: 'נוירולוג' },
            { value: 'psychiatrist', label: 'פסיכיאטר' },
            { value: 'immunologist', label: 'אימונולוג' },
            { value: 'infectious', label: 'מומחה למחלות זיהומיות' },
            { value: 'rheumatologist', label: 'ראומטולוג' },
            { value: 'naturopath', label: 'רופא נטורופתי' },
            { value: 'self', label: 'אבחון עצמי' },
            { value: 'other', label: 'אחר' },
        ]),

        treatmentData: multiChoicePercentages(responses, 'treatments_used', [
            { id: 'antibiotics', label: 'אנטיביוטיקה' },
            { id: 'nsaids', label: 'נוגדי דלקת' },
            { id: 'steroids', label: 'סטרואידים' },
            { id: 'ivig', label: 'IVIG' },
            { id: 'cbt', label: 'CBT' },
            { id: 'ssri', label: 'SSRI' },
            { id: 'other_psychiatric', label: 'תרופות פסיכיאטריות אחרות' },
            { id: 'alternative', label: 'טיפולים אלטרנטיביים' },
            { id: 'supplements', label: 'תוספים' },
        ]),

        outlookData: [
            { name: 'אופטימיות', value: calculateAverageScale(responses, 'outlook_rating') * 20, fill: '#4CAF50' },
        ],
        // The question id really is 'בcurrent_rating' in socQuestions.ts — answers are stored under it
        difficultyData: [
            { name: 'קושי יומיומי', value: calculateAverageScale(responses, 'בcurrent_rating') * 20, fill: '#E67E22' },
        ],

        comorbidData: multiChoicePercentages(responses, 'comorbid_conditions', [
            { id: 'adhd', label: 'ADHD' },
            { id: 'autism', label: 'אוטיזם / ASD' },
            { id: 'learning_disability', label: 'לקות למידה' },
            { id: 'asthma', label: 'אסטמה' },
            { id: 'eczema', label: 'אקזמה' },
            { id: 'autoimmune', label: 'מחלה אוטואימונית' },
            { id: 'thyroid', label: 'בעיות בלוטת התריס' },
            { id: 'gi', label: 'בעיות עיכול' },
            { id: 'other', label: 'אחר' },
        ]),

        familyAutoimmuneData: multiChoicePercentages(responses, 'family_autoimmune_conditions', [
            { id: 'pans', label: 'פאנס/פאנדס' },
            { id: 'thyroid', label: 'בלוטת התריס' },
            { id: 'rheumatoid', label: 'דלקת מפרקים' },
            { id: 'lupus', label: 'לופוס' },
            { id: 'celiac', label: 'צליאק' },
            { id: 'ms', label: 'טרשת נפוצה' },
            { id: 'psoriasis', label: 'פסוריאזיס' },
            { id: 'ibd', label: 'מחלת מעי דלקתית' },
            { id: 'diabetes_1', label: 'סוכרת סוג 1' },
            { id: 'other', label: 'אחר' },
        ]),

        familyPsychiatricData: multiChoicePercentages(responses, 'family_psychiatric_history', [
            { id: 'depression', label: 'דיכאון' },
            { id: 'bipolar', label: 'הפרעה דו-קוטבית' },
            { id: 'adhd', label: 'ADHD' },
            { id: 'autism', label: 'אוטיזם' },
            { id: 'tics', label: 'טיקים / טורט' },
            { id: 'eating', label: 'הפרעות אכילה' },
            { id: 'other', label: 'אחר' },
        ]),

        misdiagnosesData: multiChoicePercentages(responses, 'misdiagnoses', [
            { id: 'ocd', label: 'OCD' },
            { id: 'anxiety', label: 'הפרעת חרדה' },
            { id: 'adhd', label: 'ADHD' },
            { id: 'autism', label: 'אוטיזם / ASD' },
            { id: 'tourette', label: 'תסמונת טורט' },
            { id: 'bipolar', label: 'הפרעה דו-קוטבית' },
            { id: 'depression', label: 'דיכאון' },
            { id: 'behavioral', label: 'בעיות התנהגות' },
            { id: 'psychosis', label: 'פסיכוזה' },
            { id: 'other', label: 'אחר' },
        ]),
    };
};