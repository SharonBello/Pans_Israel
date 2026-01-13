import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaClipboardList, FaUserDoctor, FaNewspaper, FaQuoteRight } from 'react-icons/fa6';
import './HomeSections.scss';

type SectionLink = {
    id: string;
    title: string;
    description: string;
    to: string;
    Icon: React.ComponentType<{ className?: string }>;
};

const HomeSections: React.FC = (): React.JSX.Element => {
    const sections: SectionLink[] = useMemo((): SectionLink[] => {
        return [
            {
                id: 'symptoms',
                title: 'בדיקת תסמינים ומדדים',
                description: 'איך לבדוק אם ייתכן PANS/PANDAS? מחשבונים ומדדי תסמינים (כעת: מדד אחד, בהמשך עוד שניים).',
                to: '/symptoms',
                Icon: FaClipboardList,
            },
            {
                id: 'medical',
                title: 'רופאים וסיוע רפואי',
                description: 'רשימת מומחים, מרפאות, גורמי טיפול ותמיכה. (נוסיף/נעדכן בהתאם למידע מאומת.)',
                to: '/medical-help',
                Icon: FaUserDoctor,
            },
            {
                id: 'resources',
                title: 'חדשות ואתרים מומלצים',
                description: 'קישורים שימושיים, מאמרים, מחקרים, ואתרים מרכזיים, ועדכונים.',
                to: '/resources',
                Icon: FaNewspaper,
            },
            {
                id: 'testimonials',
                title: 'עדויות מהקהילה',
                description: 'סיפורים אישיים ותובנות מהורים — ניתן לפרסם גם בעילום שם.',
                to: '/testimonials',
                Icon: FaQuoteRight,
            },
        ];
    }, []);

    return (
        <section className="home-sections" dir="rtl" aria-label="ניווט לתכני האתר">
            <div className="home-sections__container">

                <div className="home-sections__grid">
                    {sections.map((s: SectionLink): React.JSX.Element => {
                        return (
                            <Link key={s.id} to={s.to} className="hs-card" aria-label={s.title}>
                                <div className="hs-card__icon">
                                    <s.Icon />
                                </div>

                                <div className="hs-card__content">
                                    <h3 className="hs-card__title">{s.title}</h3>
                                    <p className="hs-card__desc">{s.description}</p>
                                    <span className="hs-card__cta">למעבר לעמוד</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HomeSections;
