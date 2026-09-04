import React from 'react';
import { FiCalendar, FiMapPin, FiArrowLeft } from 'react-icons/fi';
import type { FeaturedEvent } from '@/data/eventsData';
import './EventCard.scss';

interface EventCardProps {
  event: FeaturedEvent;
  onRegister: (event: FeaturedEvent) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onRegister }) => {
  const d = new Date(event.date);
  const day = d.getDate();
  const month = d.toLocaleDateString('he-IL', { month: 'long' });
  const titleId = `${event.id}-title`;

  return (
    <article className="event-card" aria-labelledby={titleId}>
      <div
        className={`event-card__media${event.image ? ' event-card__media--has-image' : ''}`}
        style={event.image ? ({ '--event-image': `url(${event.image})` } as React.CSSProperties) : undefined}
      >
        {event.image ? (
          <img src={event.image} alt={event.imageAlt ?? ''} loading="lazy" />
        ) : (
          <div className="event-card__date" aria-hidden="true">
            <span className="event-card__day">{day}</span>
            <span className="event-card__month">{month}</span>
          </div>
        )}
        <span className="event-card__badge">{event.badge}</span>
      </div>

      <div className="event-card__body">
        <h3 id={titleId} className="event-card__title">{event.title}</h3>
        <p className="event-card__subtitle">{event.subtitle}</p>

        <ul className="event-card__meta">
          <li>
            <FiCalendar aria-hidden="true" />
            <time dateTime={event.date}>{event.dateLabel}</time>
          </li>
          <li>
            <FiMapPin aria-hidden="true" />
            <span>{event.location}</span>
          </li>
        </ul>

        <p className="event-card__desc">{event.description}</p>

        {event.registrationUrl ? (
          <button type="button" className="event-card__btn" onClick={() => onRegister(event)}>
            <span>{event.registrationLabel ?? 'להרשמה'}</span>
            <FiArrowLeft aria-hidden="true" />
          </button>
        ) : (
          <span className="event-card__btn event-card__btn--disabled" aria-disabled="true">
            ההרשמה תיפתח בקרוב
          </span>
        )}
      </div>
    </article>
  );
};

export default EventCard;