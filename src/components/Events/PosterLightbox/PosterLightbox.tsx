import React, { useState } from 'react';
import { Dialog } from '@mui/material';
import { FiExternalLink, FiX } from 'react-icons/fi';
import type { EventItem } from '@/types/event';
import { cloudinaryImage } from '@/utils/cloudinary';
import './PosterLightbox.scss';

interface PosterLightboxProps {
    event: EventItem | null;
    open: boolean;
    onClose: () => void;
}

/** Posters taller than this (height ÷ width) scroll; shorter ones fit the screen */
const TALL_POSTER_RATIO = 1.5;

interface PosterImageProps {
    src: string;
    alt: string;
    onBackgroundClick: () => void;
}

/**
 * Owns the "is this a tall poster" flag, so it starts fresh for each poster
 * (remounted via `key`). Square/landscape invites fit the screen; a long
 * program poster shows at full width and scrolls.
 */
const PosterImage: React.FC<PosterImageProps> = ({ src, alt, onBackgroundClick }) => {
    const [tall, setTall] = useState(false);

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        setTall(naturalWidth > 0 && naturalHeight / naturalWidth > TALL_POSTER_RATIO);
    };

    return (
        <div
            className="poster-lightbox__stage"
            onClick={(e) => { if (e.target === e.currentTarget) onBackgroundClick(); }}
        >
            <img
                src={src}
                alt={alt}
                className={`poster-lightbox__image${tall ? '' : ' poster-lightbox__image--fit'}`}
                onLoad={handleLoad}
            />
        </div>
    );
};

const PosterLightbox: React.FC<PosterLightboxProps> = ({ event, open, onClose }) => {
    if (!event?.imageUrl) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen
            dir="rtl"
            aria-labelledby="poster-lightbox-title"
            className="poster-lightbox"
        >
            <div className="poster-lightbox__header">
                <div className="poster-lightbox__heading">
                    <span className="poster-lightbox__label">הזמנה</span>
                    <h2 id="poster-lightbox-title" className="poster-lightbox__title">{event.title}</h2>
                </div>
                <div className="poster-lightbox__actions">
                    <a
                        href={event.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="poster-lightbox__action"
                        aria-label="פתיחת ההזמנה בחלון חדש"
                    >
                        <FiExternalLink aria-hidden="true" />
                        <span className="poster-lightbox__action-text">פתיחה בחלון חדש</span>
                    </a>
                    <button
                        type="button"
                        className="poster-lightbox__action poster-lightbox__action--close"
                        onClick={onClose}
                        aria-label="סגירה"
                    >
                        <FiX aria-hidden="true" />
                    </button>
                </div>
            </div>

            <PosterImage
                key={event.id}
                src={cloudinaryImage(event.imageUrl)} // full size, best format + compression
                alt={event.imageAlt || `הזמנה: ${event.title}`}
                onBackgroundClick={onClose}
            />
        </Dialog>
    );
};

export default PosterLightbox;