import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    FiSun,
    FiMoon,
    FiType,
    FiLink,
    FiEye,
    FiMinus,
    FiPlus,
    FiRotateCcw,
    FiX,
    FiAlignCenter,
} from 'react-icons/fi';
import { MdAccessibility } from 'react-icons/md';
import './AccessibilityBar.scss';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface AccessibilityState {
    fontSize: number; // 0 = default, -2 to +4 steps
    highContrast: boolean;
    grayscale: boolean;
    linkHighlight: boolean;
    readingGuide: boolean;
}

const STORAGE_KEY = 'pans-il-a11y';

const DEFAULT_STATE: AccessibilityState = {
    fontSize: 0,
    highContrast: false,
    grayscale: false,
    linkHighlight: false,
    readingGuide: false,
};

const FONT_STEP = 2; // px per step
const FONT_MIN = -2;
const FONT_MAX = 4;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function loadState(): AccessibilityState {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
    } catch {
        /* ignore */
    }
    return { ...DEFAULT_STATE };
}

function saveState(state: AccessibilityState): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        /* ignore */
    }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
const AccessibilityBar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [state, setState] = useState<AccessibilityState>(loadState);
    const [guideY, setGuideY] = useState(0);
    const panelRef = useRef<HTMLDivElement>(null);

    /* ── Apply classes to <html> whenever state changes ── */
    useEffect(() => {
        const root = document.documentElement;

        // Font size
        const delta = state.fontSize * FONT_STEP;
        root.style.setProperty('--a11y-font-delta', `${delta}px`);
        root.classList.toggle('a11y-font-scaled', state.fontSize !== 0);

        // High contrast
        root.classList.toggle('a11y-high-contrast', state.highContrast);

        // Grayscale
        root.classList.toggle('a11y-grayscale', state.grayscale);

        // Link highlighting
        root.classList.toggle('a11y-link-highlight', state.linkHighlight);

        // Reading guide
        root.classList.toggle('a11y-reading-guide', state.readingGuide);

        saveState(state);
    }, [state]);

    /* ── Reading guide follows the cursor ── */
    useEffect(() => {
        if (!state.readingGuide) return;

        const onMouseMove = (e: MouseEvent) => {
            setGuideY(e.clientY);
        };

        window.addEventListener('mousemove', onMouseMove);
        return () => window.removeEventListener('mousemove', onMouseMove);
    }, [state.readingGuide]);

    /* ── Close panel on outside click ── */
    useEffect(() => {
        if (!isOpen) return;

        const handleClick = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [isOpen]);

    /* ── Close on Escape ── */
    useEffect(() => {
        if (!isOpen) return;

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };

        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen]);

    /* ── Actions ── */
    const changeFontSize = useCallback(
        (direction: 1 | -1) => {
            setState((prev) => ({
                ...prev,
                fontSize: Math.max(FONT_MIN, Math.min(FONT_MAX, prev.fontSize + direction)),
            }));
        },
        []
    );

    const toggle = useCallback((key: keyof Omit<AccessibilityState, 'fontSize'>) => {
        setState((prev) => ({ ...prev, [key]: !prev[key] }));
    }, []);

    const resetAll = useCallback(() => {
        setState({ ...DEFAULT_STATE });
    }, []);

    const hasChanges =
        state.fontSize !== 0 ||
        state.highContrast ||
        state.grayscale ||
        state.linkHighlight ||
        state.readingGuide;

    return (
        <>
            {/* ═══════════ Toggle Button (fixed strip) ═══════════ */}
            <button
                className={`a11y-trigger ${isOpen ? 'a11y-trigger--open' : ''}`}
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="תפריט נגישות"
                aria-expanded={isOpen}
                title="נגישות"
                type="button"
            >
                <MdAccessibility className="a11y-trigger__icon" />
                <span className="a11y-trigger__label">נגישות</span>
            </button>

            {/* ═══════════ Panel ═══════════ */}
            <div
                ref={panelRef}
                className={`a11y-panel ${isOpen ? 'a11y-panel--open' : ''}`}
                role="dialog"
                aria-label="הגדרות נגישות"
                dir="rtl"
            >
                {/* ── Header ── */}
                <div className="a11y-panel__header">
                    <div className="a11y-panel__header-text">
                        <MdAccessibility className="a11y-panel__header-icon" />
                        <h2 className="a11y-panel__title">נגישות</h2>
                    </div>
                    <button
                        className="a11y-panel__close"
                        onClick={() => setIsOpen(false)}
                        aria-label="סגור תפריט נגישות"
                        type="button"
                    >
                        <FiX />
                    </button>
                </div>

                {/* ── Content ── */}
                <div className="a11y-panel__body">
                    {/* Font Size */}
                    <div className="a11y-section">
                        <div className="a11y-section__label">
                            <FiType className="a11y-section__icon" />
                            <span>גודל טקסט</span>
                        </div>
                        <div className="a11y-font-controls">
                            <button
                                className="a11y-font-btn"
                                onClick={() => changeFontSize(-1)}
                                disabled={state.fontSize <= FONT_MIN}
                                aria-label="הקטן טקסט"
                                type="button"
                            >
                                <FiMinus />
                                <span>א</span>
                            </button>

                            <span className="a11y-font-value">
                                {state.fontSize === 0
                                    ? 'רגיל'
                                    : `${state.fontSize > 0 ? '+' : ''}${state.fontSize * FONT_STEP}px`}
                            </span>

                            <button
                                className="a11y-font-btn a11y-font-btn--large"
                                onClick={() => changeFontSize(1)}
                                disabled={state.fontSize >= FONT_MAX}
                                aria-label="הגדל טקסט"
                                type="button"
                            >
                                <FiPlus />
                                <span>א</span>
                            </button>
                        </div>
                    </div>

                    <div className="a11y-panel__divider" />

                    {/* Toggle options */}
                    <div className="a11y-toggles">
                        <button
                            className={`a11y-toggle ${state.highContrast ? 'a11y-toggle--active' : ''}`}
                            onClick={() => toggle('highContrast')}
                            aria-pressed={state.highContrast}
                            type="button"
                        >
                            <span className="a11y-toggle__icon-wrap">
                                {state.highContrast ? <FiMoon /> : <FiSun />}
                            </span>
                            <span className="a11y-toggle__text">ניגודיות גבוהה</span>
                        </button>

                        <button
                            className={`a11y-toggle ${state.grayscale ? 'a11y-toggle--active' : ''}`}
                            onClick={() => toggle('grayscale')}
                            aria-pressed={state.grayscale}
                            type="button"
                        >
                            <span className="a11y-toggle__icon-wrap">
                                <FiEye />
                            </span>
                            <span className="a11y-toggle__text">גווני אפור</span>
                        </button>

                        <button
                            className={`a11y-toggle ${state.linkHighlight ? 'a11y-toggle--active' : ''}`}
                            onClick={() => toggle('linkHighlight')}
                            aria-pressed={state.linkHighlight}
                            type="button"
                        >
                            <span className="a11y-toggle__icon-wrap">
                                <FiLink />
                            </span>
                            <span className="a11y-toggle__text">הדגשת קישורים</span>
                        </button>

                        <button
                            className={`a11y-toggle ${state.readingGuide ? 'a11y-toggle--active' : ''}`}
                            onClick={() => toggle('readingGuide')}
                            aria-pressed={state.readingGuide}
                            type="button"
                        >
                            <span className="a11y-toggle__icon-wrap">
                                <FiAlignCenter />
                            </span>
                            <span className="a11y-toggle__text">סרגל קריאה</span>
                        </button>
                    </div>
                </div>

                {/* ── Footer ── */}
                {hasChanges && (
                    <div className="a11y-panel__footer">
                        <button
                            className="a11y-reset"
                            onClick={resetAll}
                            type="button"
                        >
                            <FiRotateCcw />
                            <span>איפוס הגדרות</span>
                        </button>
                    </div>
                )}
            </div>

            {/* ═══════════ Reading Guide Ruler ═══════════ */}
            {state.readingGuide && (
                <div
                    className="a11y-reading-ruler"
                    style={{ top: `${guideY}px` }}
                    aria-hidden="true"
                />
            )}
        </>
    );
};

export default AccessibilityBar;