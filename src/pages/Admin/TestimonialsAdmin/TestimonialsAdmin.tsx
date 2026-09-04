import React, { useEffect, useMemo, useState } from 'react';
import { FiCheck, FiX, FiTrash2, FiEye, FiMessageSquare } from 'react-icons/fi';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Chip, Box } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { getAllTestimonials, setTestimonialStatus, deleteTestimonial } from '@/services/testimonialsService';
import type { Testimonial, TestimonialStatus } from '@/types/testimonials';
import '../admin-shared.scss';

type Filter = TestimonialStatus | 'all';

const STATUS_LABELS: Record<TestimonialStatus, string> = {
    pending: 'ממתין לאישור',
    approved: 'מאושר',
    rejected: 'נדחה',
};

const FILTERS: { id: Filter; label: string }[] = [
    { id: 'pending', label: 'ממתינים' },
    { id: 'approved', label: 'מאושרים' },
    { id: 'rejected', label: 'נדחו' },
    { id: 'all', label: 'הכל' },
];

const formatDate = (ts: unknown): string => {
    const d = (ts as { toDate?: () => Date })?.toDate?.();
    return d ? d.toLocaleDateString('he-IL', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
};

const TestimonialsAdmin: React.FC = () => {
    const [items, setItems] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<Filter>('pending');
    const [active, setActive] = useState<Testimonial | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const load = async () => {
        setLoading(true);
        try {
            setItems(await getAllTestimonials());
        } catch (err) {
            console.error('getAllTestimonials failed:', err);
            showToast('שגיאה בטעינת עדויות', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const counts = useMemo(() => ({
        all: items.length,
        pending: items.filter((t) => t.status === 'pending').length,
        approved: items.filter((t) => t.status === 'approved').length,
        rejected: items.filter((t) => t.status === 'rejected').length,
    }), [items]);

    const visible = filter === 'all' ? items : items.filter((t) => t.status === filter);

    const changeStatus = async (t: Testimonial, status: TestimonialStatus) => {
        try {
            await setTestimonialStatus(t.id, status);
            setItems((prev) => prev.map((x) => (x.id === t.id ? { ...x, status } : x)));
            if (active?.id === t.id) setActive({ ...t, status });
            showToast(
                status === 'approved' ? 'העדות אושרה ופורסמה'
                    : status === 'rejected' ? 'העדות נדחתה'
                        : 'הסטטוס עודכן',
            );
        } catch (err) {
            console.error('setTestimonialStatus failed:', err);
            showToast('שגיאה בעדכון', 'error');
        }
    };

    const remove = async (t: Testimonial) => {
        if (!window.confirm(`למחוק את "${t.title}"? פעולה זו אינה הפיכה.`)) return;
        try {
            await deleteTestimonial(t.id);
            setItems((prev) => prev.filter((x) => x.id !== t.id));
            if (active?.id === t.id) setActive(null);
            showToast('העדות נמחקה');
        } catch (err) {
            console.error('deleteTestimonial failed:', err);
            showToast('שגיאה במחיקה', 'error');
        }
    };

    const author = (t: Testimonial): string =>
        t.isAnonymous
            ? `אנונימי${t.authorName ? ` (${t.authorName})` : ''}`
            : t.displayName || t.authorName || '—';

    return (
        <div className="adm" dir="rtl">
            {toast && <div className={`adm-toast adm-toast--${toast.type}`}>{toast.msg}</div>}

            <div className="adm__header">
                <div className="adm__header-left">
                    <div className="adm__header-icon"><FiMessageSquare /></div>
                    <div>
                        <h1 className="adm__header-title">אישור עדויות</h1>
                        <p className="adm__header-sub">עדויות שנשלחו מהאתר — רק עדויות מאושרות מוצגות לציבור</p>
                    </div>
                </div>
            </div>

            <div className="adm__tabs" role="tablist">
                {FILTERS.map((f) => (
                    <button
                        key={f.id}
                        type="button"
                        role="tab"
                        aria-selected={filter === f.id}
                        className={`adm__tab${filter === f.id ? ' adm__tab--active' : ''}`}
                        onClick={() => setFilter(f.id)}
                    >
                        {f.label} <span className="adm__tab-count">({counts[f.id]})</span>
                    </button>
                ))}
            </div>

            <div className="adm__table-wrap">
                {loading ? (
                    <div className="adm__loading"><div className="adm__spinner" /> טוען…</div>
                ) : visible.length === 0 ? (
                    <div className="adm__empty">
                        <FiMessageSquare className="adm__empty-icon" />
                        <p>אין עדויות בקטגוריה זו.</p>
                    </div>
                ) : (
                    <table className="adm-table">
                        <thead>
                            <tr>
                                <th>עדות</th>
                                <th>מאת</th>
                                <th>תאריך</th>
                                <th>סטטוס</th>
                                <th>פעולות</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visible.map((t) => (
                                <tr key={t.id}>
                                    <td>
                                        <span className="adm-table__title">{t.title}</span>
                                        <span className="adm-table__muted">{t.highlight}</span>
                                    </td>
                                    <td>
                                        {author(t)}
                                        {t.authorEmail && <span className="adm-table__muted" dir="ltr">{t.authorEmail}</span>}
                                    </td>
                                    <td>{formatDate(t.createdAt)}</td>
                                    <td><span className={`adm-badge adm-badge--${t.status}`}>{STATUS_LABELS[t.status]}</span></td>
                                    <td className="adm-table__actions">
                                        <button className="adm-icon-btn" title="קריאה" onClick={() => setActive(t)}><FiEye /></button>
                                        {t.status !== 'approved' && (
                                            <button className="adm-icon-btn adm-icon-btn--approve" title="אישור ופרסום" onClick={() => changeStatus(t, 'approved')}><FiCheck /></button>
                                        )}
                                        {t.status !== 'rejected' && (
                                            <button className="adm-icon-btn adm-icon-btn--reject" title="דחייה" onClick={() => changeStatus(t, 'rejected')}><FiX /></button>
                                        )}
                                        <button className="adm-icon-btn adm-icon-btn--danger" title="מחיקה" onClick={() => remove(t)}><FiTrash2 /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Read modal */}
            <Dialog open={Boolean(active)} onClose={() => setActive(null)} maxWidth="sm" fullWidth dir="rtl">
                {active && (
                    <>
                        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                            <span>{active.title}</span>
                            <IconButton onClick={() => setActive(null)} aria-label="סגירה"><CloseIcon /></IconButton>
                        </DialogTitle>

                        <DialogContent dividers>
                            <Box sx={{ mb: 1.5, color: '#6b7a89', fontSize: '0.85rem' }}>
                                {author(active)} · {formatDate(active.createdAt)} ·{' '}
                                <span className={`adm-badge adm-badge--${active.status}`}>{STATUS_LABELS[active.status]}</span>
                            </Box>
                            {active.highlight && (
                                <Box sx={{ fontStyle: 'italic', color: '#1f4e79', mb: 2, pr: 1.5, borderRight: '3px solid #4a90d9' }}>
                                    “{active.highlight}”
                                </Box>
                            )}
                            <Box sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{active.content}</Box>
                            {active.tags.length > 0 && (
                                <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mt: 2 }}>
                                    {active.tags.map((tag) => <Chip key={tag} label={tag} size="small" />)}
                                </Box>
                            )}
                        </DialogContent>

                        <DialogActions sx={{ gap: 1 }}>
                            <Button color="error" onClick={() => remove(active)} startIcon={<FiTrash2 />}>מחיקה</Button>
                            <Box sx={{ flex: 1 }} />
                            {active.status !== 'rejected' && (
                                <Button variant="outlined" color="warning" onClick={() => changeStatus(active, 'rejected')} startIcon={<FiX />}>דחייה</Button>
                            )}
                            {active.status !== 'approved' && (
                                <Button variant="contained" color="success" onClick={() => changeStatus(active, 'approved')} startIcon={<FiCheck />}>אישור ופרסום</Button>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </div>
    );
};

export default TestimonialsAdmin;