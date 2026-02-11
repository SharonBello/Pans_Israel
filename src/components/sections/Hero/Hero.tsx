import { useEffect, useState } from 'react';
// import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
// import type { ISourceOptions } from '@tsparticles/engine';
import { FiArrowLeft } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

import './Hero.scss';
import WhatIsPansPandasModal from '@/components/WhatIsPansPandasModal';

const Hero: React.FC = () => {
  // const [init, setInit] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // useEffect(() => {
  //   initParticlesEngine(async (engine) => {
  //     await loadSlim(engine);
  //   }).then(() => {
  //     setInit(true);
  //   });
  // }, []);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // const particlesOptions: ISourceOptions = {
  //   fullScreen: false,
  //   fpsLimit: 60,
  //   particles: {
  //     number: {
  //       value: 200,
  //       density: {
  //         enable: true,
  //       },
  //     },
  //     color: {
  //       value: "#ffffff",
  //     },
  //     shape: {
  //       type: 'circle',
  //     },
  //     opacity: {
  //       value: 0.5,
  //     },
  //     size: {
  //       value: 30,
  //     },
  //     line_linked: {
  //       enable: true,
  //       distance: 100,
  //       color: "#ffffff",
  //       opacity: 1,
  //       width: 1
  //     },
  //     move: {
  //       enable: true,
  //       speed: 2,
  //       direction: "none",
  //       random: false,
  //       straight: false,
  //       attract: {
  //         enable: false,
  //       }
  //     }
  //   },
  //   interactivity: {
  //     detect_on: "canvas",
  //     events: {
  //       onHover: {
  //         enable: true,
  //         mode: "bubble",
  //         parallax: {
  //           enable: false,
  //           force: 60,
  //           smooth: 10
  //         }
  //       },
  //       onClick: {
  //         enable: true,
  //         mode: "push"
  //       },
  //     },
  //     modes: {
  //       grab: {
  //         distance: 400,
  //         lineLinked: {
  //           opacity: 1
  //         }
  //       },
  //       bubble: {
  //         distance: 400,
  //         size: 100,
  //         duration: 2,
  //         opacity: 1,
  //         speed: 2
  //       },
  //       repulse: {
  //         distance: 200
  //       },
  //       push: {
  //         particles_nb: 4
  //       },
  //       remove: {
  //         particles_nb: 2
  //       }
  //     }
  //   },
  //   backgroundMask: {
  //     enable: true,
  //     cover: {
  //       color: { value: { r: 255, g: 255, b: 255 } },
  //       opacity: 1,
  //     }
  //   },
  //   retina_detect: true,
  //   fps_limit: 30
  // };

  return (
    <>
      <section className="hero">
        {/* Particle Background with Mask */}
        <div className="hero__particles">
          {/* {init && (
            <Particles
              id="neural-particles"
              options={particlesOptions}
            />
          )} */}
          {/* <img src="../../../styles/assets/hero.png" alt="" /> */}
        </div>

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
              אנצפליטיס אוטואימוני של גרעיני הבסיס (Autoimmune Basal Ganglia Encephalitis) הוא מצב פוסט־זיהומי הפוגע בגרעיני הבסיס במוח, וגורם לתסמינים מגוונים, לדוגמא - טיקים, חרדות, ושינויים בהתנהגות. מגובר בתסמונת שמתחילה לרוב במהלך הילדות אולם היא יכולה להתפרץ גם מאוחר יותר.
              פאנדס היא אחת התסמונות הנכללות תחת קבוצה זו, ואינה מוגבלת לזיהום סטרפטוקוקלי בלבד, שכן גם זיהומים אחרים, כולל זיהומים וירליים כגון SARS-CoV-2, עשויים לשמש כטריגר.
            </p>

            {/* <p className="hero__description">
              אתם לא לבד. הצטרפו לקהילת הורים תומכת לילדים עם תסמונות
              <strong> פאנדס </strong>
              ו-
              <strong>פאנס </strong>
              בישראל. מידע, משאבים ותמיכה הדדית.
            </p> */}

            <div className="hero__actions">
              <a
                href="https://wa.me/972544767146"
                className="hero__btn hero__btn--primary"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="דברו איתנו בוואטסאפ"
              >
                <span>דברו איתנו</span>
                <FaWhatsapp />
              </a>

              <button
                onClick={handleOpenModal}
                className="hero__btn hero__btn--secondary"
                type="button"
              >
                <span>מה זה פאנס/פאנדס?</span>
                <FiArrowLeft />
              </button>
            </div>


            {/* <div className="hero__stats">
              <div className="hero__stat">
                <span className="hero__stat-number">1000+</span>
                <span className="hero__stat-label">משפחות בקהילה</span>
              </div>
              <div className="hero__stat-divider" />
              <div className="hero__stat">
                <span className="hero__stat-number">24/7</span>
                <span className="hero__stat-label">תמיכה זמינה</span>
              </div>
              <div className="hero__stat-divider" />
              <div className="hero__stat">
                <span className="hero__stat-number">100%</span>
                <span className="hero__stat-label">התנדבותי</span>
              </div>
            </div> */}
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