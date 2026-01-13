import React from 'react';
import type { Professional } from '../../../types/professionals';
import './ProfessionalCard.scss';

// Icons as simple SVG components
const PhoneIcon: React.FC = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const EmailIcon: React.FC = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const WebsiteIcon: React.FC = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

const LocationIcon: React.FC = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const CheckIcon: React.FC = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const XIcon: React.FC = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

interface ProfessionalCardProps {
    professional: Professional;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional }) => {
    const {
        name,
        field,
        location,
        phone,
        email,
        website,
        address,
        description,
        acceptingNewPatients,
    } = professional;

    const handlePhoneClick = () => {
        if (phone) {
            window.open(`tel:${phone}`, '_self');
        }
    };

    const handleEmailClick = () => {
        if (email) {
            window.open(`mailto:${email}`, '_blank');
        }
    };

    const handleWebsiteClick = () => {
        if (website) {
            window.open(website, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <article className="professional-card">
            <div className="professional-card__header">
                <div className="professional-card__avatar">
                    {name.charAt(0)}
                </div>
                <div className="professional-card__title-section">
                    <h3 className="professional-card__name">{name}</h3>
                    <span className="professional-card__field">{field}</span>
                </div>
            </div>

            <div className="professional-card__location">
                <LocationIcon />
                <span>{location}</span>
                {address && <span className="professional-card__address">• {address}</span>}
            </div>

            {description && (
                <p className="professional-card__description">{description}</p>
            )}

            <div className="professional-card__status">
                {acceptingNewPatients !== undefined && (
                    <span className={`professional-card__availability ${acceptingNewPatients ? 'available' : 'unavailable'}`}>
                        {acceptingNewPatients ? <CheckIcon /> : <XIcon />}
                        {acceptingNewPatients ? 'מקבל/ת מטופלים חדשים' : 'לא מקבל/ת מטופלים חדשים'}
                    </span>
                )}
            </div>

            <div className="professional-card__actions">
                {phone && (
                    <button
                        className="professional-card__action-btn phone"
                        onClick={handlePhoneClick}
                        aria-label={`התקשר ל${name}`}
                    >
                        <PhoneIcon />
                        <span>{phone}</span>
                    </button>
                )}
                {email && (
                    <button
                        className="professional-card__action-btn email"
                        onClick={handleEmailClick}
                        aria-label={`שלח אימייל ל${name}`}
                    >
                        <EmailIcon />
                        <span>אימייל</span>
                    </button>
                )}
                {website && (
                    <button
                        className="professional-card__action-btn website"
                        onClick={handleWebsiteClick}
                        aria-label={`בקר באתר של ${name}`}
                    >
                        <WebsiteIcon />
                        <span>אתר</span>
                    </button>
                )}
            </div>
        </article>
    );
};

export default ProfessionalCard;