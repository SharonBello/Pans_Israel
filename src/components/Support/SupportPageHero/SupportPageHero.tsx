import React from 'react';
import './SupportPageHero.scss';

interface SupportPageHeroProps {
    icon: React.ReactElement;
    label?: string;
    title: string;
    subtitle?: string;
    /** Optional element rendered under the subtitle (e.g. a CTA button) */
    action?: React.ReactNode;
}

const SupportPageHero: React.FC<SupportPageHeroProps> = ({
    icon,
    label = 'תמיכה וקהילה',
    title,
    subtitle,
    action,
}) => (
    <header className="support-hero">
        <div className="support-hero__inner">
            <div className="support-hero__icon-wrap">{icon}</div>
            <span className="support-hero__label">{label}</span>
            <h1 className="support-hero__title">{title}</h1>
            {subtitle && <p className="support-hero__subtitle">{subtitle}</p>}
            {action}
        </div>
    </header>
);

export default SupportPageHero;