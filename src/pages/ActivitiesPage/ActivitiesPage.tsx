import React, { useEffect, useMemo, useState } from 'react';
import { Event as EventIcon } from '@mui/icons-material';
import SupportPageHero from '@/components/Support/SupportPageHero/SupportPageHero';
import SupportTabs from '@/components/Support/SupportTabs/SupportTabs';
import EventCard from '@/components/Events/EventCard/EventCard';
import EventRegistrationModal from '@/components/Events/EventRegistrationModal/EventRegistrationModal';
import PosterLightbox from '@/components/Events/PosterLightbox/PosterLightbox';
import { getPublishedEvents } from '@/services/eventService';
import { splitEventsByDate } from '@/utils/eventDisplay';
import type { EventItem } from '@/types/event';
import './ActivitiesPage.scss';

/** Past events shown at first, and added per "show more" click */
const PAST_PAGE_SIZE = 6;

type LoadStatus = 'loading' | 'ready' | 'error';

const upcomingCountLabel = (n: number): string =>
    n === 1 ? 'אירוע אחד מתוכנן' : `${n} אירועים מתוכננים`;

const ActivitiesPage: React.FC = (): React.JSX.Element => {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [status, setStatus] = useState<LoadStatus>('loading');
    const [reloadKey, setReloadKey] = useState(0);
    const [pastVisible, setPastVisible] = useState(PAST_PAGE_SIZE);
    const [registering, setRegistering] = useState<EventItem | null>(null);
    const [viewingPoster, setViewingPoster] = useState<EventItem | null>(null);

    useEffect(() => {
        let cancelled = false;
        getPublishedEvents()
            .then((data) => {
                if (cancelled) return;
                setEvents(data);
                setStatus('ready');
            })
            .catch((err) => {
                console.error('getPublishedEvents failed:', err);
                if (!cancelled) setStatus('error');
            });
        return () => { cancelled = true; };
    }, [reloadKey]);

    const retry = () => {
        setStatus('loading');
        setReloadKey((k) => k + 1);
    };

    const { upcoming, past } = useMemo(() => splitEventsByDate(events), [events]);

    return (
        <div className="activities-page" dir="rtl">
            <SupportPageHero
                icon={<EventIcon />}
                title="פעילויות ואירועים"
                subtitle="וובינרים, מפגשים, הרצאות וכנסים לקהילת ההורים ולאנשי המקצוע — הצטרפו אלינו."
            />

            <SupportTabs />

            <div className="activities-page__container">
                {status === 'loading' && (
                    <p className="activities-page__status" role="status">טוען פעילויות…</p>
                )}

                {status === 'error' && (
                    <div className="activities-page__status" role="alert">
                        <p>לא הצלחנו לטעון את הפעילויות.</p>
                        <button type="button" className="activities-page__btn" onClick={retry}>נסו שוב</button>
                    </div>
                )}

                {status === 'ready' && (
                    <>
                        {/* ── Upcoming ── */}
                        <section className="activities-page__section" aria-labelledby="upcoming-title">
                            <header className="activities-page__head">
                                <div>
                                    <p className="activities-page__eyebrow">קהילה ואירועים</p>
                                    <h2 id="upcoming-title" className="activities-page__title">אירועים קרובים</h2>
                                </div>
                                {upcoming.length > 0 && (
                                    <p className="activities-page__count">{upcomingCountLabel(upcoming.length)}</p>
                                )}
                            </header>

                            {upcoming.length > 0 ? (
                                <div className="activities-page__list">
                                    {upcoming.map((event) => (
                                        <EventCard
                                            key={event.id}
                                            event={event}
                                            onRegister={setRegistering}
                                            onViewPoster={setViewingPoster}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="activities-page__status">
                                    אין פעילויות מתוכננות כרגע — עקבו אחרינו לעדכונים.
                                </p>
                            )}
                        </section>

                        {/* ── Past ── */}
                        {past.length > 0 && (
                            <section className="activities-page__section activities-page__section--past" aria-labelledby="past-title">
                                <header className="activities-page__head">
                                    <div>
                                        <h2 id="past-title" className="activities-page__title activities-page__title--sub">
                                            אירועים שהתקיימו
                                        </h2>
                                        <p className="activities-page__lead">
                                            הכנסים, הוובינרים והמפגשים שכבר קיימנו — עם ההזמנות והמרצים.
                                        </p>
                                    </div>
                                </header>

                                <div className="activities-page__list">
                                    {past.slice(0, pastVisible).map((event) => (
                                        <EventCard key={event.id} event={event} past onViewPoster={setViewingPoster} />
                                    ))}
                                </div>

                                {past.length > pastVisible && (
                                    <button
                                        type="button"
                                        className="activities-page__btn activities-page__btn--more"
                                        onClick={() => setPastVisible((n) => n + PAST_PAGE_SIZE)}
                                    >
                                        הצגת אירועים נוספים ({past.length - pastVisible})
                                    </button>
                                )}
                            </section>
                        )}
                    </>
                )}
            </div>

            <EventRegistrationModal
                event={registering}
                open={Boolean(registering)}
                onClose={() => setRegistering(null)}
            />

            <PosterLightbox
                event={viewingPoster}
                open={Boolean(viewingPoster)}
                onClose={() => setViewingPoster(null)}
            />
        </div>
    );
};

export default ActivitiesPage;