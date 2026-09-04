import React from 'react';
import { FiCalendar, FiMapPin, FiArrowLeft } from 'react-icons/fi';
import type { EventItem } from '@/types/event';
import { formatEventDateLabel } from '@/types/event';
import './EventCard.scss';

interface EventCardProps {
  event: EventItem;
  onRegister: (event: EventItem) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onRegister }) => {
  const d = new Date(`${event.date}T00:00:00`);
  const day = d.getDate();
  const month = d.toLocaleDateString('he-IL', { month: 'long' });
  const titleId = `${event.id}-title`;

  return (
    <article className="event-card" aria-labelledby={titleId}>
      <div className={`event-card__media${event.imageUrl ? ' event-card__media--has-image' : ''}`}>
        {event.imageUrl ? (
          <img src={event.imageUrl} alt={event.imageAlt ?? ''} loading="lazy" />
        ) : (
          <div className="event-card__date" aria-hidden="true">
            <span className="event-card__day">{day}</span>
            <span className="event-card__month">{month}</span>
          </div>
        )}
        {event.badge && <span className="event-card__badge">{event.badge}</span>}
      </div>

      <div className="event-card__body">
        <h3 id={titleId} className="event-card__title">{event.title}</h3>
        {event.subtitle && <p className="event-card__subtitle">{event.subtitle}</p>}

        <ul className="event-card__meta">
          <li>
            <FiCalendar aria-hidden="true" />
            <time dateTime={event.date}>{formatEventDateLabel(event.date, event.time)}</time>
          </li>
          <li>
            <FiMapPin aria-hidden="true" />
            <span>{event.location}</span>
          </li>
        </ul>

        <p className="event-card__desc">{event.description}</p>

        {event.registrationUrl ? (
          <button type="button" className="event-card__btn" onClick={() => onRegister(event)}>
            <span>{event.registrationLabel || 'להרשמה'}</span>
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