import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, IconButton, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import { Close as CloseIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import type { FeaturedEvent } from '@/data/eventsData';
import './EventRegistrationModal.scss';

interface EventRegistrationModalProps {
    event: FeaturedEvent | null;
    open: boolean;
    onClose: () => void;
}

const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({ event, open, onClose }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [loaded, setLoaded] = useState(false);

    // reset loading state whenever a different event opens
    useEffect(() => {
        if (open) setLoaded(false);
    }, [open, event?.id]);

    if (!event?.registrationUrl) return null;

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                fullScreen={fullScreen}
                maxWidth={false}
                fullWidth
                dir="rtl"
                disableEnforceFocus
                aria-labelledby="event-registration-title"
                className="event-reg"
            >
                <div className="event-reg__header">
                    <h2 id="event-registration-title" className="event-reg__title">{event.title}</h2>
                    <div className="event-reg__actions">
                        <a
                            href={event.registrationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="event-reg__external"
                            title="פתיחה בחלון חדש"
                        >
                            <OpenInNewIcon fontSize="small" />
                            <span>לא נטען? פתחו בחלון חדש</span>
                        </a>
                        <IconButton onClick={onClose} aria-label="סגירה" size="small">
                            <CloseIcon />
                        </IconButton>
                    </div>
                </div>
                <DialogContent className="event-reg__body">
                    {!loaded && (
                        <div className="event-reg__loading">
                            <CircularProgress size={32} />
                            <span>טוען טופס הרשמה…</span>
                        </div>
                    )}
                    <iframe
                        src={event.registrationUrl}
                        title={`הרשמה: ${event.title}`}
                        className={`event-reg__frame${loaded ? ' event-reg__frame--visible' : ''}`}
                        onLoad={() => setLoaded(true)}
                        allow="payment" />
                </DialogContent>
            </Dialog>
        </>

    );
};

export default EventRegistrationModal;