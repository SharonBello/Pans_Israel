import React, { useEffect, useMemo, useState } from 'react';
import { FiUserPlus, FiTrash2, FiSearch, FiDownload, FiMail } from 'react-icons/fi';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    InputAdornment,
    Radio,
    RadioGroup,
    TextField,
} from '@mui/material';
import { getCommunityMembers, deleteCommunityMember } from '@/services/communityService';
import {
    buildFullCsv,
    buildMailingCsv,
    downloadCsv,
    groupMembers,
    isoDay,
    mailingRecipients,
    type MemberGroup,
} from '@/utils/communityMembers';
import '../admin-shared.scss';

type Filter = 'all' | 'updates' | 'no-updates';

const FILTERS: { id: Filter; label: string }[] = [
    { id: 'all', label: 'הכל' },
    { id: 'updates', label: 'מקבלים עדכונים' },
    { id: 'no-updates', label: 'בלי עדכונים' },
];

const DAY_MS = 24 * 60 * 60 * 1000;

/** Day of the last mailing export from this browser — only used to pre-fill the "since" date */
const LAST_EXPORT_KEY = 'community-last-mailing-export';

const readLastExport = (): string | null => {
    try { return localStorage.getItem(LAST_EXPORT_KEY); } catch { return null; }
};

const saveLastExport = (day: string): void => {
    try { localStorage.setItem(LAST_EXPORT_KEY, day); } catch { /* storage blocked — nothing to remember */ }
};

const formatDay = (day: string): string => formatDate(new Date(`${day}T12:00:00`));

