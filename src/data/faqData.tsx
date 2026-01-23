import React from 'react';

export type FAQItem = {
    id: string;
    question: string;
    answer: string | React.ReactNode;
};

// Recommended Tests Component (rich content)
const RecommendedTestsAnswer: React.FC = () => (
    <div className="faq-tests">
        <p className="faq-tests__intro">
            האבחנה של PANDAS ו-PANS היא אבחנה קלינית המבוססת על איסוף סימנים, תסמינים,
            היסטוריה רפואית וממצאי מעבדה שלא ניתן להסבירם על ידי הפרעות נוירולוגיות או רפואיות אחרות.
            נכון להיום, <strong>אין בדיקה אחת שמאשרת את האבחנה ב-100%</strong>.
        </p>

        <div className="faq-tests__section">
            <h4 className="faq-tests__section-title">בדיקות דם בסיסיות:</h4>
            <ul className="faq-tests__list">
                <li>IgE</li>
                <li>IgA</li>
                <li>IgM</li>
                <li>IgG (subclass 1, 2, 3, 4)</li>
                <li>CBC (ספירת דם מלאה)</li>
                <li>ANA</li>
                <li>Ferritin (פריטין)</li>
                <li>B-12</li>
                <li>Vitamin D (ויטמין D)</li>
            </ul>
        </div>

        <div className="faq-tests__section">
            <h4 className="faq-tests__section-title">בדיקות לזיהומים ויראליים/חיידקיים:</h4>
            <ul className="faq-tests__list">
                <li>תרבית גרון לסטרפטוקוק (48 שעות או תרבית פריאנלית)</li>
                <li>Antistreptolysin O (ASO)</li>
                <li>Anti DNase B</li>
                <li>Streptozyme</li>
                <li>Mycoplasma Pneumoniae IgA &amp; IgM</li>
                <li>מחלת ליים וזיהומים נלווים</li>
                <li>Pneumococcal Antibody Titers</li>
                <li>Epstein Barr Virus Panel</li>
                <li>Coxsackie A &amp; B Titers</li>
                <li>HHV-6 Titers</li>
            </ul>
        </div>

        <div className="faq-tests__section">
            <h4 className="faq-tests__section-title">בדיקות נוספות:</h4>
            <ul className="faq-tests__list">
                <li>
                    <strong>Cunningham Panel</strong> (רמות נוגדנים עצמיים):
                    <ul className="faq-tests__sublist">
                        <li>Dopamine D1 receptor</li>
                        <li>Dopamine D2L receptor</li>
                        <li>Lysoganglioside GM1</li>
                        <li>Tubulin</li>
                        <li>CaM Kinase II</li>
                    </ul>
                </li>
            </ul>
        </div>

        <p className="faq-tests__note">
            אם אתם חושדים שלילדכם יש PANDAS או PANS, בנוסף לבדיקות המעבדה המפורטות למעלה,
            מילוי שאלוני התסמינים יכול לסייע לרופא המטפל באבחון נכון.
        </p>

        <p className="faq-tests__disclaimer">
            * המידע מבוסס על המלצות{' '}
            <a href="https://pandasnetwork.org" target="_blank" rel="noopener noreferrer">
                PANDAS Physicians Network (PPN)
            </a>{' '}
            ואינו מהווה ייעוץ רפואי. יש להתייעץ עם רופא מומחה לפני ביצוע בדיקות.
        </p>
    </div>
);

export const FAQ_ITEMS: FAQItem[] = [
    {
        id: 'what-is-pans-pandas',
        question: 'מה זה PANS/PANDAS בקצרה?',
        answer:
            'אלו תסמונות שבהן מופיעים בפתאומיות תסמינים כמו OCD/חרדה/טיקים ושינויים התנהגותיים, לעיתים לאחר זיהום. חשוב לבצע הערכה רפואית ולשקול אבחנה מבדלת.',
    },
    {
        id: 'recommended-tests',
        question: 'אילו בדיקות מומלצות לאבחון?',
        answer: <RecommendedTestsAnswer />,
    },
    {
        id: 'who-diagnoses',
        question: 'מי מאבחן ואיך מתחילים תהליך?',
        answer:
            'לרוב מתחילים אצל רופא ילדים/משפחה ומשם להפניה לרופא מומחה (נוירולוג/אימונולוג/פסיכיאטר ילדים בהתאם למקרה). מומלץ להגיע עם תיעוד תסמינים והיסטוריה של זיהומים.',
    },
    {
        id: 'school-support',
        question: 'מה אפשר לבקש מבית הספר בזמן החמרה?',
        answer:
            'התאמות זמניות כמו הפחתת עומס, הארכת זמן במבחנים, יציאה להפסקות קצרות, הקלות בהגשת משימות, ותקשורת רציפה עם המחנכת/יועצת.',
    },
    {
        id: 'anonymous-testimonial',
        question: 'אפשר לשתף עדות בעילום שם?',
        answer:
            'כן. בעמוד העדויות ניתן לשלוח עדות בעילום שם. לפני פרסום מתבצעת בדיקה להסרת פרטים מזהים.',
    },
];