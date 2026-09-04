import React from 'react';
import { FiArrowLeft, FiMapPin, FiClock } from 'react-icons/fi';
import type { FeaturedEvent } from '@/data/eventsData';
import './EventRow.scss';

interface EventRowProps {
    event: FeaturedEvent;
    onRegister: (event: FeaturedEvent) => void;
}

const DEFAULT_ACCENT = '#4a90d9';

const EventRow: React.FC<EventRowProps> = ({ event, onRegister }) => {
    const d = new Date(event.date);
    const day = d.getDate();
    const month = d.toLocaleDateString('he-IL', { month: 'long' });
    const year = d.getFullYear();
    const time = event.dateLabel.includes('·') ? event.dateLabel.split('·')[1].trim() : null;
    const titleId = `${event.id}-row-title`;

    return (
        <article
            className="event-row"
            aria-labelledby={titleId}
            style={{ '--row-accent': event.accent ?? DEFAULT_ACCENT } as React.CSSProperties}
        >
            <div className="event-row__date" aria-hidden="true">
                <span className="event-row__day">{day}</span>
                <span className="event-row__month">ב{month}</span>
                <span className="event-row__year">{year}</span>
            </div>

            <div className="event-row__text">
                <div className="event-row__meta">
                    <span className="event-row__tag">{event.badge}</span>
                    {time && (
                        <span className="event-row__meta-item">
                            <FiClock aria-hidden="true" />
                            {time}
                        </span>
                    )}
                    <span className="event-row__meta-item">
                        <FiMapPin aria-hidden="true" />
                        {event.location}
                    </span>
                </div>
                <h3 id={titleId} className="event-row__title">{event.title}</h3>
                <p className="event-row__desc">{event.description}</p>
            </div>

            <div className="event-row__cta">
                {event.registrationUrl ? (
                    <button type="button" className="event-row__btn" onClick={() => onRegister(event)}>
                        <span>{event.registrationLabel ?? 'להרשמה'}</span>
                        <FiArrowLeft aria-hidden="true" />
                    </button>
                ) : (
                    <span className="event-row__btn event-row__btn--secondary" aria-disabled="true">
                        ההרשמה תיפתח בקרוב
                    </span>
                )}
            </div>
        </article>
    );
};

export default EventRow;