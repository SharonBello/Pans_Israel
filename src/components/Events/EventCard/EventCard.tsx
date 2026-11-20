import React from 'react';
import { FiCalendar, FiClock, FiMapPin, FiArrowLeft, FiZoomIn } from 'react-icons/fi';
import type { EventItem } from '@/types/event';
import { FORMAT_LABELS, eventAnchorId } from '@/types/event';
import { getEventDateParts, getEventTimeLabel } from '@/utils/eventDisplay';
import EventProgram from '@/components/Events/EventProgram/EventProgram';
import './EventCard.scss';

interface EventCardProps {
  event: EventItem;
  /** Past events render as a compact archive card, without description or registration */
  past?: boolean;
  onRegister?: (event: EventItem) => void;
  /** When set, the poster becomes a button that opens the full invite */
  onViewPoster?: (event: EventItem) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, past = false, onRegister, onViewPoster }) => {
  const anchorId = eventAnchorId(event.id);
  const titleId = `${anchorId}-title`;
  const date = getEventDateParts(event.date);
  const timeLabel = getEventTimeLabel(event);
  const accentStyle = { '--card-accent': event.accent || '#4a90d9' } as React.CSSProperties;

  return (
    <article
      id={anchorId}
      className={`event-card${past ? ' event-card--past' : ''}`}
      aria-labelledby={titleId}
      style={accentStyle}
    >
      <div className="event-card__main">
        {/* ── Poster (opens the full invite), or a date tile when there is none ── */}
        {event.imageUrl ? (
          onViewPoster ? (
            <button
              type="button"
              className="event-card__media event-card__media--zoomable"
              onClick={() => onViewPoster(event)}
              aria-label={`הגדלת ההזמנה: ${event.title}`}
            >
              <img src={event.imageUrl} alt="" loading="lazy" decoding="async" />
              <span className="event-card__zoom" aria-hidden="true">
                <FiZoomIn />
                <span className="event-card__zoom-text">הגדלת ההזמנה</span>
              </span>
            </button>
          ) : (
            <div className="event-card__media">
              <img
                src={event.imageUrl}
                alt={event.imageAlt || `הזמנה: ${event.title}`}
                loading="lazy"
                decoding="async"
              />
            </div>
          )
        ) : (
          <div className="event-card__date-tile" aria-hidden="true">
            <span className="event-card__weekday">{date.weekday}</span>
            <span className="event-card__day">{date.day}</span>
            <span className="event-card__month">ב{date.month}</span>
            <span className="event-card__year">{date.year}</span>
          </div>
        )}

        {/* ── Details ── */}
        <div className="event-card__body">
          <div className="event-card__chips">
            {past ? (
              <span className="event-card__chip event-card__chip--muted">התקיים</span>
            ) : (
              event.badge && <span className="event-card__chip event-card__chip--accent">{event.badge}</span>
            )}
            <span className="event-card__chip">{FORMAT_LABELS[event.format] ?? event.format}</span>
          </div>

          <div>
            <h3 id={titleId} className="event-card__title">{event.title}</h3>
            {event.subtitle && <p className="event-card__subtitle">{event.subtitle}</p>}
          </div>

          <dl className="event-card__facts">
            <div className="event-card__fact">
              <span className="event-card__fact-icon" aria-hidden="true"><FiCalendar /></span>
              <div>
                <dt>תאריך</dt>
                <dd><time dateTime={event.date}>{date.long}</time></dd>
              </div>
            </div>
            {timeLabel && (
              <div className="event-card__fact">
                <span className="event-card__fact-icon" aria-hidden="true"><FiClock /></span>
                <div>
                  <dt>{timeLabel.includes('–') ? 'שעות' : 'שעה'}</dt>
                  <dd><span dir="ltr">{timeLabel}</span></dd>
                </div>
              </div>
            )}
            <div className="event-card__fact">
              <span className="event-card__fact-icon" aria-hidden="true"><FiMapPin /></span>
              <div>
                <dt>מיקום</dt>
                <dd>{event.location}</dd>
              </div>
            </div>
          </dl>

          {!past && event.description && <p className="event-card__desc">{event.description}</p>}

          {!past && (
            <div className="event-card__actions">
              {event.registrationUrl && onRegister ? (
                <button type="button" className="event-card__btn" onClick={() => onRegister(event)}>
                  <span>{event.registrationLabel || 'להרשמה'}</span>
                  <FiArrowLeft aria-hidden="true" />
                </button>
              ) : (
                <span className="event-card__btn event-card__btn--disabled">ההרשמה תיפתח בקרוב</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Program & speaker bios (only when the event has one) ── */}
      {event.program && event.program.length > 0 && (
        <EventProgram program={event.program} idPrefix={anchorId} />
      )}
    </article>
  );
};

export default EventCard;