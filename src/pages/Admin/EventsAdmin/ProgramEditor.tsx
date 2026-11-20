import React, { useState } from 'react';
import {
    Accordion, AccordionSummary, AccordionDetails, Alert, Box, Button, IconButton, TextField, Typography,
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Add as AddIcon,
    DeleteOutline as DeleteIcon,
    PersonAddAlt1 as PersonAddIcon,
    ContentPaste as PasteIcon,
} from '@mui/icons-material';
import type { EventSession, EventSpeaker } from '@/types/event';

interface Props {
    value: EventSession[];
    onChange: (next: EventSession[]) => void;
    /** Validation message from the form; also turns on red highlights for empty required fields */
    error?: string;
}

// ── helpers (file-private) ───────────────────────────────────────────────────
const newId = (): string => crypto.randomUUID();

const emptySpeaker = (): EventSpeaker => ({ id: newId(), name: '', role: '', bio: '', imageUrl: '' });

const emptySession = (): EventSession => ({
    id: newId(), startTime: '', endTime: '', title: '', subtitle: '', speakers: [],
});

const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');

const countLabel = (n: number, one: string, many: string): string => (n === 1 ? `${one} אחד` : `${n} ${many}`);

const timeRange = (s: EventSession): string => (s.endTime ? `${s.startTime}–${s.endTime}` : s.startTime);

const isSessionValid = (s: EventSession): boolean =>
    Boolean(s.startTime.trim() && s.title.trim()) && s.speakers.every((sp) => sp.name.trim());

/** Pasted JSON → sessions with fresh ids. Throws with a Hebrew message on bad input. */
const parseProgramJson = (text: string): EventSession[] => {
    let data: unknown;
    try {
        data = JSON.parse(text);
    } catch {
        throw new Error('ה-JSON אינו תקין — בדקו פסיקים ומירכאות');
    }
    if (!Array.isArray(data)) throw new Error('נדרש מערך של מושבים: [ { ... }, { ... } ]');

    return data.map((raw, i): EventSession => {
        const s = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>;
        if (!str(s.title) || !str(s.startTime)) throw new Error(`במושב ${i + 1} חסרים title או startTime`);
        const rawSpeakers = Array.isArray(s.speakers) ? s.speakers : [];
        return {
            id: newId(),
            startTime: str(s.startTime),
            endTime: str(s.endTime),
            title: str(s.title),
            subtitle: str(s.subtitle),
            speakers: rawSpeakers.map((rawSp, j): EventSpeaker => {
                const sp = (typeof rawSp === 'object' && rawSp !== null ? rawSp : {}) as Record<string, unknown>;
                if (!str(sp.name)) throw new Error(`במושב ${i + 1}, למרצה ${j + 1} חסר name`);
                return { id: newId(), name: str(sp.name), role: str(sp.role), bio: str(sp.bio), imageUrl: str(sp.imageUrl) };
            }),
        };
    });
};

