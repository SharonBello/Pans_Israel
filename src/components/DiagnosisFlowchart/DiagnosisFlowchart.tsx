import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { nodes } from './FlowData/FlowData';
import { typeLabel } from './FlowType';
import { ComorbidSymptomBox } from './ComorbidSymptomBox/ComorbidSymptomBox';
import { SeverityScaleBar } from './SeverityScaleBar/SeverityScaleBar';
import './DiagnosisFlowchart.scss';

// ─────────────────────────────────────────────
// FOOTNOTES — shown only on start node
// ─────────────────────────────────────────────
const Footnotes: React.FC = () => (
    <div className="df-fn">
        <p>
            ¹ כישלון אנטיביוטי עלול להתרחש עם כל אנטיביוטיקה.
            שיעור כישלון הפניצילין בסטרפטוקוק הוא ~30%.
            אם מטופל המקבל אנטיביוטיקה מניעתית מפתח תסמינים מחדש — יש לשקול
            פריצת סטרפטוקוק למרות הטיפול.
        </p>
        <p>
            ² מינון נוגדי דלקת לא-סטרואידיים (NSAIDs): ראו{' '}
            <a
                href="https://doi.org/10.1089/cap.2016.0148"
                target="_blank"
                rel="noopener noreferrer"
                className="df-fn-link"
            >
                Liebertpub doi:10.1089/cap.2016.0148
            </a>
            , נספח A1. מומלץ להוסיף מעכבי משאבת פרוטון (PPI, כגון אומפרזול)
            לאורך כל משך הטיפול למניעת נזק לקיבה.
        </p>
        <p>
            ³ לפני מרשם לסטרואידים לטווח ארוך — יש לשלול שחפת, מחלת ליים,
            זיהומי טפילים וזיהומים פטרייתיים.
        </p>
        <p>
            ⁴ CaM Kinase II — Chain JL et al., Front. Psychiatry 2020.{' '}
            <a
                href="https://www.moleculera.com"
                target="_blank"
                rel="noopener noreferrer"
                className="df-fn-link"
            >
                moleculera.com
            </a>{' '}
            |{' '}
            <a
                href="https://www.pandasppn.org/flowchart"
                target="_blank"
                rel="noopener noreferrer"
                className="df-fn-link"
            >
                עץ ההחלטות המקורי של PPN ↗
            </a>{' '}
            | PPN ©2025
        </p>
        {/* ── DISCLAIMER ──────────────────────────── */}
        <div className="df-disc">
            {/* <span style={{ fontSize: 15, flexShrink: 0 }}>⚕️</span> */}
            <span>
                <strong>הערה חשובה:</strong> כלי זה מסייע בהנחיה קלינית בלבד ואינו מהווה
                הנחיה מחייבת. כל אבחון וטיפול יבוצעו על ידי ספק שירותי בריאות מוסמך.
                ההמלצות מבוססות על הנחיות{' '}
                <a
                    href="https://www.pandasppn.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="df-disc-link"
                >
                    PANDAS Physicians Network (PPN) ©2025
                </a>.
            </span>
        </div>
    </div>
);

// ─────────────────────────────────────────────
// LEGEND — shown only on start node
// ─────────────────────────────────────────────
// const Legend: React.FC = () => (
//     <div className="df-legend">
//         <span className="df-legend__label">מקרא:</span>
//         {[
//             { c: '#023373', l: 'שאלה / הערכה' },
//             { c: '#FF9800', l: 'מקרה קל' },
//             { c: '#FF5722', l: 'מקרה בינוני' },
//             { c: '#F44336', l: 'מקרה חמור' },
//             { c: '#4CAF50', l: 'שיפור / חיובי' },
//             { c: '#FFC107', l: 'אזהרה' },
//         ].map(({ c, l }) => (
//             <div key={l} className="df-leg">
//                 <div className="df-leg-dot" style={{ background: c }} />
//                 <span>{l}</span>
//             </div>
//         ))}
//         <a
//             href="https://www.pandasppn.org/flowchart"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="df-legend__ppn-link"
//         >
//             <OpenInNewIcon style={{ fontSize: 13 }} />
//             עץ ההחלטות המקורי
//         </a>
//     </div>
// );

