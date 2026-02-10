import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaClipboardList,
    FaUserDoctor,
    FaNewspaper,
    FaQuoteRight,
    FaChartBar,
} from 'react-icons/fa6';
import { FiArrowLeft } from 'react-icons/fi';
import './HomeSections.scss';
import FAQAccordion from '@/components/faq/FAQAccordion/FAQAccordion';
import { FAQ_ITEMS } from '@/data/faqData';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type SectionLink = {
    id: string;
    title: string;
    description: string;
    to: string;
    Icon: React.ComponentType<{ className?: string }>;
    image: string; // path inside /public/images/home/
    accent: string; // overlay accent colour
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
const HomeSections: React.FC = (): React.JSX.Element => {
    const navigate = useNavigate();

    /* ---------- section card data ---------- */
    const sections: SectionLink[] = useMemo((): SectionLink[] => {
        return [
            {
                id: 'symptoms',
                title: 'בדיקת תסמינים ומדדים',
                description:
                    'איך לבדוק אם ייתכן PANS/PANDAS? מחשבונים ומדדי תסמינים.',
                to: '/symptoms',
                Icon: FaClipboardList,
                image: '/images/home/symptoms.jpg',
                accent: '#4A90D9',
            },
            {
                id: 'medical',
                title: 'רופאים וסיוע רפואי',
                description: 'רשימת מומחים, מרפאות, גורמי טיפול ותמיכה.',
                to: '/Professionals-help',
                Icon: FaUserDoctor,
                image: '/images/home/medical.jpg',
                accent: '#5B9A8B',
            },
            {
                id: 'resources',
                title: 'חדשות ואתרים מומלצים',
                description:
                    'קישורים שימושיים, מאמרים, מחקרים, ואתרים מרכזיים, ועדכונים.',
                to: '/resources',
                Icon: FaNewspaper,
                image: '/images/home/resources.jpg',
                accent: '#8B6FB0',
            },
            {
                id: 'testimonials',
                title: 'עדויות מהקהילה',
                description:
                    'סיפורים אישיים ותובנות מהורים — ניתן לפרסם גם בעילום שם.',
                to: '/testimonials',
                Icon: FaQuoteRight,
                image: '/images/home/testimonials.jpg',
                accent: '#E67E22',
            },
        ];
    }, []);

    return (
        <section className="home-sections" dir="rtl" aria-label="ניווט לתכני האתר">
            <div className="home-sections__container">

                {/* ═══════════════ Survey CTA Banner ═══════════════ */}
                <div className="survey-banner" role="banner">
                    <div className="survey-banner__glow" aria-hidden="true" />

                    <div className="survey-banner__content">
                        <div className="survey-banner__text">
                            {/* <span className="survey-banner__badge">חדש</span> */}
                            <h2 className="survey-banner__title">סקר מצב ילדינו 2026</h2>
                            <p className="survey-banner__desc">
                                סקר מקיף למשפחות ילדים עם PANS/PANDAS בישראל. השתתפותכם חשובה
                                לנו — המידע יסייע להגביר את המודעות ולקדם מחקר בתחום.
                            </p>
                        </div>

                        <div className="survey-banner__actions">
                            <button
                                type="button"
                                className="survey-banner__btn survey-banner__btn--primary"
                                onClick={() => navigate('/surveys/state-of-children')}
                            >
                                <span>מלאו את הסקר</span>
                                <FiArrowLeft />
                            </button>
                            <button
                                type="button"
                                className="survey-banner__btn survey-banner__btn--secondary"
                                onClick={() => navigate('/surveys/state-of-children/results')}
                            >
                                <FaChartBar />
                                <span>צפו בתוצאות</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ═══════════════ Section Cards Grid ═══════════════ */}
                <div className="home-sections__grid">
                    {sections.map((s: SectionLink): React.JSX.Element => {
                        return (
                            <Link
                                key={s.id}
                                to={s.to}
                                className={`hs-card hs-card--${s.id}`}
                                aria-label={s.title}
                                style={{ '--card-accent': s.accent } as React.CSSProperties}
                            >
                                {/* Background image */}
                                <div
                                    className="hs-card__bg"
                                    style={{ backgroundImage: `url(${s.image})` }}
                                    aria-hidden="true"
                                />

                                {/* Gradient overlay */}
                                <div className="hs-card__overlay" aria-hidden="true" />

                                {/* Content */}
                                <div className="hs-card__content">
                                    <div className="hs-card__icon-wrapper">
                                        <s.Icon className="hs-card__icon" />
                                    </div>
                                    <h3 className="hs-card__title">{s.title}</h3>
                                    <p className="hs-card__desc">{s.description}</p>
                                    <span className="hs-card__link-hint">
                                        <FiArrowLeft />
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Visual separation */}
                <div className="home-sections__divider" aria-hidden="true" />

                {/* FAQ */}
                <div className="home-sections__faq">
                    <FAQAccordion items={FAQ_ITEMS} />
                </div>
            </div>
        </section>
    );
};

export default HomeSections;