const formatDate = (d: Date | null): string =>
    d ? d.toLocaleDateString('he-IL', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

const CommunityAdmin: React.FC = () => {
    const [groups, setGroups] = useState<MemberGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [filter, setFilter] = useState<Filter>('all');
    const [search, setSearch] = useState('');
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
    const [exportOpen, setExportOpen] = useState(false);
    const [exportMode, setExportMode] = useState<'all' | 'since'>('all');
    const [sinceDay, setSinceDay] = useState('');
    const [lastExport, setLastExport] = useState<string | null>(null);

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const members = await getCommunityMembers();
                if (!cancelled) setGroups(groupMembers(members));
            } catch (error) {
                console.error('Error loading community members:', error);
                if (!cancelled) setLoadError(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    const stats = useMemo(() => {
        const monthAgo = Date.now() - 30 * DAY_MS;
        return {
            all: groups.length,
            updates: groups.filter((g) => g.latest.emailUpdates).length,
            'no-updates': groups.filter((g) => !g.latest.emailUpdates).length,
            recent: groups.filter((g) => (g.firstJoined?.getTime() ?? 0) >= monthAgo).length,
        };
    }, [groups]);

    const visible = useMemo(() => {
        const q = search.trim().toLowerCase();
        return groups.filter((g) => {
            if (filter === 'updates' && !g.latest.emailUpdates) return false;
            if (filter === 'no-updates' && g.latest.emailUpdates) return false;
            return !q || g.email.includes(q) || g.latest.fullName.toLowerCase().includes(q);
        });
    }, [groups, filter, search]);

    const exportSince = exportMode === 'since' && sinceDay ? sinceDay : null;
    const exportCount = useMemo(() => mailingRecipients(groups, exportSince).length, [groups, exportSince]);

    const openExport = () => {
        if (stats.updates === 0) { showToast('אין עדיין מי שביקש/ה עדכונים', 'error'); return; }
        const last = readLastExport();
        setLastExport(last);
        setExportMode(last ? 'since' : 'all');
        setSinceDay(last ?? isoDay(new Date()));
        setExportOpen(true);
    };

    const exportMailing = () => {
        const today = isoDay(new Date());
        const name = exportSince ? `community-mailing-since-${exportSince}.csv` : `community-mailing-all-${today}.csv`;
        downloadCsv(buildMailingCsv(groups, exportSince), name, false);
        saveLastExport(today);
        setExportOpen(false);
        showToast(`יוצאו ${exportCount} כתובות לשירות הדיוור`);
    };

    const exportFull = () => {
        downloadCsv(buildFullCsv(groups), `community-members-${isoDay(new Date())}.csv`, true);
    };

    const remove = async (g: MemberGroup) => {
        const extra = g.ids.length > 1 ? ` (${g.ids.length} הרשמות)` : '';
        if (!window.confirm(`למחוק את ${g.latest.fullName} (${g.email})${extra} מרשימת הקהילה? פעולה זו אינה הפיכה.`)) return;
        const results = await Promise.all(g.ids.map((id) => deleteCommunityMember(id)));
        const failed = g.ids.filter((_, i) => !results[i].success);
        if (failed.length) {
            setGroups((prev) => prev.map((x) => (x.email === g.email ? { ...x, ids: failed } : x)));
            showToast('חלק מהרשומות לא נמחקו. נסו שוב.', 'error');
            return;
        }
        setGroups((prev) => prev.filter((x) => x.email !== g.email));
        showToast('נמחק/ה מהרשימה. אם הכתובת כבר בשירות הדיוור, צריך למחוק אותה גם שם.');
    };

    return (
        <div className="adm" dir="rtl">
            {toast && <div className={`adm-toast adm-toast--${toast.type}`} role="status">{toast.msg}</div>}

            <div className="adm__header">
                <div className="adm__header-left">
                    <div className="adm__header-icon"><FiUserPlus /></div>
                    <div>
                        <h1 className="adm__header-title">חברי קהילה</h1>
                        <p className="adm__header-sub">
                            מי שנרשמו בטופס "הצטרפות לקהילה" באתר. מי שנרשם/ה כמה פעמים מופיע/ה פעם אחת.
                        </p>
                    </div>
                </div>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <button type="button" className="adm-btn adm-btn--primary" onClick={openExport} disabled={loading}>
                        <FiMail /> ייצוא לשירות הדיוור
                    </button>
                    <Button variant="outlined" onClick={exportFull} disabled={loading || groups.length === 0}
                        startIcon={<FiDownload />} sx={{ borderRadius: '10px', fontWeight: 700, fontFamily: 'inherit' }}>
                        ייצוא כל הרשימה
                    </Button>
                </Box>
            </div>

            <div className="adm__stats">
                <div className="adm__stat">
                    <span className="adm__stat-num">{stats.all}</span>
                    <span className="adm__stat-label">חברי קהילה</span>
                </div>
                <div className="adm__stat">
                    <span className="adm__stat-num adm__stat-num--green">{stats.updates}</span>
                    <span className="adm__stat-label">ביקשו עדכונים במייל</span>
                </div>
                <div className="adm__stat">
                    <span className="adm__stat-num adm__stat-num--blue">{stats.recent}</span>
                    <span className="adm__stat-label">הצטרפו ב־30 הימים האחרונים</span>
                </div>
            </div>

            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
                <div className="adm__tabs" role="tablist" style={{ marginBottom: 0 }}>
                    {FILTERS.map((f) => (
                        <button key={f.id} type="button" role="tab" aria-selected={filter === f.id}
                            className={`adm__tab${filter === f.id ? ' adm__tab--active' : ''}`} onClick={() => setFilter(f.id)}>
                            {f.label} <span className="adm__tab-count">({stats[f.id]})</span>
                        </button>
                    ))}
                </div>
                <TextField
                    size="small"
                    placeholder="חיפוש לפי שם או אימייל"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ flex: '1 1 220px', maxWidth: 360, '& .MuiOutlinedInput-root': { borderRadius: '999px', background: '#fff' } }}
                    slotProps={{
                        htmlInput: { 'aria-label': 'חיפוש לפי שם או אימייל' },
                        input: { startAdornment: <InputAdornment position="start"><FiSearch /></InputAdornment> },
                    }}
                />
            </Box>

            <div className="adm__table-wrap">
                {loading ? (
                    <div className="adm__loading"><div className="adm__spinner" /> טוען…</div>
                ) : loadError ? (
                    <div className="adm__empty"><p>לא הצלחנו לטעון את הרשימה. רעננו את העמוד ונסו שוב.</p></div>
                ) : visible.length === 0 ? (
                    <div className="adm__empty">
                        <FiUserPlus className="adm__empty-icon" />
                        <p>{groups.length === 0 ? 'עדיין אין חברי קהילה רשומים.' : 'לא נמצאו תוצאות.'}</p>
                    </div>
                ) : (
                    <table className="adm-table">
                        <thead>
                            <tr>
                                <th>שם</th>
                                <th>אימייל</th>
                                <th>עדכונים במייל</th>
                                <th>הצטרפות</th>
                                <th>פעולות</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visible.map((g) => (
                                <tr key={g.email}>
                                    <td>
                                        <span className="adm-table__title">{g.latest.fullName}</span>
                                        {g.ids.length > 1 && (
                                            <span className="adm-table__muted">נרשם/ה {g.ids.length} פעמים</span>
                                        )}
                                    </td>
                                    <td><span dir="ltr">{g.email}</span></td>
                                    <td>
                                        {g.latest.emailUpdates ? (
                                            <span className="adm-badge adm-badge--approved">כן</span>
                                        ) : g.latest.unsubscribedAt ? (
                                            <span className="adm-badge adm-badge--rejected" title={`הוסר/ה דרך הקישור במייל, ${formatDate(g.latest.unsubscribedAt.toDate())}`}>
                                                הוסר/ה
                                            </span>
                                        ) : (
                                            <span className="adm-badge adm-badge--pending">לא</span>
                                        )}
                                    </td>
                                    <td>{formatDate(g.firstJoined)}</td>
                                    <td className="adm-table__actions">
                                        <button type="button" className="adm-icon-btn adm-icon-btn--danger" title="מחיקה"
                                            aria-label={`מחיקת ${g.latest.fullName}`} onClick={() => remove(g)}>
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ── Mailing export ── */}
            <Dialog open={exportOpen} onClose={() => setExportOpen(false)} maxWidth="xs" fullWidth dir="rtl">
                <DialogTitle sx={{ fontWeight: 800 }}>ייצוא לשירות הדיוור</DialogTitle>
                <DialogContent dividers>
                    <RadioGroup
                        value={exportMode}
                        onChange={(e) => setExportMode(e.target.value as 'all' | 'since')}
                        aria-label="מי ייכלל בקובץ"
                    >
                        <FormControlLabel
                            value="all"
                            control={<Radio />}
                            label={`כל מי שביקשו עדכונים (${stats.updates})`}
                        />
                        <FormControlLabel
                            value="since"
                            control={<Radio />}
                            label={`רק מי שנרשמו מתאריך מסוים${exportMode === 'since' ? ` (${exportCount})` : ''}`}
                        />
                    </RadioGroup>

                    {exportMode === 'since' && (
                        <TextField
                            type="date"
                            size="small"
                            label="מתאריך (כולל)"
                            value={sinceDay}
                            onChange={(e) => setSinceDay(e.target.value)}
                            sx={{ mt: 1, marginInlineStart: '32px', width: 200 }}
                            slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: isoDay(new Date()) } }}
                        />
                    )}

                    <Box sx={{ mt: 2, fontSize: '0.85rem', color: '#5b6b7b', lineHeight: 1.7 }}>
                        {lastExport
                            ? <>הייצוא הקודם מהדפדפן הזה: {formatDay(lastExport)}. כדי לא להחזיר לרשימה מי שהסיר/ה את עצמו/ה, ייבאו בכל פעם רק את מי שנרשמו מאז.</>
                            : <>אחרי הייצוא הראשון, כדאי לייצא בכל פעם רק את מי שנרשמו מאז הייצוא הקודם.</>}
                        <br />
                        ייבוא ב־Resend: <bdi dir="ltr">Audience → Add contacts → Import CSV</bdi>. לא לפתוח ולשמור את הקובץ ב־Excel לפני הייבוא.
                    </Box>
                </DialogContent>
                <DialogActions sx={{ gap: 1, px: 3, py: 2 }}>
                    <Button onClick={() => setExportOpen(false)}>ביטול</Button>
                    <Button
                        variant="contained"
                        onClick={exportMailing}
                        disabled={exportCount === 0 || (exportMode === 'since' && !sinceDay)}
                        startIcon={<FiDownload />}
                        sx={{ fontWeight: 700 }}
                    >
                        {exportCount === 0 ? 'אין מי לייצא' : `הורדת הקובץ (${exportCount})`}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CommunityAdmin;