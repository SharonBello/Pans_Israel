import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem,
    FormControlLabel, Switch, IconButton, CircularProgress, Box, Typography,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import type { EventFormData, EventFormat } from '@/types/event';
import { FORMAT_LABELS, ACCENT_PRESETS } from '@/types/event';

interface Props {
    open: boolean;
    initial: EventFormData;
    saving: boolean;
    isEdit: boolean;
    onSave: (data: EventFormData) => Promise<void>;
    onClose: () => void;
}

const EventFormModal: React.FC<Props> = ({ open, initial, saving, isEdit, onSave, onClose }) => {
    const [form, setForm] = useState<EventFormData>(initial);
    const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({});

    const set = <K extends keyof EventFormData>(key: K, value: EventFormData[K]) => {
        setForm((f) => ({ ...f, [key]: value }));
        setErrors((e) => ({ ...e, [key]: undefined }));
    };

    const validate = (): boolean => {
        const e: typeof errors = {};
        if (!form.title.trim()) e.title = 'שדה חובה';
        if (!form.date) e.date = 'שדה חובה';
        if (!form.location.trim()) e.location = 'שדה חובה';
        if (!form.description.trim()) e.description = 'שדה חובה';
        if (form.registrationUrl && !/^https?:\/\//.test(form.registrationUrl)) e.registrationUrl = 'כתובת חייבת להתחיל ב-http';
        if (form.imageUrl && !/^https?:\/\//.test(form.imageUrl)) e.imageUrl = 'כתובת חייבת להתחיל ב-http';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const submit = async () => {
        if (!validate()) return;
        await onSave({
            ...form,
            registrationUrl: form.registrationUrl?.trim() || '',
            imageUrl: form.imageUrl?.trim() || '',
            time: form.time?.trim() || '',
        });
    };

    return (
        <Dialog open={open} onClose={saving ? undefined : onClose} maxWidth="md" fullWidth dir="rtl">
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {isEdit ? 'עריכת אירוע' : 'אירוע חדש'}
                <IconButton onClick={onClose} disabled={saving} aria-label="סגירה"><CloseIcon /></IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                    <TextField label="כותרת" value={form.title} onChange={(e) => set('title', e.target.value)}
                        error={!!errors.title} helperText={errors.title} required fullWidth sx={{ gridColumn: '1 / -1' }} />

                    <TextField label="כותרת משנה" value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)}
                        fullWidth placeholder="להורים ולאנשי מקצוע · בזום" />

                    <TextField label="תגית" value={form.badge} onChange={(e) => set('badge', e.target.value)}
                        fullWidth placeholder="בקרוב / השבוע / וובינר חינם" />

                    <TextField label="תאריך" type="date" value={form.date} onChange={(e) => set('date', e.target.value)}
                        error={!!errors.date} helperText={errors.date} required fullWidth InputLabelProps={{ shrink: true }} />

                    <TextField label="שעה" type="time" value={form.time ?? ''} onChange={(e) => set('time', e.target.value)}
                        fullWidth InputLabelProps={{ shrink: true }} />

                    <TextField select label="פורמט" value={form.format}
                        onChange={(e) => set('format', e.target.value as EventFormat)} fullWidth>
                        {(Object.keys(FORMAT_LABELS) as EventFormat[]).map((f) => (
                            <MenuItem key={f} value={f}>{FORMAT_LABELS[f]}</MenuItem>
                        ))}
                    </TextField>

                    <TextField label="מיקום" value={form.location} onChange={(e) => set('location', e.target.value)}
                        error={!!errors.location} helperText={errors.location} required fullWidth
                        placeholder="זום (מקוון) / המרכז הרפואי מאיר, כפר סבא" />

                    <TextField label="תיאור" value={form.description} onChange={(e) => set('description', e.target.value)}
                        error={!!errors.description} helperText={errors.description} required fullWidth multiline rows={4}
                        sx={{ gridColumn: '1 / -1' }} />

                    <TextField label="קישור להרשמה" value={form.registrationUrl ?? ''}
                        onChange={(e) => set('registrationUrl', e.target.value)}
                        error={!!errors.registrationUrl} helperText={errors.registrationUrl ?? 'ריק = "ההרשמה תיפתח בקרוב"'}
                        fullWidth dir="ltr" />

                    <TextField label="טקסט כפתור הרשמה" value={form.registrationLabel ?? ''}
                        onChange={(e) => set('registrationLabel', e.target.value)} fullWidth placeholder="להרשמה" />

                    {/* Poster (URL only) */}
                    <Box sx={{ gridColumn: '1 / -1', display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        {form.imageUrl ? (
                            <img src={form.imageUrl} alt="" style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8 }} />
                        ) : (
                            <Box sx={{ width: 96, height: 96, borderRadius: 2, bgcolor: '#eef3f9', display: 'grid', placeItems: 'center', color: '#8a97a4', fontSize: 12 }}>
                                אין תמונה
                            </Box>
                        )}
                        <TextField
                            label="כתובת תמונה (פוסטר)"
                            value={form.imageUrl ?? ''}
                            onChange={(e) => set('imageUrl', e.target.value)}
                            error={!!errors.imageUrl}
                            helperText={errors.imageUrl ?? 'העלו לקלאודינרי/דרייב והדביקו כאן קישור ישיר לתמונה'}
                            size="small"
                            dir="ltr"
                            sx={{ flex: 1, minWidth: 220 }}
                        />
                    </Box>

                    <TextField label="טקסט חלופי לתמונה" value={form.imageAlt ?? ''}
                        onChange={(e) => set('imageAlt', e.target.value)} fullWidth />

                    {/* Accent colour */}
                    <Box>
                        <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: 'text.secondary' }}>צבע מבטא</Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            {ACCENT_PRESETS.map((c) => (
                                <button key={c} type="button" onClick={() => set('accent', c)} aria-label={c}
                                    style={{
                                        width: 26, height: 26, borderRadius: '50%', background: c,
                                        border: form.accent === c ? '3px solid #1a2744' : '2px solid #fff',
                                        boxShadow: '0 0 0 1px #c9d3dd', cursor: 'pointer',
                                    }} />
                            ))}
                            <input type="color" value={form.accent} onChange={(e) => set('accent', e.target.value)}
                                style={{ width: 34, height: 28, border: 0, background: 'none' }} aria-label="צבע מותאם" />
                        </Box>
                    </Box>

                    <FormControlLabel sx={{ gridColumn: '1 / -1' }}
                        control={<Switch checked={form.published} onChange={(e) => set('published', e.target.checked)} />}
                        label={form.published ? 'מפורסם באתר' : 'טיוטה (לא מוצג באתר)'} />
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={saving}>ביטול</Button>
                <Button variant="contained" onClick={submit} disabled={saving}
                    startIcon={saving ? <CircularProgress size={18} /> : undefined}>
                    {saving ? 'שומר…' : isEdit ? 'שמירת שינויים' : 'יצירת אירוע'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EventFormModal;