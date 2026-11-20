import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiClock, FiChevronLeft } from 'react-icons/fi';
import type { EventItem } from '@/types/event';
import { eventAnchorId } from '@/types/event';
import { getEventTimeLabel } from '@/utils/eventDisplay';
import './EventRow.scss';

interface EventRowProps {
    event: EventItem;
    onRegister: (event: EventItem) => void;
}

const EventRow: React.FC<EventRowProps> = ({ event, onRegister }) => {
    const d = new Date(`${event.date}T00:00:00`);
    const day = d.getDate();
    const month = d.toLocaleDateString('he-IL', { month: 'long' });
    const year = d.getFullYear();
    const titleId = `${event.id}-row-title`;
    const timeLabel = getEventTimeLabel(event);
    const detailsLabel = event.program?.length ? 'לפרטים ולתוכנית' : 'לפרטים נוספים';

    return (
        <article
            className="event-row"
            aria-labelledby={titleId}
            style={{ '--row-accent': event.accent || '#4a90d9' } as React.CSSProperties}
        >
            <div className="event-row__date" aria-hidden="true">
                <span className="event-row__day">{day}</span>
                <span className="event-row__month">ב{month}</span>
                <span className="event-row__year">{year}</span>
            </div>

            <div className="event-row__text">
                <div className="event-row__meta">
                    {event.badge && <span className="event-row__tag">{event.badge}</span>}
                    {timeLabel && (
                        <span className="event-row__meta-item">
                            <FiClock aria-hidden="true" />
                            <span dir="ltr">{timeLabel}</span>
                        </span>
                    )}
                    <span className="event-row__meta-item">
                        <FiMapPin aria-hidden="true" />
                        {event.location}
                    </span>
                </div>
                <h3 id={titleId} className="event-row__title">
                    {/* Stretched link: the whole row opens this event on the activities page */}
                    <Link
                        to={{ pathname: '/activities', hash: eventAnchorId(event.id) }}
                        className="event-row__link"
                    >
                        {event.title}
                    </Link>
                </h3>
                <p className="event-row__desc">{event.description}</p>
            </div>

            <div className="event-row__cta">
                {event.registrationUrl ? (
                    <button type="button" className="event-row__btn" onClick={() => onRegister(event)}>
                        <span>{event.registrationLabel || 'להרשמה'}</span>
                        <FiArrowLeft aria-hidden="true" />
                    </button>
                ) : (
                    <span className="event-row__btn event-row__btn--secondary" aria-disabled="true">
                        ההרשמה תיפתח בקרוב
                    </span>
                )}
                {/* Visible cue that the row opens the event (taps pass through to the title link) */}
                <span className="event-row__details" aria-hidden="true">
                    {detailsLabel}
                    <FiChevronLeft />
                </span>
            </div>
        </article>
    );
};

export default EventRow;