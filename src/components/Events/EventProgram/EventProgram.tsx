import React, { useState } from 'react';
import { FiChevronDown, FiList } from 'react-icons/fi';
import type { EventSession, EventSpeaker } from '@/types/event';
import './EventProgram.scss';

interface EventProgramProps {
    program: EventSession[];
    /** Prefix for element ids, e.g. 'event-abc123' — keeps ids unique per card */
    idPrefix: string;
}

// ── helpers (file-private) ───────────────────────────────────────────────────

/** Academic / courtesy titles stripped before taking initials */
const TITLE_RE = /^(פרופ['׳]?|פרופסור|ד["״]ר|דר['׳]?|גב['׳]|מר)\s+/;

/** 'ד״ר רחל שצמן שטוירמן' → 'רש' (first + last name) */
const getInitials = (name: string): string => {
    let rest = name.trim();
    while (TITLE_RE.test(rest)) rest = rest.replace(TITLE_RE, '');
    const words = rest.split(/\s+/).filter(Boolean);
    if (words.length === 0) return '';
    return words.length === 1 ? words[0][0] : `${words[0][0]}${words[words.length - 1][0]}`;
};

/** Bio text → paragraphs (a blank line separates paragraphs) */
const toParagraphs = (text: string): string[] =>
    text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

const countLabel = (n: number, one: string, many: string): string =>
    n === 1 ? `${one} אחד` : `${n} ${many}`;

const timeRange = (s: EventSession): string => (s.endTime ? `${s.startTime}–${s.endTime}` : s.startTime);

// ── speaker ──────────────────────────────────────────────────────────────────

interface SpeakerItemProps {
    speaker: EventSpeaker;
    bioId: string;
}

const SpeakerItem: React.FC<SpeakerItemProps> = ({ speaker, bioId }) => {
    const [open, setOpen] = useState(false);
    const paragraphs = toParagraphs(speaker.bio);
    const hasBio = paragraphs.length > 0;

    const identity = (
        <>
            {speaker.imageUrl ? (
                <img className="event-program__avatar" src={speaker.imageUrl} alt="" loading="lazy" />
            ) : (
                <span className="event-program__avatar" aria-hidden="true">{getInitials(speaker.name)}</span>
            )}
            <span className="event-program__who">
                <span className="event-program__name">{speaker.name}</span>
                {speaker.role && <span className="event-program__role">{speaker.role}</span>}
            </span>
        </>
    );

    return (
        <li className="event-program__speaker">
            {hasBio ? (
                <>
                    <button
                        type="button"
                        className="event-program__speaker-head"
                        aria-expanded={open}
                        aria-controls={bioId}
                        onClick={() => setOpen((o) => !o)}
                    >
                        {identity}
                        <span className="event-program__more">
                            <span className="event-program__more-text">{open ? 'סגירה' : 'על המרצה'}</span>
                            <FiChevronDown
                                aria-hidden="true"
                                className={`event-program__chevron${open ? ' event-program__chevron--open' : ''}`}
                            />
                        </span>
                    </button>
                    <div id={bioId} className="event-program__bio" hidden={!open}>
                        {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                    </div>
                </>
            ) : (
                <div className="event-program__speaker-head event-program__speaker-head--static">{identity}</div>
            )}
        </li>
    );
};

// ── program ──────────────────────────────────────────────────────────────────

/** Collapsible program (agenda) with expandable speaker bios, shown under an event card */
const EventProgram: React.FC<EventProgramProps> = ({ program, idPrefix }) => {
    const [open, setOpen] = useState(false);
    const panelId = `${idPrefix}-program`;

    const speakerNames = new Set(program.flatMap((s) => s.speakers.map((sp) => sp.name)));
    const meta = [
        countLabel(program.length, 'מושב', 'מושבים'),
        speakerNames.size > 0 ? countLabel(speakerNames.size, 'מרצה', 'מרצים') : '',
    ].filter(Boolean).join(' · ');

    return (
        <div className="event-program">
            <button
                type="button"
                className="event-program__toggle"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpen((o) => !o)}
            >
                <span className="event-program__toggle-main">
                    <span className="event-program__toggle-icon" aria-hidden="true"><FiList /></span>
                    <span className="event-program__toggle-text">
                        <span className="event-program__toggle-title">
                            {speakerNames.size > 0 ? 'תוכנית ומרצים' : 'תוכנית האירוע'}
                        </span>
                        <span className="event-program__toggle-meta">{meta}</span>
                    </span>
                </span>
                <span className="event-program__more">
                    <span className="event-program__more-text">{open ? 'סגירה' : 'פתיחה'}</span>
                    <FiChevronDown
                        aria-hidden="true"
                        className={`event-program__chevron${open ? ' event-program__chevron--open' : ''}`}
                    />
                </span>
            </button>

            <div id={panelId} className="event-program__panel" hidden={!open}>
                <ol className="event-program__sessions">
                    {program.map((s) => (
                        <li
                            key={s.id}
                            className={`event-program__session${s.speakers.length ? '' : ' event-program__session--plain'}`}
                        >
                            <span className="event-program__time" dir="ltr">{timeRange(s)}</span>
                            <span className="event-program__rail" aria-hidden="true" />
                            <div className="event-program__body">
                                <h4 className="event-program__title">{s.title}</h4>
                                {s.subtitle && <p className="event-program__subtitle">{s.subtitle}</p>}
                                {s.speakers.length > 0 && (
                                    <ul className="event-program__speakers">
                                        {s.speakers.map((sp) => (
                                            <SpeakerItem key={sp.id} speaker={sp} bioId={`${idPrefix}-bio-${sp.id}`} />
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
};

export default EventProgram;