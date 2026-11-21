import React, { useId } from 'react';
import { Link } from 'react-router-dom';
import './CommunityCta.scss';

export interface CommunityCtaAction {
    label: string;
    /** Internal route, e.g. '/join' */
    to?: string;
    /** External link — opens in a new tab */
    href?: string;
}

interface CommunityCtaProps {
    icon: React.ReactElement;
    title: string;
    text: string;
    primary: CommunityCtaAction;
    secondary?: CommunityCtaAction;
    /** Adds the page padding and max width — for use directly on a page (home) */
    inset?: boolean;
    className?: string;
}

const NEW_TAB_NOTE = ' (נפתח בחלון חדש)';

const ActionLink: React.FC<{ action: CommunityCtaAction; variant: 'primary' | 'secondary' }> = ({ action, variant }) => {
    const className = `community-cta__btn community-cta__btn--${variant}`;
    if (action.href) {
        return (
            <a
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
                aria-label={action.label + NEW_TAB_NOTE}
            >
                {action.label}
            </a>
        );
    }
    return (
        <Link to={action.to ?? '/'} className={className}>
            {action.label}
        </Link>
    );
};

/** Purple community call-to-action card — "join the community", "parents' group", etc. */
const CommunityCta: React.FC<CommunityCtaProps> = ({ icon, title, text, primary, secondary, inset = false, className }) => {
    const titleId = useId();
    const classes = ['community-cta', inset && 'community-cta--inset', className].filter(Boolean).join(' ');

    return (
        <section className={classes} aria-labelledby={titleId}>
            <div className="community-cta__card">
                <span className="community-cta__icon" aria-hidden="true">{icon}</span>
                <div className="community-cta__body">
                    <h2 id={titleId} className="community-cta__title">{title}</h2>
                    <p className="community-cta__text">{text}</p>
                </div>
                <div className="community-cta__actions">
                    <ActionLink action={primary} variant="primary" />
                    {secondary && <ActionLink action={secondary} variant="secondary" />}
                </div>
            </div>
        </section>
    );
};

export default CommunityCta;