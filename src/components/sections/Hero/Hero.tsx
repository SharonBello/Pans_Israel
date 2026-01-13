import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { ISourceOptions } from '@tsparticles/engine';
import { FiArrowLeft } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

import './Hero.scss';

const Hero: React.FC = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesOptions: ISourceOptions = {
    fullScreen: false,
    fpsLimit: 60,
    particles: {
      number: {
        value: 200,
        density: {
          enable: true,
        },
      },
      color: {
        value: "#ffffff",
      },
      shape: {
        type: 'circle',
      },
      opacity: {
        value: 0.5,
      },
      size: {
        value: 30,
      },
      line_linked: {
        enable: true,
        distance: 100,
        color: "#ffffff",
        opacity: 1,
        width: 1
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: false,
        straight: false,
        attract: {
          enable: false,
        }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onHover: {
          enable: true,
          mode: "bubble",
          parallax: {
            enable: false,
            force: 60,
            smooth: 10
          }
        },
        onClick: {
          enable: true,
          mode: "push"
        },
      },
      modes: {
        grab: {
          distance: 400,
          lineLinked: {
            opacity: 1
          }
        },
        bubble: {
          distance: 400,
          size: 100,
          duration: 2,
          opacity: 1,
          speed: 2
        },
        repulse: {
          distance: 200
        },
        push: {
          particles_nb: 4
        },
        remove: {
          particles_nb: 2
        }
      }
    },
    backgroundMask: {
      enable: true,
      cover: {
        color: { value: { r: 255, g: 255, b: 255 } },
        opacity: 1,
      }
    },
    retina_detect: true,
    fps_limit: 30
  };

  return (
    <section className="hero">
      {/* Particle Background with Mask */}
      <div className="hero__particles">
        {init && (
          <Particles
            id="neural-particles"
            options={particlesOptions}
          />
        )}
      </div>

      {/* Overlay */}
      <div className="hero__overlay" />

      {/* Content */}
      <div className="hero__container">
        <div className="hero__content">

          <h1 className="hero__title">
            PANS/PANDAS
            <span className="hero__title-highlight">ישראל</span>
          </h1>

          <p className="hero__description">
            אתם לא לבד. הצטרפו לקהילת הורים תומכת לילדים עם תסמונות
            <strong> PANDAS </strong>
            ו-
            <strong>PANS </strong>
            בישראל. מידע, משאבים ותמיכה הדדית.
          </p>

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

            <a href="#about" className="hero__btn hero__btn--secondary">
              <span>מה זה PANS/PANDAS?</span>
              <FiArrowLeft />
            </a>
          </div>


          <div className="hero__stats">
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
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;