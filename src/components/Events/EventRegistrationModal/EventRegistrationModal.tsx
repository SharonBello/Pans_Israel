import React, { useState } from 'react';
import { Dialog, DialogContent, IconButton, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import { Close as CloseIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import type { EventItem } from '@/types/event';
import './EventRegistrationModal.scss';

interface EventRegistrationModalProps {
    event: EventItem | null;
    open: boolean;
    onClose: () => void;
}

interface RegistrationFrameProps {
    url: string;
    title: string;
}

/**
 * The form iframe + its loading spinner. It owns the "loaded" flag, so every
 * mount starts from "loading": the Dialog unmounts its content when it closes,
 * and the `key` below remounts it if a different event is opened.
 * (Replaces the old useEffect that reset the flag — setState inside an effect.)
 */
const RegistrationFrame: React.FC<RegistrationFrameProps> = ({ url, title }) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <>
            {!loaded && (
                <div className="event-reg__loading">
                    <CircularProgress size={32} />
                    <span>טוען טופס הרשמה…</span>
                </div>
            )}
            <iframe
                src={url}
                title={title}
                className={`event-reg__frame${loaded ? ' event-reg__frame--visible' : ''}`}
                onLoad={() => setLoaded(true)}
                allow="payment"
            />
        </>
    );
};

const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({ event, open, onClose }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    if (!event?.registrationUrl) return null;

    return (
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
                <RegistrationFrame
                    key={event.id}
                    url={event.registrationUrl}
                    title={`הרשמה: ${event.title}`}
                />
            </DialogContent>
        </Dialog>
    );
};

export default EventRegistrationModal;