// ── component ────────────────────────────────────────────────────────────────
const ProgramEditor: React.FC<Props> = ({ value, onChange, error }) => {
    const [openIds, setOpenIds] = useState<string[]>([]);
    const [importOpen, setImportOpen] = useState(false);
    const [importText, setImportText] = useState('');
    const [importError, setImportError] = useState('');

    const showErrors = Boolean(error);
    const missing = (v: string): boolean => showErrors && !v.trim();
    const speakerCount = value.reduce((n, s) => n + s.speakers.length, 0);

    const toggleOpen = (id: string) =>
        setOpenIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

    // sessions
    const updateSession = (id: string, patch: Partial<EventSession>) =>
        onChange(value.map((s) => (s.id === id ? { ...s, ...patch } : s)));

    const addSession = () => {
        const s = emptySession();
        onChange([...value, s]);
        setOpenIds((ids) => [...ids, s.id]);
    };

    const removeSession = (s: EventSession) => {
        const extra = s.speakers.length ? ` ואת המרצים שבו (${s.speakers.length})` : '';
        if (!window.confirm(`למחוק את "${s.title || 'המושב'}"${extra}?`)) return;
        onChange(value.filter((x) => x.id !== s.id));
    };

    // speakers
    const updateSpeaker = (sessionId: string, speakerId: string, patch: Partial<EventSpeaker>) =>
        onChange(value.map((s) => (s.id !== sessionId ? s : {
            ...s,
            speakers: s.speakers.map((sp) => (sp.id === speakerId ? { ...sp, ...patch } : sp)),
        })));

    const addSpeaker = (sessionId: string) =>
        onChange(value.map((s) => (s.id === sessionId ? { ...s, speakers: [...s.speakers, emptySpeaker()] } : s)));

    const removeSpeaker = (sessionId: string, sp: EventSpeaker) => {
        if (!window.confirm(`להסיר את ${sp.name || 'המרצה'}?`)) return;
        onChange(value.map((s) => (s.id === sessionId ? { ...s, speakers: s.speakers.filter((x) => x.id !== sp.id) } : s)));
    };

    // JSON import
    const closeImport = () => {
        setImportOpen(false);
        setImportText('');
        setImportError('');
    };

    const runImport = () => {
        try {
            const sessions = parseProgramJson(importText);
            if (value.length && !window.confirm('הייבוא יחליף את התוכנית הקיימת. להמשיך?')) return;
            onChange(sessions);
            setOpenIds([]);
            closeImport();
        } catch (err) {
            setImportError((err as Error).message);
        }
    };

    return (
        <Box sx={{ gridColumn: '1 / -1', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 1.5 }}>
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>תוכנית ומרצים (אופציונלי)</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {value.length
                            ? `${countLabel(value.length, 'מושב', 'מושבים')} · ${countLabel(speakerCount, 'מרצה', 'מרצים')} · המושבים ממוינים לפי שעת התחלה בשמירה`
                            : 'ללא תוכנית — הכרטיס באתר יוצג בלי מקטע "תוכנית ומרצים"'}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" startIcon={<PasteIcon />} onClick={() => (importOpen ? closeImport() : setImportOpen(true))}>
                        ייבוא מ-JSON
                    </Button>
                    <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={addSession}>
                        הוספת מושב
                    </Button>
                </Box>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 1.5 }}>{error}</Alert>}

            {/* JSON import */}
            {importOpen && (
                <Box sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: '#f6f8fa' }}>
                    <TextField
                        label="מערך מושבים ב-JSON"
                        value={importText}
                        onChange={(e) => { setImportText(e.target.value); setImportError(''); }}
                        error={Boolean(importError)}
                        helperText={importError || 'הייבוא מחליף את כל התוכנית הנוכחית'}
                        multiline
                        minRows={6}
                        maxRows={14}
                        fullWidth
                        dir="ltr"
                        sx={{ '& textarea': { fontFamily: 'monospace', fontSize: 13 } }}
                    />
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Button variant="contained" size="small" onClick={runImport} disabled={!importText.trim()}>ייבוא</Button>
                        <Button size="small" onClick={closeImport}>ביטול</Button>
                    </Box>
                </Box>
            )}

            {/* Sessions */}
            {value.map((s, i) => {
                const invalid = showErrors && !isSessionValid(s);
                return (
                    <Accordion
                        key={s.id}
                        expanded={openIds.includes(s.id)}
                        onChange={() => toggleOpen(s.id)}
                        disableGutters
                        variant="outlined"
                        sx={{ mb: 1, borderRadius: 2, borderColor: invalid ? 'error.main' : undefined, '&::before': { display: 'none' } }}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', minWidth: 0 }}>
                                <Typography dir="ltr" sx={{ fontWeight: 700, minWidth: 96, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
                                    {s.startTime ? timeRange(s) : '--:--'}
                                </Typography>
                                <Typography
                                    color={s.title ? 'text.primary' : 'text.secondary'}
                                    sx={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                >
                                    {s.title || `מושב ${i + 1} (ללא כותרת)`}
                                </Typography>
                                {invalid ? (
                                    <Typography variant="body2" color="error" sx={{ flexShrink: 0 }}>חסרים פרטים</Typography>
                                ) : s.speakers.length > 0 && (
                                    <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
                                        {countLabel(s.speakers.length, 'מרצה', 'מרצים')}
                                    </Typography>
                                )}
                            </Box>
                        </AccordionSummary>

                        <AccordionDetails sx={{ pt: 0 }}>
                            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                                <TextField label="שעת התחלה" type="time" value={s.startTime} required
                                    onChange={(e) => updateSession(s.id, { startTime: e.target.value })}
                                    error={missing(s.startTime)} InputLabelProps={{ shrink: true }} fullWidth />
                                <TextField label="שעת סיום" type="time" value={s.endTime}
                                    onChange={(e) => updateSession(s.id, { endTime: e.target.value })}
                                    InputLabelProps={{ shrink: true }} fullWidth />
                                <TextField label="כותרת המושב" value={s.title} required
                                    onChange={(e) => updateSession(s.id, { title: e.target.value })}
                                    error={missing(s.title)} fullWidth sx={{ gridColumn: '1 / -1' }} />
                                <TextField label="שורת משנה" value={s.subtitle}
                                    onChange={(e) => updateSession(s.id, { subtitle: e.target.value })}
                                    placeholder="למשל: עמותת PANDAS ישראל / עם כלל המרצים" fullWidth sx={{ gridColumn: '1 / -1' }} />
                            </Box>

                            {/* Speakers */}
                            {s.speakers.map((sp, j) => (
                                <Box key={sp.id} sx={{ mt: 2, p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: '#fbfcfd' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>מרצה {j + 1}</Typography>
                                        <IconButton size="small" aria-label={`הסרת ${sp.name || 'המרצה'}`} onClick={() => removeSpeaker(s.id, sp)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                                        <TextField label="שם" value={sp.name} required size="small"
                                            onChange={(e) => updateSpeaker(s.id, sp.id, { name: e.target.value })}
                                            error={missing(sp.name)} placeholder="ד״ר ישראלה ישראלי" fullWidth />
                                        <TextField label="תפקיד / שיוך" value={sp.role} size="small"
                                            onChange={(e) => updateSpeaker(s.id, sp.id, { role: e.target.value })}
                                            placeholder="נוירולוגיית ילדים, מרכז רפואי ..." fullWidth />
                                        <TextField label="קישור לתמונה (לא חובה)" value={sp.imageUrl} size="small" dir="ltr"
                                            onChange={(e) => updateSpeaker(s.id, sp.id, { imageUrl: e.target.value })}
                                            fullWidth sx={{ gridColumn: '1 / -1' }} />
                                        <TextField label="ביוגרפיה" value={sp.bio} multiline minRows={3}
                                            onChange={(e) => updateSpeaker(s.id, sp.id, { bio: e.target.value })}
                                            helperText="שורה ריקה בין פסקאות" fullWidth sx={{ gridColumn: '1 / -1' }} />
                                    </Box>
                                </Box>
                            ))}

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                                <Button size="small" startIcon={<PersonAddIcon />} onClick={() => addSpeaker(s.id)}>הוספת מרצה</Button>
                                <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => removeSession(s)}>מחיקת המושב</Button>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </Box>
    );
};

export default ProgramEditor;