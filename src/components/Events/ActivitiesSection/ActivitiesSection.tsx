import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EventCard from '@/components/Events/EventCard/EventCard';
import EventRow from '@/components/Events/EventRow/EventRow';
import EventRegistrationModal from '@/components/Events/EventRegistrationModal/EventRegistrationModal';
import { getUpcomingEvents } from '@/services/eventService';
import type { EventItem } from '@/types/event';
import './ActivitiesSection.scss';

interface ActivitiesSectionProps {
    /** 'cards' = full grid (activities page); 'list' = compact rows (home page) */
    variant?: 'cards' | 'list';
}

const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({ variant = 'cards' }) => {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeEvent, setActiveEvent] = useState<EventItem | null>(null);
    const isList = variant === 'list';

    useEffect(() => {
        let cancelled = false;
        getUpcomingEvents()
            .then((data) => { if (!cancelled) setEvents(data); })
            .catch((err) => console.error('getUpcomingEvents failed:', err))
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    // On the home page, hide the whole section when there's nothing to show
    if (!loading && events.length === 0 && isList) return null;

    return (
        <section className={`activities activities--${variant}`} aria-labelledby="activities-title">
            <div className="activities__inner">
                <p className="activities__eyebrow">קהילה ואירועים</p>
                <h2 id="activities-title" className="activities__title">הפעילויות הקרובות שלנו</h2>
                <p className="activities__lead">
                    וובינרים, מפגשים וכנסים לקהילת ההורים ולאנשי המקצוע — הצטרפו אלינו.
                </p>

                {loading ? (
                    <p className="activities__empty">טוען פעילויות…</p>
                ) : events.length === 0 ? (
                    <p className="activities__empty">אין פעילויות מתוכננות כרגע — עקבו אחרינו לעדכונים.</p>
                ) : isList ? (
                    <div className="activities__rows">
                        {events.map((event) => (
                            <EventRow key={event.id} event={event} onRegister={setActiveEvent} />
                        ))}
                    </div>
                ) : (
                    <div className="activities__list">
                        {events.map((event) => (
                            <EventCard key={event.id} event={event} onRegister={setActiveEvent} />
                        ))}
                    </div>
                )}

                {isList && (
                    <Link to="/activities" className="activities__all">לכל האירועים והכנסים ←</Link>
                )}
            </div>

            <EventRegistrationModal
                event={activeEvent}
                open={Boolean(activeEvent)}
                onClose={() => setActiveEvent(null)}
            />
        </section>
    );
};

export default ActivitiesSection;