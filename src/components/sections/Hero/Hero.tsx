import { useState } from 'react';

import './Hero.scss';
import WhatIsPansPandasModal from '@/components/WhatIsPansPandasModal';

import { FiUsers, FiTrendingUp, FiCalendar } from 'react-icons/fi';

type HeroStat = {
  id: string;
  value: string;
  label: string;
  subLabel?: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const heroStats: HeroStat[] = [
  {
    id: 'community',
    value: '1000+',
    label: 'משפחות בקהילה',
    // subLabel: 'תמיכה, ניסיון וחיבורים',
    Icon: FiUsers,
  },
  {
    id: 'incidence',
    value: '100%',
    label: 'התנדבותי',
    // subLabel: 'אומדן ממחקר Primary Care',
    Icon: FiTrendingUp,
  },
  {
    id: 'age',
    value: '3–14',
    label: 'גיל הופעה אופייני',
    // subLabel: 'אפשר גם מאוחר יותר',
    Icon: FiCalendar,
  },
];

const Hero: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <section className="hero">
        <div className="hero__particles"></div>

        {/* Overlay */}
        <div className="hero__overlay" />

        {/* Content */}
        <div className="hero__container">
          <div className="hero__content">

            <h1 className="hero__title">
              פאנס/פאנדס ישראל
              <span className="hero__title-highlight">העמותה הישראלית לאנצפליטיס אוטואימוני</span>
            </h1>
            <p className="hero__description">
              <strong>אנצפליטיס אוטואימוני של גרעיני הבסיס</strong>{" "}
              (Autoimmune Basal Ganglia Encephalitis) הוא מצב פוסט־זיהומי הפוגע בגרעיני הבסיס במוח.
              <br />
              הוא עלול לגרום לתסמינים כמו <strong>טיקים</strong>, <strong>חרדות</strong> ו־<strong>שינויים בהתנהגות</strong>.
              <br />
              לרוב מדובר בתסמונת שמתחילה בילדות, אך היא יכולה להתפרץ גם מאוחר יותר.
              <br />
              <strong>פאנדס (PANDAS)</strong> היא אחת התסמונות בקבוצה זו, ואינה מוגבלת לזיהום סטרפטוקוקלי בלבד —
              גם זיהומים אחרים, כולל ויראליים כגון <strong>SARS-CoV-2</strong>, עשויים לשמש כטריגר ואז תאובחן כתמסמונת <strong>פאנס (PANS)</strong>.
            </p>

            {/* Stats */}
            <div className="hero__stats" role="list" aria-label="נתונים מרכזיים">
              {heroStats.map((stat: HeroStat) => (
                <div key={stat.id} className="hero__statCard" role="listitem">
                  {/* <div className="hero__statIconWrap" aria-hidden="true">
                    <stat.Icon className="hero__statIcon" />
                  </div> */}

                  <div className="hero__statText">
                    <div className="hero__statTopRow">
                      <span className="hero__statNumber">{stat.value}</span>
                      <span className="hero__statLabel">{stat.label}</span>
                    </div>

                    {stat.subLabel ? (
                      <span className="hero__statSubLabel">{stat.subLabel}</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
{/* 
            <p className="hero__statsNote">
              * השכיחות היא אומדן שנתי ממחקרי מרפאות בגילאי 3–12; ייתכנו הבדלים בין אזורים ואוכלוסיות.
            </p> */}
          </div>
        </div>

      </section>

      {/* What Is פאנס/פאנדס Modal */}
      <WhatIsPansPandasModal
        open={modalOpen}
        onClose={handleCloseModal}
      />
    </>

  );
};

export default Hero;