// ─────────────────────────────────────────────
// INNER FLOWCHART — rendered inside modal
// ─────────────────────────────────────────────
interface FlowchartInnerProps { onClose: () => void; }

const FlowchartInner: React.FC<FlowchartInnerProps> = ({ onClose }) => {
    const [currentId, setCurrentId] = useState<string>('start');
    const [history, setHistory] = useState<string[]>([]);
    const modalRef = useRef<HTMLDivElement>(null);
    const node = nodes[currentId];

    const scrollToTop = () =>
        setTimeout(() => modalRef.current?.scrollTo({ top: 0, behavior: 'smooth' }), 40);

    const navigate = useCallback((nextId: string) => {
        setHistory(h => [...h, currentId]);
        setCurrentId(nextId);
        scrollToTop();
    }, [currentId]);

    // ✅ Clickable breadcrumb — jump to any previous step
    const jumpTo = useCallback((targetId: string, targetIndex: number) => {
        // Slice history up to (not including) the target step
        setHistory(h => h.slice(0, targetIndex));
        setCurrentId(targetId);
        scrollToTop();
    }, []);

    const goBack = useCallback(() => {
        if (!history.length) return;
        setCurrentId(history[history.length - 1]);
        setHistory(h => h.slice(0, -1));
        scrollToTop();
    }, [history]);

    const reset = useCallback(() => {
        setHistory([]);
        setCurrentId('start');
        scrollToTop();
    }, []);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    if (!node) return null;

    const isStart = currentId === 'start';
    const cardCls = `df-card${node.severity ? ` sv-${node.severity}` : ''}`;

    // Build breadcrumb entries — show last 5 history items max
    const bcEntries = history.slice(-5).map((id, localIdx) => {
        // Compute the actual index in full history array
        const actualIdx = history.length > 5
            ? history.length - 5 + localIdx
            : localIdx;
        return { id, actualIdx };
    });

    return (
        <div
            className="df-backdrop"
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="df-modal"
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-label="עץ ההחלטות פאנס / פאנדס"
                dir="rtl"
            >
                {/* ── HEADER ──────────────────────────────────── */}
                <div className="df-mheader">
                    <div className="df-mlogo">🧠</div>
                    <div style={{ flex: 1 }}>
                        <div className="df-mtitle">עץ ההחלטות פאנס / פאנדס</div>
                        <div className="df-msub">
                            כלי אינטראקטיבי לאבחון וטיפול | מבוסס הנחיות PPN | לאנשי מקצוע רפואיים בלבד
                        </div>
                    </div>
                    <button className="df-mclose" onClick={onClose} aria-label="סגור">
                        <CloseIcon style={{ fontSize: 18 }} />
                    </button>
                </div>

                <div className="df-mbody">
                    {/* ── BREADCRUMB — clickable ───────────────── */}
                    {!isStart && (
                        <div className="df-bc">
                            {/* "Start" always clickable → full reset */}
                            <button className="df-bc-btn df-bc-btn--home" onClick={reset}>
                                🏠 כניסה
                            </button>

                            {bcEntries.map(({ id, actualIdx }) => {
                                const title = nodes[id]?.title ?? id;
                                // Strip leading emoji/icon word for brevity
                                const shortTitle = title.replace(/^[^\s]+\s/, '').slice(0, 24);
                                return (
                                    <React.Fragment key={`${id}-${actualIdx}`}>
                                        <span className="df-bc-sep">/</span>
                                        <button
                                            className="df-bc-btn"
                                            onClick={() => jumpTo(id, actualIdx)}
                                            title={title}
                                        >
                                            {shortTitle}{title.length > 25 ? '…' : ''}
                                        </button>
                                    </React.Fragment>
                                );
                            })}

                            {/* Current step — not clickable, just label */}
                            <span className="df-bc-sep">/</span>
                            <span className="df-bc-current">
                                {node.title.replace(/^[^\s]+\s/, '').slice(0, 24)}
                                {node.title.length > 25 ? '…' : ''}
                            </span>
                        </div>
                    )}

                    {/* ── CARD ────────────────────────────────── */}
                    <div className="df-content">
                        <div className={cardCls}>

                            <div className={`df-badge b-${node.type}`}>
                                {typeLabel[node.type]}
                            </div>

                            <h2 className="df-title">{node.title}</h2>

                            {node.content && (
                                <p className="df-body-text">{node.content}</p>
                            )}

                            {node.notes?.length ? (
                                <ul className="df-notes">
                                    {node.notes.map((n, i) => <li key={i}>{n}</li>)}
                                </ul>
                            ) : null}

                            {node.actions?.length ? (
                                <ol className="df-actions">
                                    {node.actions.map((a, i) => <li key={i}>{a}</li>)}
                                </ol>
                            ) : null}

                            {node.showComorbidBox && <ComorbidSymptomBox />}
                            {node.showSeverityScale && <SeverityScaleBar />}

                            <div className="df-opts">
                                {node.options?.length ? (
                                    node.options.map((opt, i) => (
                                        <button
                                            key={i}
                                            className={`df-opt${opt.color ? ` c-${opt.color}` : ''}`}
                                            onClick={() => navigate(opt.nextId)}
                                        >
                                            <span>{opt.label}</span>
                                            <span className="df-opt-arr">◄</span>
                                        </button>
                                    ))
                                ) : (
                                    <button className="df-opt c-green" onClick={reset}>
                                        <span>↺ התחל הערכה חדשה מההתחלה</span>
                                        <span className="df-opt-arr">◄</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Back / Reset controls — not on start */}
                        {!isStart && (
                            <div className="df-ctrl">
                                <button className="df-ctrlbtn" onClick={goBack}>
                                    <ArrowForwardIcon style={{ fontSize: 14 }} />
                                    חזרה לשלב הקודם
                                </button>
                                <button className="df-ctrlbtn" onClick={reset}>
                                    <RestartAltIcon style={{ fontSize: 14 }} />
                                    אתחל מחדש
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ── LEGEND + FOOTNOTES — only on start node ── */}
                    {isStart && (
                        <>
                            {/* <Legend /> */}
                            <Footnotes />
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────
// EXPORTED COMPONENT — trigger button + modal
// ─────────────────────────────────────────────
const DiagnosisFlowchart: React.FC = () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    return (
        <>
            <div className="df-trigger-wrap">
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<AccountTreeIcon />}
                    onClick={() => setOpen(true)}
                    sx={{
                        background: 'linear-gradient(135deg, #023373 0%, #6CA6D9 100%)',
                        color: '#FFFFFF',
                        fontFamily: '"Rubik", "Segoe UI", sans-serif',
                        fontWeight: 700,
                        fontSize: '15px',
                        padding: '12px 32px',
                        borderRadius: '12px',
                        textTransform: 'none',
                        letterSpacing: '0.01em',
                        boxShadow: '0 4px 16px rgba(2, 51, 115, 0.28)',
                        transition: 'all 0.25s ease',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #012b60 0%, #5a9acc 100%)',
                            boxShadow: '0 6px 24px rgba(2, 51, 115, 0.38)',
                            transform: 'translateY(-2px)',
                        },
                        '&:active': { transform: 'translateY(0)' },
                    }}
                >
                    פתח עץ החלטות אינטראקטיבי — אבחון וטיפול פאנס/פאנדס
                </Button>
            </div>

            {open && <FlowchartInner onClose={() => setOpen(false)} />}
        </>
    );
};

export default DiagnosisFlowchart;