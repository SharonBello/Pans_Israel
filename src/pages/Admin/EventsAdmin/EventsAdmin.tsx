import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiExternalLink, FiCalendar } from 'react-icons/fi';
import { getAllEvents, createEvent, updateEvent, deleteEvent, togglePublished } from '@/services/eventService';
import type { EventItem, EventFormData } from '@/types/event';
import { EMPTY_EVENT_FORM, FORMAT_LABELS, formatEventDateLabel } from '@/types/event';
import EventFormModal from './EventFormModal';
import './EventsAdmin.scss';

const todayIso = () => new Date().toISOString().split('T')[0];

const toForm = (e: EventItem): EventFormData => ({
    title: e.title,
    subtitle: e.subtitle ?? '',
    badge: e.badge ?? '',
    date: e.date,
    time: e.time ?? '',
    format: e.format ?? 'online',
    location: e.location ?? '',
    description: e.description ?? '',
    registrationUrl: e.registrationUrl ?? '',
    registrationLabel: e.registrationLabel ?? 'להרשמה',
    imageUrl: e.imageUrl ?? '',
    imageAlt: e.imageAlt ?? '',
    accent: e.accent ?? '#4a90d9',
    published: e.published ?? false,
});

const EventsAdmin: React.FC = () => {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<EventItem | null>(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const load = async () => {
        setLoading(true);
        try {
            setEvents(await getAllEvents());
        } catch (err) {
            console.error('getAllEvents failed:', err);
            showToast('שגיאה בטעינת אירועים', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const openCreate = () => { setEditTarget(null); setModalOpen(true); };
    const openEdit = (e: EventItem) => { setEditTarget(e); setModalOpen(true); };
    const closeModal = () => { setModalOpen(false); setEditTarget(null); };

    const handleSave = async (data: EventFormData) => {
        setSaving(true);
        try {
            if (editTarget) {
                await updateEvent(editTarget.id, data);
                showToast('האירוע עודכן');
            } else {
                await createEvent(data);
                showToast('האירוע נוסף');
            }
            closeModal();
            await load();
        } catch (err) {
            console.error('saveEvent failed:', err);
            showToast(`שגיאה בשמירה: ${(err as Error).message}`, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (e: EventItem) => {
        if (!window.confirm(`למחוק את "${e.title}"? פעולה זו אינה הפיכה.`)) return;
        try {
            await deleteEvent(e.id);
            setEvents((prev) => prev.filter((x) => x.id !== e.id));
            showToast('האירוע נמחק');
        } catch (err) {
            console.error('deleteEvent failed:', err);
            showToast('שגיאה במחיקה', 'error');
        }
    };

    const handleToggle = async (e: EventItem) => {
        try {
            await togglePublished(e.id, e.published);
            setEvents((prev) => prev.map((x) => (x.id === e.id ? { ...x, published: !e.published } : x)));
        } catch (err) {
            console.error('togglePublished failed:', err);
            showToast('שגיאה בעדכון', 'error');
        }
    };

    const published = events.filter((e) => e.published).length;
    const upcoming = events.filter((e) => e.published && e.date >= todayIso()).length;

    return (
        <div className="eva" dir="rtl">
            {toast && <div className={`eva-toast eva-toast--${toast.type}`}>{toast.msg}</div>}

            <div className="eva__header">
                <div className="eva__header-left">
                    <div className="eva__header-icon"><FiCalendar /></div>
                    <div>
                        <h1 className="eva__header-title">פעילויות ואירועים</h1>
                        <p className="eva__header-sub">וובינרים, מפגשים וכנסים המוצגים בעמוד הבית ובעמוד הפעילויות</p>
                    </div>
                </div>
                <button className="eva-btn eva-btn--primary" onClick={openCreate}>
                    <FiPlus /> אירוע חדש
                </button>
            </div>

            <div className="eva__stats">
                <div className="eva__stat"><span className="eva__stat-num">{events.length}</span><span className="eva__stat-label">סה"כ</span></div>
                <div className="eva__stat"><span className="eva__stat-num eva__stat-num--green">{published}</span><span className="eva__stat-label">מפורסמים</span></div>
                <div className="eva__stat"><span className="eva__stat-num eva__stat-num--blue">{upcoming}</span><span className="eva__stat-label">קרובים באתר</span></div>
                <div className="eva__stat"><span className="eva__stat-num eva__stat-num--gray">{events.length - published}</span><span className="eva__stat-label">טיוטות</span></div>
            </div>

            <div className="eva__table-wrap">
                {loading ? (
                    <div className="eva__loading"><div className="eva__spinner" /> טוען…</div>
                ) : events.length === 0 ? (
                    <div className="eva__empty"><FiCalendar className="eva__empty-icon" /><p>אין אירועים עדיין. לחצו "אירוע חדש" כדי להתחיל.</p></div>
                ) : (
                    <table className="eva-table">
                        <thead>
                            <tr>
                                <th>אירוע</th>
                                <th>תאריך</th>
                                <th>פורמט</th>
                                <th>הרשמה</th>
                                <th>פעולות</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((e) => {
                                const past = e.date < todayIso();
                                return (
                                    <tr key={e.id} className={`eva-table__row${!e.published ? ' eva-table__row--draft' : ''}${past ? ' eva-table__row--past' : ''}`}>
                                        <td>
                                            <div className="eva-table__event">
                                                {e.imageUrl
                                                    ? <img src={e.imageUrl} alt="" className="eva-table__thumb" />
                                                    : <span className="eva-table__thumb eva-table__thumb--empty" style={{ background: e.accent }} />}
                                                <div>
                                                    <span className="eva-table__title">{e.title}</span>
                                                    <span className="eva-table__sub">{e.badge}{e.subtitle ? ` · ${e.subtitle}` : ''}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {formatEventDateLabel(e.date, e.time)}
                                            {past && <span className="eva-table__past">עבר</span>}
                                        </td>
                                        <td>
                                            {FORMAT_LABELS[e.format] ?? e.format}
                                            <br />
                                            <span className="eva-table__muted">{e.location}</span>
                                        </td>
                                        <td>
                                            {e.registrationUrl ? (
                                                <a href={e.registrationUrl} target="_blank" rel="noopener noreferrer" className="eva-table__link">
                                                    פתוחה <FiExternalLink />
                                                </a>
                                            ) : (
                                                <span className="eva-table__muted">בקרוב</span>
                                            )}
                                        </td>
                                        <td className="eva-table__actions">
                                            <button className={`eva-icon-btn${e.published ? ' eva-icon-btn--active' : ''}`}
                                                title={e.published ? 'הסתר מהאתר' : 'פרסם'} onClick={() => handleToggle(e)}>
                                                {e.published ? <FiEye /> : <FiEyeOff />}
                                            </button>
                                            <button className="eva-icon-btn" title="עריכה" onClick={() => openEdit(e)}><FiEdit2 /></button>
                                            <button className="eva-icon-btn eva-icon-btn--danger" title="מחיקה" onClick={() => handleDelete(e)}><FiTrash2 /></button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {modalOpen && (
                <EventFormModal
                    key={editTarget?.id ?? 'new'}
                    open={modalOpen}
                    initial={editTarget ? toForm(editTarget) : EMPTY_EVENT_FORM}
                    isEdit={Boolean(editTarget)}
                    saving={saving}
                    onSave={handleSave}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default EventsAdmin;