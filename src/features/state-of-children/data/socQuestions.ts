import { type SOCCategory, type SOCQuestion, SOC_SURVEY_ID, SOC_SURVEY_SLUG, SOC_SURVEY_VERSION, type SOCSurveyDefinition } from '../types/socTypes';

// --------------------------------------------------------------------------
// Helper function to create questions
// --------------------------------------------------------------------------

const createQuestion = (
    partial: Omit<SOCQuestion, 'id'> & { id?: string }
): SOCQuestion => ({
    ...partial,
    id: partial.id || `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
} as SOCQuestion);

// --------------------------------------------------------------------------
// Category 1: Basic Profile (פרופיל בסיסי)
// --------------------------------------------------------------------------

const basicProfileQuestions: SOCQuestion[] = [
    createQuestion({
        id: 'child_gender',
        category: 'basic_profile',
        type: 'single_choice',
        questionText: 'מהו מין הילד/ה?',
        required: true,
        options: [
            { id: 'male', label: 'זכר', value: 'male' },
            { id: 'female', label: 'נקבה', value: 'female' },
            { id: 'other', label: 'אחר', value: 'other' },
        ],
        ppnEquivalent: 'Q1',
    }),
    createQuestion({
        id: 'child_current_age',
        category: 'basic_profile',
        type: 'number',
        questionText: 'מה גיל הילד/ה הנוכחי?',
        questionSubtext: 'הזינו גיל בשנים',
        required: true,
        min: 1,
        max: 30,
        ppnEquivalent: 'Q2',
    }),
    createQuestion({
        id: 'child_onset_age',
        category: 'basic_profile',
        type: 'number',
        questionText: 'באיזה גיל הופיעו התסמינים לראשונה בצורה חריפה?',
        questionSubtext: 'הזינו גיל בשנים',
        required: true,
        min: 0,
        max: 25,
        ppnEquivalent: 'Q3',
    }),
    createQuestion({
        id: 'had_symptoms_before_onset',
        category: 'basic_profile',
        type: 'yes_no',
        questionText: 'האם הבחנתם בתסמינים קלים יותר לפני ההתפרצות החריפה?',
        required: true,
        ppnEquivalent: 'Q4',
    }),
    createQuestion({
        id: 'symptoms_before_onset_age',
        category: 'basic_profile',
        type: 'number',
        questionText: 'אם כן, באיזה גיל הבחנתם בתסמינים הראשונים?',
        required: false,
        min: 0,
        max: 25,
        dependsOn: {
            questionId: 'had_symptoms_before_onset',
            values: [true, 'true', 'yes'],
        },
        ppnEquivalent: 'Q4a',
    }),
    createQuestion({
        id: 'birth_complications',
        category: 'basic_profile',
        type: 'yes_no',
        questionText: 'האם היו סיבוכים בהריון או בלידה?',
        required: false,
        ppnEquivalent: 'Q5',
    }),
    createQuestion({
        id: 'developmental_milestones',
        category: 'basic_profile',
        type: 'single_choice',
        questionText: 'איך היה התפתחותו/ה של הילד/ה לפני ההתפרצות?',
        required: true,
        options: [
            { id: 'normal', label: 'תקינה לחלוטין', value: 'normal' },
            { id: 'mostly_normal', label: 'תקינה ברובה עם עיכובים קלים', value: 'mostly_normal' },
            { id: 'some_delays', label: 'עיכובים משמעותיים בחלק מהתחומים', value: 'some_delays' },
            { id: 'significant_delays', label: 'עיכובים משמעותיים במספר תחומים', value: 'significant_delays' },
        ],
        ppnEquivalent: 'Q6',
    }),
];

// --------------------------------------------------------------------------
// Category 2: Infection Triggers (גורמי זיהום)
// --------------------------------------------------------------------------

const infectionTriggersQuestions: SOCQuestion[] = [
    createQuestion({
        id: 'primary_trigger',
        category: 'infection_triggers',
        type: 'single_choice',
        questionText: 'מהו הזיהום או האירוע שלדעתכם גרם להתפרצות?',
        required: true,
        options: [
            { id: 'strep', label: 'זיהום סטרפטוקוקי (דלקת גרון/קדחת שני)', value: 'strep' },
            { id: 'mycoplasma', label: 'מיקופלזמה (דלקת ריאות)', value: 'mycoplasma' },
            { id: 'lyme', label: 'מחלת ליים', value: 'lyme' },
            { id: 'flu', label: 'שפעת', value: 'flu' },
            { id: 'covid', label: 'COVID-19', value: 'covid' },
            { id: 'ebv', label: 'נגיף אפשטיין-בר (מונונוקלאוזיס)', value: 'ebv' },
            { id: 'other_virus', label: 'זיהום ויראלי אחר', value: 'other_virus' },
            { id: 'vaccine', label: 'לאחר חיסון', value: 'vaccine' },
            { id: 'unknown', label: 'לא ידוע', value: 'unknown' },
            { id: 'other', label: 'אחר', value: 'other' },
        ],
        ppnEquivalent: 'Q7',
    }),
    createQuestion({
        id: 'trigger_infections_other',
        category: 'infection_triggers',
        type: 'text',
        questionText: 'אם בחרתם "אחר", פרטו:',
        required: false,
        maxLength: 200,
        dependsOn: {
            questionId: 'primary_trigger',
            values: ['other'],
        },
    }),
    createQuestion({
        id: 'had_strep_confirmed',
        category: 'infection_triggers',
        type: 'single_choice',
        questionText: 'האם זיהום סטרפטוקוקי אושר במעבדה?',
        required: true,
        options: [
            { id: 'yes_culture', label: 'כן, בתרבית גרון', value: 'yes_culture' },
            { id: 'yes_rapid', label: 'כן, בבדיקה מהירה', value: 'yes_rapid' },
            { id: 'yes_blood', label: 'כן, בבדיקת דם (ASO/Anti-DNase B)', value: 'yes_blood' },
            { id: 'suspected', label: 'נחשד אך לא אושר', value: 'suspected' },
            { id: 'no', label: 'לא', value: 'no' },
            { id: 'not_tested', label: 'לא נבדק', value: 'not_tested' },
        ],
        ppnEquivalent: 'Q8',
    }),
    createQuestion({
        id: 'recurrent_infections',
        category: 'infection_triggers',
        type: 'yes_no',
        questionText: 'האם הילד/ה סובל/ת מזיהומים חוזרים?',
        required: true,
        ppnEquivalent: 'Q9',
    }),
    createQuestion({
        id: 'recurrent_infections_frequency',
        category: 'infection_triggers',
        type: 'single_choice',
        questionText: 'אם כן, באיזו תדירות?',
        required: false,
        options: [
            { id: 'monthly', label: 'פעם בחודש או יותר', value: 'monthly' },
            { id: 'every_few_months', label: 'כל 2-3 חודשים', value: 'every_few_months' },
            { id: 'few_times_year', label: '3-4 פעמים בשנה', value: 'few_times_year' },
            { id: 'once_twice_year', label: 'פעם-פעמיים בשנה', value: 'once_twice_year' },
        ],
        dependsOn: {
            questionId: 'recurrent_infections',
            values: [true, 'true', 'yes'],
        },
        ppnEquivalent: 'Q9a',
    }),
];

// --------------------------------------------------------------------------
// Category 3: Symptoms (תסמינים)
// --------------------------------------------------------------------------

const symptomQuestions: SOCQuestion[] = [
    // OCD
    createQuestion({
        id: 'symptom_ocd',
        category: 'symptoms',
        type: 'scale',
        questionText: 'מחשבות טורדניות והתנהגויות כפייתיות (OCD)',
        questionSubtext: 'כגון: טקסים, מחשבות חוזרות, צורך בסימטריה, פחד מזיהום',
        required: true,
        scaleMin: 0,
        scaleMax: 5,
        scaleMinLabel: 'לא קיים',
        scaleMaxLabel: 'חמור מאוד',
        ppnEquivalent: 'Q10a',
    }),
    // Anxiety
    createQuestion({
        id: 'symptom_anxiety',
        category: 'symptoms',
        type: 'scale',
        questionText: 'חרדה נרחבת או פחדים קיצוניים',
        questionSubtext: 'כגון: חרדת נטישה, חרדה חברתית, פחדים לא רציונליים',
        required: true,
        scaleMin: 0,
        scaleMax: 5,
        scaleMinLabel: 'לא קיים',
        scaleMaxLabel: 'חמור מאוד',
        ppnEquivalent: 'Q10b',
    }),
    // Separation Anxiety
    createQuestion({
        id: 'symptom_separation_anxiety',
        category: 'symptoms',
        type: 'scale',
        questionText: 'חרדת נטישה / פרידה',
        questionSubtext: 'קושי להיפרד מהורים, סירוב ללכת לבית ספר, צורך בליווי צמוד',
        required: true,
        scaleMin: 0,
        scaleMax: 5,
        scaleMinLabel: 'לא קיים',
        scaleMaxLabel: 'חמור מאוד',
        ppnEquivalent: 'Q10c',
    }),
    // Mood Swings
    createQuestion({
        id: 'symptom_mood_swings',
        category: 'symptoms',
        type: 'scale',
        questionText: 'שינויים קיצוניים במצב הרוח',
        questionSubtext: 'מעברים מהירים בין מצבי רוח, חוסר יציבות רגשית',
        required: true,
        scaleMin: 0,
        scaleMax: 5,
        scaleMinLabel: 'לא קיים',
        scaleMaxLabel: 'חמור מאוד',
        ppnEquivalent: 'Q10d',
    }),
    // Irritability
    createQuestion({
        id: 'symptom_irritability',
        category: 'symptoms',
        type: 'scale',
        questionText: 'עצבנות והתפרצויות זעם',
        questionSubtext: 'רגזנות, התפרצויות בלתי נשלטות, תגובות קיצוניות',
        required: true,
        scaleMin: 0,
        scaleMax: 5,
        scaleMinLabel: 'לא קיים',
        scaleMaxLabel: 'חמור מאוד',
        ppnEquivalent: 'Q10e',
    }),
    // Aggression
    createQuestion({
        id: 'symptom_aggression',
        category: 'symptoms',
        type: 'scale',
        questionText: 'תוקפנות או אלימות',
        questionSubtext: 'התנהגות אלימה כלפי עצמו, אחרים או רכוש',
        required: true,
        scaleMin: 0,
        scaleMax: 5,
        scaleMinLabel: 'לא קיים',
        scaleMaxLabel: 'חמור מאוד',
        ppnEquivalent: 'Q10f',
    }),
    // Depression
    createQuestion({
        id: 'symptom_depression',
        category: 'symptoms',
        type: 'scale',
        questionText: 'דיכאון או עצבות',
        questionSubtext: 'מצב רוח ירוד, חוסר עניין, בכי',
        required: true,
        scaleMin: 0,
        scaleMax: 5,
        scaleMinLabel: 'לא קיים',
        scaleMaxLabel: 'חמור מאוד',
        ppnEquivalent: 'Q10g',
    }),
    // Motor Tics
    createQuestion({
        id: 'symptom_tics_motor',
        category: 'symptoms',
        type: 'scale',
        questionText: 'טיקים מוטוריים',
        questionSubtext: 'תנועות לא רצוניות כגון: מצמוץ, הנעת ראש, תנועות כתפיים',
        required: true,
        scaleMin: 0,
        scaleMax: 5,
        scaleMinLabel: 'לא קיים',
        scaleMaxLabel: 'חמור מאוד',
        ppnEquivalent: 'Q10h',
    }),
    // Vocal Tics
    createQuestion({
        id: 'symptom_tics_vocal',
        category: 'symptoms',
        type: 'scale',
        questionText: 'טיקים קוליים',
        questionSubtext: 'קולות לא רצוניים כגון: שיעול, גרגור, צלילים',
        required: true,
        scaleMin: 0,
        scaleMax: 5,
        scaleMinLabel: 'לא קיים',
        scaleMaxLabel: 'חמור מאוד',
        ppnEquivalent: 'Q10i',
    }),
    // Sensory Sensitivity
    createQuestion({
        id: 'symptom_sensory_sensitivity',
        category: 'symptoms',
        type: 'scale',
        questionText: 'רגישות יתר לגירויים חושיים',
        questionSubtext: 'רגישות לאור, קולות, מגע, טעמים או ריחות',
        required: true,
        scaleMin: 0,
        scaleMax: 5,
        scaleMinLabel: 'לא קיים',
        scaleMaxLabel: 'חמור מאוד',
        ppnEquivalent: 'Q10j',
    }),
    // Sleep Issues
    createQuestion({
        id: 'symptom_sleep_issues',
        category: 'symptoms',
        type: 'scale',
        questionText: 'בעיות שינה',
        questionSubtext: 'קושי להירדם, התעוררויות, סיוטים, עייפות מוגזמת',
        required: true,
        scaleMin: 0,
        scaleMax: 5,
        scaleMinLabel: 'לא קיים',
        scaleMaxLabel: 'חמור מאוד',
        ppnEquivalent: 'Q10k',
    }),
    // Eating Issues
    createQuestion({
        id: 'symptom_eating_issues',
        category: 'symptoms',
        type: 'scale',
        questionText: 'בעיות אכילה',
        questionSubtext: 'סירוב לאכול, הגבלת מזון, אכילה כפייתית',
        required: true,
        scaleMin: 0,
        scaleMax: 5,
        scaleMinLabel: 'לא קיים',
        scaleMaxLabel: 'חמור מאוד',
        ppnEquivalent: 'Q10l',
    }),
    // Urinary Issues
    createQuestion({
        id: 'symptom_urinary_issues',
        category: 'symptoms',
        type: 'scale',
        questionText: 'בעיות במתן שתן',
        questionSubtext: 'תכיפות, הרטבה, כאב',
        required: true,
        scaleMin: 0,
        scaleMax: 5,
        scaleMinLabel: 'לא קיים',
        scaleMaxLabel: 'חמור מאוד',
        ppnEquivalent: 'Q10m',
    }),
    // Cognitive Decline
    createQuestion({
        id: 'symptom_cognitive_decline',
        category: 'symptoms',
        type: 'scale',
        questionText: 'ירידה ביכולות קוגניטיביות',
        questionSubtext: 'קשיי ריכוז, בעיות זיכרון, קושי בלמידה',
        required: true,
        scaleMin: 0,
        scaleMax: 5,
        scaleMinLabel: 'לא קיים',
        scaleMaxLabel: 'חמור מאוד',
        ppnEquivalent: 'Q10n',
    }),
    // Handwriting Decline
    createQuestion({
        id: 'symptom_handwriting_decline',
        category: 'symptoms',
        type: 'scale',
        questionText: 'ירידה ביכולת הכתיבה',
        questionSubtext: 'שינוי בכתב יד, קושי מוטורי עדין',
        required: true,
        scaleMin: 0,
        scaleMax: 5,
        scaleMinLabel: 'לא קיים',
        scaleMaxLabel: 'חמור מאוד',
        ppnEquivalent: 'Q10o',
    }),
    // Regression
    createQuestion({
        id: 'symptom_regression',
        category: 'symptoms',
        type: 'scale',
        questionText: 'רגרסיה התנהגותית',
        questionSubtext: 'התנהגות לא תואמת גיל, "תינוקיות", אובדן מיומנויות',
        required: true,
        scaleMin: 0,
        scaleMax: 5,
        scaleMinLabel: 'לא קיים',
        scaleMaxLabel: 'חמור מאוד',
        ppnEquivalent: 'Q10p',
    }),
    // Hallucinations
    createQuestion({
        id: 'symptom_hallucinations',
        category: 'symptoms',
        type: 'scale',
        questionText: 'הזיות או תפיסות לא מציאותיות',
        questionSubtext: 'ראייה או שמיעה של דברים שאינם קיימים',
        required: true,
        scaleMin: 0,
        scaleMax: 5,
        scaleMinLabel: 'לא קיים',
        scaleMaxLabel: 'חמור מאוד',
        ppnEquivalent: 'Q10q',
    }),
    // Other Symptoms
    createQuestion({
        id: 'symptoms_other',
        category: 'symptoms',
        type: 'text',
        questionText: 'תסמינים נוספים שלא הוזכרו',
        questionSubtext: 'אם יש תסמינים נוספים, פרטו אותם כאן',
        required: false,
        maxLength: 500,
        ppnEquivalent: 'Q10r',
    }),
];

// --------------------------------------------------------------------------
// Category 4: Illness Course (מהלך המחלה)
// --------------------------------------------------------------------------

const illnessCourseQuestions: SOCQuestion[] = [
    createQuestion({
        id: 'onset_speed',
        category: 'illness_course',
        type: 'single_choice',
        questionText: 'כמה מהר הופיעו התסמינים?',
        required: true,
        options: [
            { id: 'overnight', label: 'בין לילה (24 שעות)', value: 'overnight' },
            { id: 'few_days', label: 'תוך מספר ימים', value: 'few_days' },
            { id: 'week', label: 'תוך שבוע', value: 'week' },
            { id: 'gradual', label: 'הדרגתי על פני שבועות', value: 'gradual' },
        ],
        ppnEquivalent: 'Q11',
    }),
    createQuestion({
        id: 'unable_to_attend_school',
        category: 'illness_course',
        type: 'yes_no',
        questionText: 'האם הילד/ה לא יכל/ה להגיע לבית הספר בשלב כלשהו?',
        required: true,
        ppnEquivalent: 'Q12',
    }),
    createQuestion({
        id: 'school_absence_duration',
        category: 'illness_course',
        type: 'single_choice',
        questionText: 'אם כן, לכמה זמן?',
        required: false,
        options: [
            { id: 'few_days', label: 'מספר ימים', value: 'few_days' },
            { id: 'week_two', label: 'שבוע-שבועיים', value: 'week_two' },
            { id: 'month', label: 'חודש', value: 'month' },
            { id: 'few_months', label: 'מספר חודשים', value: 'few_months' },
            { id: 'semester', label: 'סמסטר', value: 'semester' },
            { id: 'year_plus', label: 'שנה או יותר', value: 'year_plus' },
        ],
        dependsOn: {
            questionId: 'unable_to_attend_school',
            values: [true, 'true', 'yes'],
        },
        ppnEquivalent: 'Q12a',
    }),
    createQuestion({
        id: 'life_impact_severity',
        category: 'illness_course',
        type: 'scale',
        questionText: 'עד כמה התסמונת השפיעה על שגרת החיים?',
        required: true,
        scaleMin: 1,
        scaleMax: 5,
        scaleMinLabel: 'השפעה מינימלית',
        scaleMaxLabel: 'השפעה חמורה מאוד',
        ppnEquivalent: 'Q13',
    }),
    createQuestion({
        id: 'flare_pattern',
        category: 'illness_course',
        type: 'single_choice',
        questionText: 'איך התסמינים מתנהגים לאורך זמן?',
        required: true,
        options: [
            { id: 'constant', label: 'קבועים ללא שינוי', value: 'constant' },
            { id: 'flares', label: 'החמרות והפוגות', value: 'flares' },
            { id: 'improving', label: 'משתפרים בהדרגה', value: 'improving' },
            { id: 'worsening', label: 'מחמירים בהדרגה', value: 'worsening' },
        ],
        ppnEquivalent: 'Q14',
    }),
    createQuestion({
        id: 'flare_count',
        category: 'illness_course',
        type: 'single_choice',
        questionText: 'כמה התלקחויות (flares) היו מאז ההתפרצות הראשונה?',
        required: false,
        options: [
            { id: '1', label: 'אחת', value: '1' },
            { id: '2_3', label: '2-3', value: '2_3' },
            { id: '4_6', label: '4-6', value: '4_6' },
            { id: '7_10', label: '7-10', value: '7_10' },
            { id: '10_plus', label: 'יותר מ-10', value: '10_plus' },
            { id: 'continuous', label: 'התסמינים רציפים', value: 'continuous' },
        ],
        dependsOn: {
            questionId: 'flare_pattern',
            values: ['flares'],
        },
        ppnEquivalent: 'Q15',
    }),
];

// --------------------------------------------------------------------------
// Category 5: Diagnosis (אבחון)
// --------------------------------------------------------------------------

const diagnosisQuestions: SOCQuestion[] = [
    createQuestion({
        id: 'diagnosed_by',
        category: 'diagnosis',
        type: 'single_choice',
        questionText: 'מי ביצע את האבחנה של PANS/PANDAS?',
        required: true,
        options: [
            { id: 'pediatrician', label: 'רופא ילדים', value: 'pediatrician' },
            { id: 'neurologist', label: 'נוירולוג', value: 'neurologist' },
            { id: 'psychiatrist', label: 'פסיכיאטר ילדים', value: 'psychiatrist' },
            { id: 'immunologist', label: 'אימונולוג', value: 'immunologist' },
            { id: 'infectious', label: 'מומחה למחלות זיהומיות', value: 'infectious' },
            { id: 'rheumatologist', label: 'ראומטולוג', value: 'rheumatologist' },
            { id: 'naturopath', label: 'רופא נטורופתי', value: 'naturopath' },
            { id: 'self', label: 'אבחון עצמי (לא אושר על ידי רופא)', value: 'self' },
            { id: 'other', label: 'אחר', value: 'other' },
        ],
        ppnEquivalent: 'Q16',
    }),
    createQuestion({
        id: 'doctors_visited_count',
        category: 'diagnosis',
        type: 'single_choice',
        questionText: 'לכמה אנשי מקצוע פניתם לפני שקיבלתם אבחנה?',
        required: true,
        options: [
            { id: '1', label: '1', value: '1' },
            { id: '2_3', label: '2-3', value: '2_3' },
            { id: '4_5', label: '4-5', value: '4_5' },
            { id: '6_10', label: '6-10', value: '6_10' },
            { id: '10_plus', label: 'יותר מ-10', value: '10_plus' },
        ],
        ppnEquivalent: 'Q17',
    }),
    createQuestion({
        id: 'time_to_diagnosis',
        category: 'diagnosis',
        type: 'single_choice',
        questionText: 'כמה זמן עבר מההתפרצות הראשונה עד לאבחנה?',
        required: true,
        options: [
            { id: 'week', label: 'פחות משבוע', value: 'week' },
            { id: 'month', label: 'שבוע עד חודש', value: 'month' },
            { id: 'months_3', label: '1-3 חודשים', value: 'months_3' },
            { id: 'months_6', label: '3-6 חודשים', value: 'months_6' },
            { id: 'year', label: '6 חודשים עד שנה', value: 'year' },
            { id: 'years_2', label: '1-2 שנים', value: 'years_2' },
            { id: 'years_plus', label: 'יותר משנתיים', value: 'years_plus' },
        ],
        ppnEquivalent: 'Q18',
    }),
    createQuestion({
        id: 'diagnosis_method',
        category: 'diagnosis',
        type: 'multiple_choice',
        questionText: 'כיצד בוצעה האבחנה? (ניתן לבחור מספר תשובות)',
        required: true,
        options: [
            { id: 'clinical', label: 'אבחון קליני (על פי תסמינים)', value: 'clinical' },
            { id: 'strep_titers', label: 'בדיקות נוגדנים לסטרפטוקוק (ASO/Anti-DNase B)', value: 'strep_titers' },
            { id: 'cunningham', label: 'בדיקת Cunningham Panel', value: 'cunningham' },
            { id: 'mri', label: 'MRI מוח', value: 'mri' },
            { id: 'eeg', label: 'EEG', value: 'eeg' },
            { id: 'blood_tests', label: 'בדיקות דם נוספות', value: 'blood_tests' },
            { id: 'lumbar', label: 'ניקור מותני', value: 'lumbar' },
        ],
        ppnEquivalent: 'Q19',
    }),
    createQuestion({
        id: 'misdiagnoses',
        category: 'diagnosis',
        type: 'multiple_choice',
        questionText: 'אילו אבחנות שגויות קיבלתם לפני האבחנה הנכונה? (ניתן לבחור מספר תשובות)',
        required: false,
        options: [
            { id: 'none', label: 'לא קיבלנו אבחנות שגויות', value: 'none' },
            { id: 'ocd', label: 'OCD', value: 'ocd' },
            { id: 'anxiety', label: 'הפרעת חרדה', value: 'anxiety' },
            { id: 'adhd', label: 'ADHD', value: 'adhd' },
            { id: 'autism', label: 'אוטיזם / ASD', value: 'autism' },
            { id: 'tourette', label: 'תסמונת טורט', value: 'tourette' },
            { id: 'bipolar', label: 'הפרעה דו-קוטבית', value: 'bipolar' },
            { id: 'depression', label: 'דיכאון', value: 'depression' },
            { id: 'behavioral', label: 'בעיות התנהגות', value: 'behavioral' },
            { id: 'psychosis', label: 'פסיכוזה', value: 'psychosis' },
            { id: 'other', label: 'אחר', value: 'other' },
        ],
        ppnEquivalent: 'Q20',
    }),
    createQuestion({
        id: 'additional',
        category: 'diagnosis',
        type: 'multiple_choice',
        questionText: 'אילו אבחנות נוספות קיבלתם לפני אבחנת הפאנדס/פאנדס? (ניתן לבחור מספר תשובות)',
        required: false,
        options: [
            { id: 'additional_none', label: 'לא קיבלנו אבחנות נוספות', value: 'none' },
            { id: 'additional_ocd', label: 'OCD', value: 'ocd' },
            { id: 'additional_anxiety', label: 'הפרעת חרדה', value: 'anxiety' },
            { id: 'additional_adhd', label: 'ADHD', value: 'adhd' },
            { id: 'additional_autism', label: 'אוטיזם / ASD', value: 'autism' },
            { id: 'additional_tourette', label: 'תסמונת טורט', value: 'tourette' },
            { id: 'additional_bipolar', label: 'הפרעה דו-קוטבית', value: 'bipolar' },
            { id: 'additional_depression', label: 'דיכאון', value: 'depression' },
            { id: 'additional_behavioral', label: 'בעיות התנהגות', value: 'behavioral' },
            { id: 'additional_psychosis', label: 'פסיכוזה', value: 'psychosis' },
            { id: 'additional_other', label: 'אחר', value: 'other' },
        ],
        ppnEquivalent: 'Q21',
    }),
];

// --------------------------------------------------------------------------
// Category 6: Treatments (טיפולים)
// --------------------------------------------------------------------------

const treatmentQuestions: SOCQuestion[] = [
    createQuestion({
        id: 'treatments_used',
        category: 'treatments',
        type: 'multiple_choice',
        questionText: 'אילו טיפולים נוסו? (ניתן לבחור מספר תשובות)',
        required: true,
        options: [
            { id: 'antibiotics', label: 'אנטיביוטיקה', value: 'antibiotics' },
            { id: 'nsaids', label: 'תרופות נוגדות דלקת (נורופן, איבופרופן)', value: 'nsaids' },
            { id: 'steroids', label: 'סטרואידים', value: 'steroids' },
            { id: 'ivig', label: 'IVIG (אימונוגלובולינים תוך-ורידיים)', value: 'ivig' },
            { id: 'plasmapheresis', label: 'פלזמפרזיס (החלפת פלזמה)', value: 'plasmapheresis' },
            { id: 'ssri', label: 'תרופות SSRI', value: 'ssri' },
            { id: 'other_psychiatric', label: 'תרופות פסיכיאטריות אחרות', value: 'other_psychiatric' },
            { id: 'cbt', label: 'טיפול קוגניטיבי-התנהגותי (CBT)', value: 'cbt' },
            { id: 'erp', label: 'טיפול ERP (חשיפה)', value: 'erp' },
            { id: 'therapy', label: 'פסיכותרפיה', value: 'therapy' },
            { id: 'tonsillectomy', label: 'כריתת שקדים', value: 'tonsillectomy' },
            { id: 'supplements', label: 'תוספי תזונה / ויטמינים', value: 'supplements' },
            { id: 'alternative', label: 'טיפולים אלטרנטיביים (הומאופתיה, נטורופתיה, דיקור)', value: 'alternative' },
            { id: 'diet', label: 'שינוי תזונה', value: 'diet' },
            { id: 'none', label: 'לא קיבלנו טיפול', value: 'none' },
        ],
        ppnEquivalent: 'Q21',
    }),
    createQuestion({
        id: 'treatment_antibiotics_helpful',
        category: 'treatments',
        type: 'scale',
        questionText: 'עד כמה הטיפול באנטיביוטיקה היה יעיל?',
        required: false,
        scaleMin: 0,
        scaleMax: 5,
        scaleMinLabel: 'לא יעיל כלל',
        scaleMaxLabel: 'יעיל מאוד',
        dependsOn: {
            questionId: 'treatments_used',
            values: ['antibiotics'],
        },
        ppnEquivalent: 'Q22a',
    }),
    createQuestion({
        id: 'treatment_steroids_helpful',
        category: 'treatments',
        type: 'scale',
        questionText: 'עד כמה הטיפול בסטרואידים היה יעיל?',
        required: false,
        scaleMin: 0,
        scaleMax: 5,
        scaleMinLabel: 'לא יעיל כלל',
        scaleMaxLabel: 'יעיל מאוד',
        dependsOn: {
            questionId: 'treatments_used',
            values: ['steroids'],
        },
        ppnEquivalent: 'Q22b',
    }),
    createQuestion({
        id: 'treatment_ivig_helpful',
        category: 'treatments',
        type: 'scale',
        questionText: 'עד כמה הטיפול ב-IVIG היה יעיל?',
        required: false,
        scaleMin: 0,
        scaleMax: 5,
        scaleMinLabel: 'לא יעיל כלל',
        scaleMaxLabel: 'יעיל מאוד',
        dependsOn: {
            questionId: 'treatments_used',
            values: ['ivig'],
        },
        ppnEquivalent: 'Q22c',
    }),
    createQuestion({
        id: 'treatment_psychiatric_helpful',
        category: 'treatments',
        type: 'scale',
        questionText: 'עד כמה הטיפול התרופתי הפסיכיאטרי היה יעיל?',
        required: false,
        scaleMin: 0,
        scaleMax: 5,
        scaleMinLabel: 'לא יעיל כלל',
        scaleMaxLabel: 'יעיל מאוד',
        dependsOn: {
            questionId: 'treatments_used',
            values: ['ssri', 'other_psychiatric'],
        },
        ppnEquivalent: 'Q22d',
    }),
    createQuestion({
        id: 'treatment_cbt_helpful',
        category: 'treatments',
        type: 'scale',
        questionText: 'עד כמה הטיפול הפסיכולוגי (CBT/ERP) היה יעיל?',
        required: false,
        scaleMin: 0,
        scaleMax: 5,
        scaleMinLabel: 'לא יעיל כלל',
        scaleMaxLabel: 'יעיל מאוד',
        dependsOn: {
            questionId: 'treatments_used',
            values: ['cbt', 'erp', 'therapy'],
        },
        ppnEquivalent: 'Q22e',
    }),
    createQuestion({
        id: 'treatment_most_effective',
        category: 'treatments',
        type: 'single_choice',
        questionText: 'איזה טיפול היה היעיל ביותר?',
        required: false,
        options: [
            { id: 'antibiotics', label: 'אנטיביוטיקה', value: 'antibiotics' },
            { id: 'steroids', label: 'סטרואידים', value: 'steroids' },
            { id: 'ivig', label: 'IVIG', value: 'ivig' },
            { id: 'plasmapheresis', label: 'פלזמפרזיס', value: 'plasmapheresis' },
            { id: 'psychiatric', label: 'טיפול תרופתי פסיכיאטרי', value: 'psychiatric' },
            { id: 'psychological', label: 'טיפול פסיכולוגי', value: 'psychological' },
            { id: 'combination', label: 'שילוב של כמה טיפולים', value: 'combination' },
            { id: 'none', label: 'אף טיפול לא עזר', value: 'none' },
        ],
        ppnEquivalent: 'Q23',
    }),
];

// --------------------------------------------------------------------------
// Category 7: Comorbid Conditions (מצבים נלווים)
// --------------------------------------------------------------------------

const comorbidQuestions: SOCQuestion[] = [
    createQuestion({
        id: 'has_comorbid_conditions',
        category: 'comorbid_conditions',
        type: 'yes_no',
        questionText: 'האם יש לילד/ה מצבים רפואיים נוספים?',
        required: true,
        ppnEquivalent: 'Q24',
    }),
    createQuestion({
        id: 'comorbid_conditions',
        category: 'comorbid_conditions',
        type: 'multiple_choice',
        questionText: 'אילו מצבים נוספים? (ניתן לבחור מספר תשובות)',
        required: false,
        options: [
            { id: 'adhd', label: 'ADHD', value: 'adhd' },
            { id: 'autism', label: 'אוטיזם / ASD', value: 'autism' },
            { id: 'learning_disability', label: 'לקות למידה', value: 'learning_disability' },
            { id: 'asthma', label: 'אסטמה', value: 'asthma' },
            { id: 'eczema', label: 'אקזמה', value: 'eczema' },
            { id: 'autoimmune', label: 'מחלה אוטואימונית אחרת', value: 'autoimmune' },
            { id: 'thyroid', label: 'בעיות בלוטת התריס', value: 'thyroid' },
            { id: 'gi', label: 'בעיות במערכת העיכול', value: 'gi' },
            { id: 'other', label: 'אחר', value: 'other' },
        ],
        dependsOn: {
            questionId: 'has_comorbid_conditions',
            values: [true, 'true', 'yes'],
        },
        ppnEquivalent: 'Q24a',
    }),
    createQuestion({
        id: 'has_allergies',
        category: 'comorbid_conditions',
        type: 'yes_no',
        questionText: 'האם יש לילד/ה אלרגיות?',
        required: true,
        ppnEquivalent: 'Q25',
    }),
    createQuestion({
        id: 'allergy_types',
        category: 'comorbid_conditions',
        type: 'multiple_choice',
        questionText: 'אילו סוגי אלרגיות?',
        required: false,
        options: [
            { id: 'food', label: 'אלרגיה למזון', value: 'food' },
            { id: 'environmental', label: 'אלרגיה סביבתית (אבק, פרווה)', value: 'environmental' },
            { id: 'seasonal', label: 'אלרגיה עונתית', value: 'seasonal' },
            { id: 'medication', label: 'אלרגיה לתרופות', value: 'medication' },
            { id: 'other', label: 'אחר', value: 'other' },
        ],
        dependsOn: {
            questionId: 'has_allergies',
            values: [true, 'true', 'yes'],
        },
        ppnEquivalent: 'Q25a',
    }),
];

// --------------------------------------------------------------------------
// Category 8: Family Impact (השפעה משפחתית)
// --------------------------------------------------------------------------

const familyImpactQuestions: SOCQuestion[] = [
    createQuestion({
        id: 'medical_professional_support',
        category: 'family_impact',
        type: 'scale',
        questionText: 'עד כמה הרגשתם נתמכים על ידי אנשי המקצוע הרפואיים?',
        required: true,
        scaleMin: 1,
        scaleMax: 5,
        scaleMinLabel: 'לא נתמכים כלל',
        scaleMaxLabel: 'נתמכים מאוד',
        ppnEquivalent: 'Q26',
    }),
    createQuestion({
        id: 'medical_experience',
        category: 'family_impact',
        type: 'single_choice',
        questionText: 'מהי ההתרשמות הכללית מהמפגש עם מערכת הבריאות?',
        required: true,
        options: [
            { id: 'supportive', label: 'מאוד תומכים ומבינים', value: 'supportive' },
            { id: 'tried', label: 'ניסו לעזור אבל לא ידעו מספיק', value: 'tried' },
            { id: 'dismissive', label: 'לא האמינו לנו / דחו אותנו', value: 'dismissive' },
            { id: 'harmful', label: 'גרמו לנו להרגיש "משוגעים"', value: 'harmful' },
            { id: 'mixed', label: 'מעורב - חלק תמכו וחלק לא', value: 'mixed' },
        ],
        ppnEquivalent: 'Q27',
    }),
    createQuestion({
        id: 'financial_impact',
        category: 'family_impact',
        type: 'single_choice',
        questionText: 'מהי ההשפעה הכלכלית על המשפחה?',
        required: true,
        options: [
            { id: 'none', label: 'אין השפעה משמעותית', value: 'none' },
            { id: 'minor', label: 'השפעה קלה', value: 'minor' },
            { id: 'moderate', label: 'השפעה בינונית', value: 'moderate' },
            { id: 'significant', label: 'השפעה משמעותית', value: 'significant' },
            { id: 'severe', label: 'השפעה חמורה מאוד', value: 'severe' },
        ],
        ppnEquivalent: 'Q28',
    }),
    createQuestion({
        id: 'total_spent_estimate',
        category: 'family_impact',
        type: 'single_choice',
        questionText: 'הערכה של סכום ההוצאות הכולל (בשקלים)',
        questionSubtext: ' מאז תחילת המחלה כולל בדיקות, טיפולים, נסיעות, אובדן הכנסה',
        required: false,
        options: [
            { id: 'under_5k', label: 'פחות מ-5,000 ₪', value: 'under_5k' },
            { id: '5k_20k', label: '5,000-20,000 ₪', value: '5k_20k' },
            { id: '20k_50k', label: '20,000-50,000 ₪', value: '20k_50k' },
            { id: '50k_100k', label: '50,000-100,000 ₪', value: '50k_100k' },
            { id: '100k_plus', label: 'יותר מ-100,000 ₪', value: '100k_plus' },
            { id: '200k_plus', label: 'יותר מ-200,000 ₪', value: '200k_plus' },
        ],
        ppnEquivalent: 'Q29',
    }),
    createQuestion({
        id: 'marriage_impact',
        category: 'family_impact',
        type: 'scale',
        questionText: 'עד כמה התסמונת השפיעה על מערכת היחסים הזוגית?',
        required: false,
        scaleMin: 1,
        scaleMax: 5,
        scaleMinLabel: 'לא השפיעה',
        scaleMaxLabel: 'השפיעה מאוד',
        ppnEquivalent: 'Q30',
    }),
    createQuestion({
        id: 'sibling_impact',
        category: 'family_impact',
        type: 'scale',
        questionText: 'עד כמה התסמונת השפיעה על האחים/אחיות?',
        required: false,
        scaleMin: 1,
        scaleMax: 5,
        scaleMinLabel: 'לא השפיעה',
        scaleMaxLabel: 'השפיעה מאוד',
        ppnEquivalent: 'Q31',
    }),
    createQuestion({
        id: 'work_impact',
        category: 'family_impact',
        type: 'single_choice',
        questionText: 'האם התסמונת השפיעה על התעסוקה שלכם?',
        required: true,
        options: [
            { id: 'no_change', label: 'לא השפיעה', value: 'no_change' },
            { id: 'reduced_hours', label: 'הפחתנו שעות עבודה', value: 'reduced_hours' },
            { id: 'changed_job', label: 'החלפנו עבודה', value: 'changed_job' },
            { id: 'quit', label: 'אחד ההורים הפסיק לעבוד', value: 'quit' },
            { id: 'both_affected', label: 'שני ההורים מושפעים', value: 'both_affected' },
            { id: 'both_quit', label: 'שני ההורים לא עובדים', value: 'both_quit' },
        ],
        ppnEquivalent: 'Q32',
    }),
];

// --------------------------------------------------------------------------
// Category 9: Family History (היסטוריה משפחתית)
// --------------------------------------------------------------------------

const familyHistoryQuestions: SOCQuestion[] = [
    createQuestion({
        id: 'parent_history_anxiety',
        category: 'family_history',
        type: 'yes_no',
        questionText: 'האם יש היסטוריה של חרדה במשפחה הגרעינית?',
        required: true,
        ppnEquivalent: 'Q33',
    }),
    createQuestion({
        id: 'parent_history_ocd',
        category: 'family_history',
        type: 'yes_no',
        questionText: 'האם יש היסטוריה של OCD במשפחה הגרעינית?',
        required: true,
        ppnEquivalent: 'Q34',
    }),
    createQuestion({
        id: 'parent_history_autoimmune',
        category: 'family_history',
        type: 'yes_no',
        questionText: 'האם יש היסטוריה של מחלות אוטואימוניות במשפחה המורחבת? (כולל הורים, אחים, סבא/סבתא)',
        required: true,
        ppnEquivalent: 'Q35',
    }),
    createQuestion({
        id: 'family_autoimmune_conditions',
        category: 'family_history',
        type: 'multiple_choice',
        questionText: '(כולל הורים, אחים, סבא/סבתא) אילו מחלות אוטואימוניות קיימות במשפחה?',
        required: false,
        options: [
            { id: 'pans', label: 'פאנס/פאנדס (Pans, Pandas)', value: 'pans' },
            { id: 'thyroid', label: 'מחלות בלוטת התריס (Hashimoto, Graves)', value: 'thyroid' },
            { id: 'rheumatoid', label: 'דלקת מפרקים שגרונית', value: 'rheumatoid' },
            { id: 'lupus', label: 'לופוס', value: 'lupus' },
            { id: 'celiac', label: 'צליאק', value: 'celiac' },
            { id: 'ms', label: 'טרשת נפוצה (MS)', value: 'ms' },
            { id: 'psoriasis', label: 'פסוריאזיס', value: 'psoriasis' },
            { id: 'ibd', label: 'מחלת מעי דלקתית (קרוהן, קוליטיס)', value: 'ibd' },
            { id: 'diabetes_1', label: 'סוכרת סוג 1', value: 'diabetes_1' },
            { id: 'other', label: 'אחר', value: 'other' },
        ],
        dependsOn: {
            questionId: 'parent_history_autoimmune',
            values: [true, 'true', 'yes'],
        },
        ppnEquivalent: 'Q35a',
    }),
    createQuestion({
        id: 'family_psychiatric_history',
        category: 'family_history',
        type: 'multiple_choice',
        questionText: 'אילו מצבים נפשיים קיימים במשפחה המורחבת? (כולל הורים, אחים, סבא/סבתא)',
        required: false,
        options: [
            { id: 'none', label: 'אין', value: 'none' },
            { id: 'depression', label: 'דיכאון', value: 'depression' },
            { id: 'bipolar', label: 'הפרעה דו-קוטבית', value: 'bipolar' },
            { id: 'adhd', label: 'ADHD', value: 'adhd' },
            { id: 'autism', label: 'אוטיזם', value: 'autism' },
            { id: 'tics', label: 'טיקים / טורט', value: 'tics' },
            { id: 'eating', label: 'הפרעות אכילה', value: 'eating' },
            { id: 'other', label: 'אחר', value: 'other' },
        ],
        ppnEquivalent: 'Q36',
    }),
];

// --------------------------------------------------------------------------
// Category 10: Current Status (מצב נוכחי)
// --------------------------------------------------------------------------

const currentStatusQuestions: SOCQuestion[] = [
    createQuestion({
        id: 'current_symptom_level',
        category: 'current_status',
        type: 'scale',
        questionText: 'מה רמת התסמינים הנוכחית?',
        required: true,
        scaleMin: 0,
        scaleMax: 10,
        scaleMinLabel: 'ללא תסמינים',
        scaleMaxLabel: 'תסמינים חמורים מאוד',
        ppnEquivalent: 'Q37',
    }),
    createQuestion({
        id: 'symptoms_remitted',
        category: 'current_status',
        type: 'single_choice',
        questionText: 'האם התסמינים הגיעו לרמה ניתנת לניהול?',
        required: true,
        options: [
            { id: 'full_remission', label: 'כן, הפוגה מלאה', value: 'full_remission' },
            { id: 'mostly_managed', label: 'כן, ברובם ניתנים לניהול', value: 'mostly_managed' },
            { id: 'partially', label: 'חלקית, עדיין יש קשיים', value: 'partially' },
            { id: 'still_struggling', label: 'לא, עדיין מתמודדים עם תסמינים משמעותיים', value: 'still_struggling' },
            { id: 'worsening', label: 'המצב מחמיר', value: 'worsening' },
        ],
        ppnEquivalent: 'Q38',
    }),
    createQuestion({
        id: 'remission_duration',
        category: 'current_status',
        type: 'single_choice',
        questionText: 'אם בהפוגה, כמה זמן נמשכת?',
        required: false,
        options: [
            { id: 'weeks', label: 'מספר שבועות', value: 'weeks' },
            { id: 'months_3', label: '1-3 חודשים', value: 'months_3' },
            { id: 'months_6', label: '3-6 חודשים', value: 'months_6' },
            { id: 'year', label: '6 חודשים עד שנה', value: 'year' },
            { id: 'years', label: 'יותר משנה', value: 'years' },
        ],
        dependsOn: {
            questionId: 'symptoms_remitted',
            values: ['full_remission', 'mostly_managed'],
        },
        ppnEquivalent: 'Q38a',
    }),
    createQuestion({
        id: 'current_treatments',
        category: 'current_status',
        type: 'multiple_choice',
        questionText: 'אילו טיפולים הילד/ה מקבל/ת כיום?',
        required: true,
        options: [
            { id: 'none', label: 'אין טיפול כרגע', value: 'none' },
            { id: 'antibiotics_prophylactic', label: 'אנטיביוטיקה מניעתית', value: 'antibiotics_prophylactic' },
            { id: 'steroids_monthly', label: 'סטרואידים תקופתי', value: 'steroids_monthly' },
            { id: 'psychiatric_meds', label: 'תרופות פסיכיאטריות', value: 'psychiatric_meds' },
            { id: 'therapy', label: 'טיפול פסיכולוגי', value: 'therapy' },
            { id: 'ivig_ongoing', label: 'IVIG תקופתי', value: 'ivig_ongoing' },
            { id: 'supplements', label: 'תוספי תזונה', value: 'supplements' },
            { id: 'alternative', label: 'טיפול אלטרנטיבי', value: 'alternative' },
            { id: 'monitoring', label: 'מעקב בלבד', value: 'monitoring' },
        ],
        ppnEquivalent: 'Q39',
    }),
    createQuestion({
        id: 'school_status',
        category: 'current_status',
        type: 'single_choice',
        questionText: 'מה מצב הילד/ה כיום מבחינת לימודים?',
        required: false,
        options: [
            { id: 'regular_full', label: 'לומד/ת באופן רגיל', value: 'regular_full' },
            { id: 'regular_accommodations', label: 'לומד/ת עם התאמות', value: 'regular_accommodations' },
            { id: 'partial', label: 'לומד/ת חלקית', value: 'partial' },
            { id: 'special_ed', label: 'במסגרת חינוך מיוחד', value: 'special_ed' },
            { id: 'homeschool', label: 'לימודי בית', value: 'homeschool' },
            { id: 'not_attending', label: 'לא לומד/ת כרגע', value: 'not_attending' },
        ],
        ppnEquivalent: 'Q40',
    }),
    createQuestion({
        id: 'outlook_rating',
        category: 'current_status',
        type: 'scale',
        questionText: 'מה רמת האופטימיות שלכם לגבי העתיד?',
        required: true,
        scaleMin: 1,
        scaleMax: 5,
        scaleMinLabel: 'פסימי מאוד',
        scaleMaxLabel: 'אופטימי מאוד',
        ppnEquivalent: 'Q41',
    }),
    createQuestion({
        id: 'בcurrent_rating',
        category: 'current_status',
        type: 'scale',
        questionText: 'מה רמת הקושי היומיומי?',
        required: true,
        scaleMin: 1,
        scaleMax: 5,
        scaleMinLabel: 'לא מורגש',
        scaleMaxLabel: 'קושי משמעותי',
        ppnEquivalent: 'Q42',
    }),
    createQuestion({
        id: 'siblins',
        category: 'current_status',
        type: 'single_choice',
        questionText: 'כמה ילדים במשפחה מאובחנים עם פאנס/פאנדס?',
        required: true,
        options: [
            { id: 'one', label: 'ילד אחד', value: 'one' },
            { id: 'two', label: 'שניים', value: 'two' },
            { id: 'three_more', label: 'שלושה או יותר', value: 'three_more' },
        ],
        ppnEquivalent: 'Q43',
    }),
];

// --------------------------------------------------------------------------
// Category 11: Open Questions (שאלות פתוחות)
// --------------------------------------------------------------------------

const openQuestions: SOCQuestion[] = [
    createQuestion({
        id: 'advice_for_new_parents',
        category: 'current_status',
        type: 'text',
        questionText: 'מה הייתם רוצים לומר להורים שרק עכשיו מתחילים במסע?',
        questionSubtext: 'שתפו עצה, תובנה או מילים מעודדות',
        required: false,
        maxLength: 1000,
        ppnEquivalent: 'Q44',
    }),
    createQuestion({
        id: 'biggest_challenge',
        category: 'current_status',
        type: 'text',
        questionText: 'מה האתגר הגדול ביותר שאתם מתמודדים איתו?',
        required: false,
        maxLength: 500,
        ppnEquivalent: 'Q45',
    }),
    createQuestion({
        id: 'what_helped_most',
        category: 'current_status',
        type: 'text',
        questionText: 'מה עזר לכם הכי הרבה במסע?',
        required: false,
        maxLength: 500,
        ppnEquivalent: 'Q46',
    }),
    createQuestion({
        id: 'additional_comments',
        category: 'current_status',
        type: 'text',
        questionText: 'הערות נוספות',
        questionSubtext: 'כל מידע נוסף שתרצו לשתף',
        required: false,
        maxLength: 1000,
        ppnEquivalent: 'Q47',
    }),
];

// --------------------------------------------------------------------------
// Assemble Categories
// --------------------------------------------------------------------------

export const socCategories: SOCCategory[] = [
    {
        id: 'basic_profile',
        title: 'פרופיל בסיסי',
        description: 'מידע בסיסי על הילד/ה',
        questions: basicProfileQuestions,
        icon: '👤',
    },
    {
        id: 'infection_triggers',
        title: 'גורמי זיהום',
        description: 'מידע על הזיהום או האירוע שגרם להתפרצות',
        questions: infectionTriggersQuestions,
        icon: '🦠',
    },
    {
        id: 'symptoms',
        title: 'תסמינים',
        description: 'דרגו את חומרת התסמינים בשיא המחלה',
        questions: symptomQuestions,
        icon: '📋',
    },
    {
        id: 'illness_course',
        title: 'מהלך המחלה',
        description: 'כיצד המחלה התפתחה לאורך זמן',
        questions: illnessCourseQuestions,
        icon: '📈',
    },
    {
        id: 'diagnosis',
        title: 'אבחון',
        description: 'תהליך האבחון',
        questions: diagnosisQuestions,
        icon: '🔬',
    },
    {
        id: 'treatments',
        title: 'טיפולים',
        description: 'טיפולים שנוסו ויעילותם',
        questions: treatmentQuestions,
        icon: '💊',
    },
    {
        id: 'comorbid_conditions',
        title: 'מצבים נלווים',
        description: 'מצבים רפואיים נוספים',
        questions: comorbidQuestions,
        icon: '🏥',
    },
    {
        id: 'family_impact',
        title: 'השפעה משפחתית',
        description: 'ההשפעה על המשפחה',
        questions: familyImpactQuestions,
        icon: '👨‍👩‍👧‍👦',
    },
    {
        id: 'family_history',
        title: 'היסטוריה משפחתית',
        description: 'היסטוריה רפואית במשפחה',
        questions: familyHistoryQuestions,
        icon: '🧬',
    },
    {
        id: 'current_status',
        title: 'מצב נוכחי',
        description: 'המצב הנוכחי וסיום הסקר',
        questions: [...currentStatusQuestions, ...openQuestions],
        icon: '✨',
    },
];

// --------------------------------------------------------------------------
// Complete Survey Definition
// --------------------------------------------------------------------------

export const socSurveyDefinition: SOCSurveyDefinition = {
    id: SOC_SURVEY_ID,
    slug: SOC_SURVEY_SLUG,
    title: 'סקר מצב ילדינו 2026',
    description: 'סקר מקיף למשפחות ילדים עם PANS/PANDAS בישראל. המידע יסייע להגביר את המודעות ולקדם מחקר בתחום.',
    version: SOC_SURVEY_VERSION,
    isActive: true,
    categories: socCategories,
};

// --------------------------------------------------------------------------
// Helper: Get total question count
// --------------------------------------------------------------------------

export const getTotalQuestionCount = (): number => {
    return socCategories.reduce((total, category) => total + category.questions.length, 0);
};

// --------------------------------------------------------------------------
// Helper: Get flattened questions array
// --------------------------------------------------------------------------

export const getAllQuestions = (): SOCQuestion[] => {
    return socCategories.flatMap(category => category.questions);
};

// --------------------------------------------------------------------------
// Helper: Get question by ID
// --------------------------------------------------------------------------

export const getQuestionById = (questionId: string): SOCQuestion | undefined => {
    return getAllQuestions().find(q => q.id === questionId);
};

// --------------------------------------------------------------------------
// Helper: Get category by ID
// --------------------------------------------------------------------------

export const getCategoryById = (categoryId: string): SOCCategory | undefined => {
    return socCategories.find(c => c.id === categoryId);
};
