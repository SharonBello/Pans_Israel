import React, { useEffect, useMemo, useState } from 'react';
import { FiCheck, FiX, FiTrash2, FiEye, FiUsers, FiPhone, FiMail } from 'react-icons/fi';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Chip, Box } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { getAllVolunteers, setVolunteerApproval, deleteVolunteer } from '@/services/supportService';
import type { SupportVolunteer } from '@/types/support.types';
import {
    genderOptions, religiousOptions, religionOptions, educationOptions, contactPreferenceOptions,
} from '@/types/support.types';
import '../admin-shared.scss';

type Filter = 'pending' | 'approved' | 'all';

const FILTERS: { id: Filter; label: string }[] = [
    { id: 'pending', label: 'ממתינים לאישור' },
    { id: 'approved', label: 'מאושרים' },
    { id: 'all', label: 'הכל' },
];

const label = (options: { value: string; label: string }[], value: string): string =>
    options.find((o) => o.value === value)?.label ?? value ?? '—';

const formatDate = (ts: unknown): string => {
    const d = (ts as { toDate?: () => Date })?.toDate?.() ?? (ts instanceof Date ? ts : undefined);
    return d ? d.toLocaleDateString('he-IL', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
};

const VolunteersAdmin: React.FC = () => {
    const [items, setItems] = useState<SupportVolunteer[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<Filter>('pending');
    const [active, setActive] = useState<SupportVolunteer | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const load = async () => {
        setLoading(true);
        setItems(await getAllVolunteers());
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const counts = useMemo(() => ({
        all: items.length,
        pending: items.filter((v) => !v.isApproved).length,
        approved: items.filter((v) => v.isApproved).length,
    }), [items]);

    const visible = items.filter((v) =>
        filter === 'pending' ? !v.isApproved : filter === 'approved' ? v.isApproved : true,
    );

    const setApproval = async (v: SupportVolunteer, isApproved: boolean) => {
        if (!v.id) return;
        const res = await setVolunteerApproval(v.id, isApproved);
        if (!res.success) { showToast(res.error ?? 'שגיאה בעדכון', 'error'); return; }
        setItems((prev) => prev.map((x) => (x.id === v.id ? { ...x, isApproved } : x)));
        if (active?.id === v.id) setActive({ ...v, isApproved });
        showToast(isApproved ? 'המתנדב/ת אושר/ה ומוצג/ת באתר' : 'המתנדב/ת הוסר/ה מהאתר');
    };

    const remove = async (v: SupportVolunteer) => {
        if (!v.id) return;
        if (!window.confirm(`למחוק את ${v.firstName} ${v.lastName}? פעולה זו אינה הפיכה.`)) return;
        const res = await deleteVolunteer(v.id);
        if (!res.success) { showToast(res.error ?? 'שגיאה במחיקה', 'error'); return; }
        setItems((prev) => prev.filter((x) => x.id !== v.id));
        if (active?.id === v.id) setActive(null);
        showToast('המתנדב/ת נמחק/ה');
    };

    return (
        <div className="adm" dir="rtl">
            {toast && <div className={`adm-toast adm-toast--${toast.type}`}>{toast.msg}</div>}

            <div className="adm__header">
                <div className="adm__header-left">
                    <div className="adm__header-icon"><FiUsers /></div>
                    <div>
                        <h1 className="adm__header-title">אישור מתנדבים</h1>
                        <p className="adm__header-sub">פניות התנדבות מעמוד "תמיכה וקהילה" — רק מתנדבים מאושרים מוצגים באתר</p>
                    </div>
                </div>
            </div>

            <div className="adm__tabs" role="tablist">
                {FILTERS.map((f) => (
                    <button key={f.id} type="button" role="tab" aria-selected={filter === f.id}
                        className={`adm__tab${filter === f.id ? ' adm__tab--active' : ''}`} onClick={() => setFilter(f.id)}>
                        {f.label} <span className="adm__tab-count">({counts[f.id]})</span>
                    </button>
                ))}
            </div>

            <div className="adm__table-wrap">
                {loading ? (
                    <div className="adm__loading"><div className="adm__spinner" /> טוען…</div>
                ) : visible.length === 0 ? (
                    <div className="adm__empty"><FiUsers className="adm__empty-icon" /><p>אין מתנדבים בקטגוריה זו.</p></div>
                ) : (
                    <table className="adm-table">
                        <thead>
                            <tr>
                                <th>שם</th>
                                <th>מקצוע / מיקום</th>
                                <th>יצירת קשר</th>
                                <th>תאריך</th>
                                <th>סטטוס</th>
                                <th>פעולות</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visible.map((v) => (
                                <tr key={v.id}>
                                    <td>
                                        <span className="adm-table__title">{v.firstName} {v.lastName}</span>
                                        <span className="adm-table__muted">{label(genderOptions, v.gender)} · {v.age}</span>
                                    </td>
                                    <td>
                                        {v.profession}
                                        <span className="adm-table__muted">{v.location}</span>
                                    </td>
                                    <td>
                                        {v.phone && <span className="adm-table__muted" dir="ltr"><FiPhone /> {v.phone}</span>}
                                        {v.email && <span className="adm-table__muted" dir="ltr"><FiMail /> {v.email}</span>}
                                    </td>
                                    <td>{formatDate(v.createdAt)}</td>
                                    <td>
                                        <span className={`adm-badge adm-badge--${v.isApproved ? 'approved' : 'pending'}`}>
                                            {v.isApproved ? 'מאושר' : 'ממתין'}
                                        </span>
                                    </td>
                                    <td className="adm-table__actions">
                                        <button className="adm-icon-btn" title="פרטים" onClick={() => setActive(v)}><FiEye /></button>
                                        {v.isApproved ? (
                                            <button className="adm-icon-btn adm-icon-btn--reject" title="הסר מהאתר" onClick={() => setApproval(v, false)}><FiX /></button>
                                        ) : (
                                            <button className="adm-icon-btn adm-icon-btn--approve" title="אישור" onClick={() => setApproval(v, true)}><FiCheck /></button>
                                        )}
                                        <button className="adm-icon-btn adm-icon-btn--danger" title="מחיקה" onClick={() => remove(v)}><FiTrash2 /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Details modal */}
            <Dialog open={Boolean(active)} onClose={() => setActive(null)} maxWidth="sm" fullWidth dir="rtl">
                {active && (
                    <>
                        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                            <span>{active.firstName} {active.lastName}</span>
                            <IconButton onClick={() => setActive(null)} aria-label="סגירה"><CloseIcon /></IconButton>
                        </DialogTitle>

                        <DialogContent dividers>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, fontSize: '0.9rem', mb: 2 }}>
                                <Field k="גיל" v={String(active.age)} />
                                <Field k="מגדר" v={label(genderOptions, active.gender)} />
                                <Field k="קרבה לדת" v={label(religiousOptions, active.religiousAffiliation)} />
                                <Field k="דת" v={label(religionOptions, active.religion)} />
                                <Field k="מקצוע" v={active.profession} />
                                <Field k="השכלה" v={label(educationOptions, active.education)} />
                                <Field k="מקום מגורים" v={active.location} />
                                <Field k="נרשם/ה" v={formatDate(active.createdAt)} />
                                <Field k="טלפון" v={active.phone || '—'} ltr />
                                <Field k="אימייל" v={active.email || '—'} ltr />
                            </Box>

                            <Box sx={{ fontWeight: 600, mb: 0.5 }}>כיצד ירצה/תרצה לעזור</Box>
                            <Box sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, mb: 2 }}>{active.howToHelp}</Box>

                            <Box sx={{ fontWeight: 600, mb: 0.5 }}>דרכי יצירת קשר</Box>
                            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                                {active.contactPreference.map((p) => (
                                    <Chip key={p} label={label(contactPreferenceOptions, p)} size="small" />
                                ))}
                            </Box>
                        </DialogContent>

                        <DialogActions sx={{ gap: 1 }}>
                            <Button color="error" onClick={() => remove(active)} startIcon={<FiTrash2 />}>מחיקה</Button>
                            <Box sx={{ flex: 1 }} />
                            {active.isApproved ? (
                                <Button variant="outlined" color="warning" onClick={() => setApproval(active, false)} startIcon={<FiX />}>הסר מהאתר</Button>
                            ) : (
                                <Button variant="contained" color="success" onClick={() => setApproval(active, true)} startIcon={<FiCheck />}>אישור והצגה באתר</Button>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </div>
    );
};

const Field: React.FC<{ k: string; v: string; ltr?: boolean }> = ({ k, v, ltr }) => (
    <Box>
        <Box sx={{ fontSize: '0.75rem', color: '#6b7a89' }}>{k}</Box>
        <Box dir={ltr ? 'ltr' : undefined} sx={{ textAlign: ltr ? 'end' : undefined }}>{v}</Box>
    </Box>
);

export default VolunteersAdmin;