import React from 'react';
import { FaHeart, FaUsers, FaHandHoldingHeart, FaLightbulb, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { FiTarget, FiEye } from 'react-icons/fi';
import './AboutPage.scss';

// Founder data
interface Founder {
    name: string;
    role: string;
    description: string;
    image?: string;
    imagePosition?: string;
    imageScale?: number;
}

const founders: Founder[] = [
    {
        name: 'שרון בלו',
        role: 'מייסדת שותפה',
        description: 'אמא לשלושה ילדים עם פאנס/פאנדס. פעילה למען הגברת המודעות והנגשת מידע להורים בישראל.',
        image: '../../../public/images/sharon_pic.jpg',
        // imagePosition: 'center 10%',
        imageScale: 1.3,
    },
    {
        name: 'אורלי בר טל',
        role: 'מייסדת שותפה',
        description: 'אמא לילד עם פאנס/פאנדס. עוסקת במחקר קליני ובקישור לאנשי מקצוע בתחום.',
    },
    {
        name: 'קרין אהרון',
        role: 'מייסדת שותפה',
        description: 'אמא לילד עם פאנס/פאנדס. מובילה את פעילות הקהילה והתמיכה ההדדית בין ההורים.',
    },
    {
        name: 'אושר ברכה קסלסי',
        role: 'מייסדת שותפה',
        description: 'מרצה על פאנס/פאנדס במכללות ובבית ספר. מטפלת cbt שמתמחה בפאנס/פאנדס',
        image: '../../../public/images/osher_pic.jpeg',
        imagePosition: 'center 20%',
        imageScale: 1,
    },
];

// Values data
interface Value {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const values: Value[] = [
    {
        icon: <FaHandHoldingHeart />,
        title: 'תמיכה הדדית',
        description: 'אנחנו מאמינות שאף הורה לא צריך לעבור את המסע הזה לבד. הקהילה שלנו מבוססת על עזרה הדדית, הקשבה ושיתוף.',
    },
    {
        icon: <FaLightbulb />,
        title: 'הנגשת מידע',
        description: 'אנחנו מחויבות להנגיש מידע מבוסס מחקר בעברית, ולעזור להורים להבין את האפשרויות העומדות בפניהם.',
    },
    {
        icon: <FaUsers />,
        title: 'בניית קהילה',
        description: 'אנחנו בונות רשת של הורים, אנשי מקצוע ומומחים שעובדים יחד למען ילדינו.',
    },
    {
        icon: <FiEye />,
        title: 'הגברת מודעות',
        description: 'אנחנו פועלות להגביר את המודעות לתסמונות בקרב הציבור הרחב, אנשי חינוך ומערכת הבריאות בישראל.',
    },
];

const AboutPage: React.FC = () => {
    return (
        <div className="about-page" dir="rtl">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="about-hero__container">
                    <h1 className="about-hero__title">אודות</h1>
                    <p className="about-hero__subtitle">
                        קהילת הורים לילדים עם פאנס/פאנדס בישראל
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="about-section about-mission">
                <div className="about-section__container">
                    <div className="about-mission__content">
                        <div className="about-mission__text">
                            <div className="section-label">
                                <FiTarget />
                                <span>המשימה שלנו</span>
                            </div>
                            <h2 className="about-section__title">
                                לתמוך, להנגיש ולחבר
                            </h2>
                            <p className="about-section__text">
                                קהילת פאנס/פאנדס ישראל הוקמה כדי לתת מענה להורים שמתמודדים עם אבחנה
                                מבלבלת ולעיתים מפחידה. אנחנו כאן כדי לספק מידע מהימן בעברית,
                                לחבר בין משפחות שעוברות חוויות דומות, ולהוות גשר בין ההורים
                                לאנשי המקצוע בישראל.
                            </p>
                            <p className="about-section__text">
                                המטרה שלנו היא שאף הורה לא ירגיש לבד במסע הזה, ושכל ילד יקבל
                                את האבחון והטיפול הנכונים בזמן.
                            </p>
                        </div>
                        <div className="about-mission__visual">
                            <div className="about-mission__card">
                                <FaHeart className="about-mission__icon" />
                                <span className="about-mission__stat">100%</span>
                                <span className="about-mission__stat-label">התנדבותי</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="about-section about-story">
                <div className="about-section__container">
                    <div className="section-label section-label--center">
                        <FaHeart />
                        <span>הסיפור שלנו</span>
                    </div>
                    <h2 className="about-section__title about-section__title--center">
                        איך הכל התחיל
                    </h2>

                    <div className="about-story__content">
                        <div className="about-story__card">
                            <p>
                                כמו הורים רבים, גם אנחנו עברנו את המסע המתיש של חיפוש תשובות.
                                ילדינו השתנו בין לילה — התנהגויות מפחידות, חרדות קיצוניות,
                                טיקים ותסמינים שלא הצלחנו להסביר. עברנו מרופא לרופא,
                                מאבחנה לאבחנה, עד שהגענו לתשובה: פאנס/פאנדס.
                            </p>
                            <p>
                                גילינו שאנחנו לא לבד. יש עוד משפחות בישראל שעוברות את אותו הדבר,
                                אבל המידע בעברית היה דל, והקשר בין המשפחות — כמעט לא קיים.
                            </p>
                            <p>
                                <strong>החלטנו לשנות את זה.</strong>
                            </p>
                            <p>
                                הקמנו את הקהילה הזו כדי להיות המקום שהיינו צריכות כשהתחלנו.
                                מקום של מידע, תמיכה, והבנה. מקום שבו אפשר לשאול שאלות,
                                לקבל חיבוק וירטואלי, ולדעת שמישהו מבין.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="about-section about-values">
                <div className="about-section__container">
                    <div className="section-label section-label--center">
                        <FiTarget />
                        <span>הערכים שלנו</span>
                    </div>
                    <h2 className="about-section__title about-section__title--center">
                        מה מנחה אותנו
                    </h2>

                    <div className="about-values__grid">
                        {values.map((value, index) => (
                            <div key={index} className="about-values__card">
                                <div className="about-values__icon">
                                    {value.icon}
                                </div>
                                <h3 className="about-values__card-title">{value.title}</h3>
                                <p className="about-values__card-text">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Founders Section */}
            <section className="about-section about-founders">
                <div className="about-section__container">
                    <div className="section-label section-label--center">
                        <FaUsers />
                        <span>הצוות שלנו</span>
                    </div>
                    <h2 className="about-section__title about-section__title--center">
                        המייסדות
                    </h2>
                    <p className="about-section__subtitle">
                        ארבע אמהות שהחליטו לעשות שינוי
                    </p>

                    <div className="about-founders__grid">
                        {founders.map((founder, index) => (
                            <div key={index} className="about-founders__card">
                                <div className="about-founders__avatar-wrapper">
                                    {founder.image ? (
                                        <img
                                            src={founder.image}
                                            className="about-founders__avatar"
                                            style={{
                                                objectPosition: founder.imagePosition || 'center',
                                                transform: `scale(${founder.imageScale || 1})`,
                                            }} alt={founder.name}
                                        />
                                    ) : (
                                        <div className="about-founders__avatar about-founders__avatar--placeholder">
                                            {founder.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <h3 className="about-founders__name">{founder.name}</h3>
                                <span className="about-founders__role">{founder.role}</span>
                                <p className="about-founders__bio">{founder.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vision Section */}
            <section className="about-section about-vision">
                <div className="about-section__container">
                    <div className="about-vision__content">
                        <div className="section-label">
                            <FiEye />
                            <span>החזון שלנו</span>
                        </div>
                        <h2 className="about-section__title">לאן אנחנו שואפות</h2>

                        <ul className="about-vision__list">
                            <li>
                                <span className="about-vision__bullet" />
                                <span>שכל רופא ילדים בישראל יכיר את התסמונות ויידע לזהות אותן</span>
                            </li>
                            <li>
                                <span className="about-vision__bullet" />
                                <span>שמערכת הבריאות תכיר בתסמונות ותספק טיפול מתאים</span>
                            </li>
                            <li>
                                <span className="about-vision__bullet" />
                                <span>שאף משפחה לא תעבור את המסע הזה לבד</span>
                            </li>
                            <li>
                                <span className="about-vision__bullet" />
                                <span>שמידע מהימן ומבוסס מחקר יהיה נגיש בעברית לכל הורה</span>
                            </li>
                            <li>
                                <span className="about-vision__bullet" />
                                <span>שמערכת החינוך תדע להתאים את עצמה לצרכי הילדים</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="about-section about-cta">
                <div className="about-section__container">
                    <div className="about-cta__content">
                        <h2 className="about-cta__title">רוצים להצטרף אלינו?</h2>
                        <p className="about-cta__text">
                            אנחנו תמיד שמחות לקבל הורים חדשים לקהילה, ומחפשות מתנדבים
                            שרוצים לעזור להגדיל את ההשפעה שלנו.
                        </p>

                        <div className="about-cta__buttons">
                            <a
                                className="info-page__cta-button info-page__cta-button--primary"
                                href="https://www.facebook.com/groups/PandasIsrael/?ref=share&mibextid=NSMWBT"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                הצטרפו לקהילה
                            </a>
                            <a
                                href="https://wa.me/972544767146"
                                className="about-cta__btn about-cta__btn--primary"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaWhatsapp />
                                <span>צרו קשר</span>
                            </a>

                        </div>
                    </div>
                </div>
            </section>

            {/* Partners Section (Placeholder) */}
            <section className="about-section about-partners">
                <div className="about-section__container">
                    <h3 className="about-partners__title">בשיתוף פעולה עם</h3>
                    <div className="about-partners__logos">
                        <a
                            href="https://pandasnetwork.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="about-partners__logo"
                        >
                            PANDAS Network
                        </a>
                        <a
                            href="https://panspandasuk.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="about-partners__logo"
                        >
                            PANS PANDAS UK
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
