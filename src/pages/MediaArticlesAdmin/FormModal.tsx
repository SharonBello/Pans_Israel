import React, { useState, useRef } from 'react';
import { FiX, FiSave, FiChevronDown, FiLink, FiUpload } from 'react-icons/fi';
import { MdNewspaper, MdPictureAsPdf } from 'react-icons/md';
import { FaYoutube, FaFacebook, FaTiktok } from 'react-icons/fa';
import { type MediaArticleFormData, type MediaArticleCategory, type MediaType, CATEGORY_LABELS } from '../../types/mediaArticle';
import { fetchUrlMetadata } from '../../utils/fetchUrlMetadata';
import { detectMediaType } from '../MediaCoveragePage/MediaArticleFormData';

// ── Cloudinary config (same as your existing pdf_articles setup) ──────────────
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dcbbqlssh';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'mlfsfbrz';

const uploadPdfToCloudinary = async (
    file: File,
    onProgress: (pct: number) => void,
): Promise<{ url: string; thumbUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('resource_type', 'auto');
    formData.append('folder', 'pdfs/articles');

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`);

        xhr.upload.onprogress = e => {
            if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
        };

        xhr.onload = () => {
            try {
                const data = JSON.parse(xhr.responseText);
                if (xhr.status === 200 && data.secure_url) {
                    const url = data.secure_url as string;
                    const thumbUrl = url
                        .replace('/auto/upload/', '/image/upload/w_400,f_jpg,pg_1/')
                        .replace(/\.pdf$/i, '.jpg');
                    resolve({ url, thumbUrl });
                } else {
                    reject(new Error(data.error?.message || 'שגיאה בהעלאה'));
                }
            } catch { reject(new Error('שגיאה בהעלאה')); }
        };

        xhr.onerror = () => reject(new Error('שגיאת רשת בהעלאה'));
        xhr.send(formData);
    });
};

// ── Props ─────────────────────────────────────────────────────────────────────
export interface FormModalProps {
    initial: MediaArticleFormData;
    onSave: (data: MediaArticleFormData) => Promise<void>;
    onClose: () => void;
    saving: boolean;
}

const getPublication = (url: string): string => {
    try {
        const { hostname } = new URL(url);
        const map: Record<string, string> = {
            'www.ynet.co.il': 'ynet', 'ynet.co.il': 'ynet',
            'www.mako.co.il': 'מאקו', 'mako.co.il': 'מאקו',
            'www.haaretz.co.il': 'הארץ', 'haaretz.co.il': 'הארץ',
            'www.walla.co.il': 'וואלה', 'walla.co.il': 'וואלה',
            'www.israelhayom.co.il': 'ישראל היום',
            'www.kan.org.il': 'כאן', 'kan.org.il': 'כאן',
            'www.timesofisrael.com': 'Times of Israel',
        };
        return map[hostname] || hostname.replace(/^www\./, '');
    } catch { return ''; }
};

const MEDIA_TYPE_OPTIONS: { value: MediaType; label: string; color: string; icon: React.ReactNode }[] = [
    { value: 'article', label: 'כתבה', color: '#023373', icon: <MdNewspaper /> },
    { value: 'youtube', label: 'YouTube', color: '#FF0000', icon: <FaYoutube /> },
    { value: 'facebook', label: 'Facebook', color: '#1877F2', icon: <FaFacebook /> },
    { value: 'tiktok', label: 'TikTok', color: '#010101', icon: <FaTiktok /> },
    { value: 'pdf', label: 'PDF', color: '#E53E3E', icon: <MdPictureAsPdf /> },
];

// ── Component ─────────────────────────────────────────────────────────────────
const FormModal: React.FC<FormModalProps> = ({ initial, onSave, onClose, saving }) => {
    const [form, setForm] = useState<MediaArticleFormData>(initial);
    const [errors, setErrors] = useState<Partial<Record<keyof MediaArticleFormData, string>>>({});
    const [fetching, setFetching] = useState(false);
    const [fetchError, setFetchError] = useState('');
    const [fetchSuccess, setFetchSuccess] = useState(false);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const set = (field: keyof MediaArticleFormData, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const handleUrlChange = (url: string) => {
        set('url', url);
        if (url.length > 10) {
            set('mediaType', detectMediaType(url));
            setFetchError('');
        }
    };

    // ── PDF file picker ───────────────────────────────────────────────────────
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        if (f.type !== 'application/pdf') {
            setErrors(prev => ({ ...prev, url: 'ניתן להעלות קבצי PDF בלבד' }));
            return;
        }
        if (f.size > 20 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, url: 'הקובץ גדול מדי — מקסימום 20MB' }));
            return;
        }
        setPdfFile(f);
        // Use filename (without extension) as default title if empty
        if (!form.title) {
            set('title', f.name.replace(/\.pdf$/i, '').replace(/_/g, ' '));
        }
        setErrors(prev => ({ ...prev, url: undefined }));
    };

    // ── Upload PDF then save ──────────────────────────────────────────────────
    const handlePdfUploadAndSave = async () => {
        if (!pdfFile) {
            setErrors(prev => ({ ...prev, url: 'יש לבחור קובץ PDF' }));
            return;
        }
        if (!form.title.trim()) {
            setErrors(prev => ({ ...prev, title: 'שדה חובה' }));
            return;
        }
        if (!form.datePublished) {
            setErrors(prev => ({ ...prev, datePublished: 'שדה חובה' }));
            return;
        }
        setUploading(true);
        setFetchError('');
        try {
            const { url, thumbUrl } = await uploadPdfToCloudinary(pdfFile, setUploadProgress);
            await onSave({ ...form, url, thumbnailUrl: thumbUrl, mediaType: 'pdf' });
        } catch (err: any) {
            setFetchError(err.message || 'שגיאה בהעלאת הקובץ');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    // ── Fetch metadata (for articles) ─────────────────────────────────────────
    const handleFetchMetadata = async () => {
        if (!form.url.trim()) {
            setErrors(prev => ({ ...prev, url: 'הכנס כתובת URL תחילה' }));
            return;
        }
        const type = form.mediaType || detectMediaType(form.url);
        if (type !== 'article') {
            const pub = getPublication(form.url);
            if (pub) set('publication', pub);
            setFetchSuccess(true);
            setTimeout(() => setFetchSuccess(false), 2000);
            return;
        }
        setFetching(true); setFetchError(''); setFetchSuccess(false);
        try {
            const meta = await fetchUrlMetadata(form.url.trim());
            setForm(prev => ({
                ...prev,
                title: meta.title || prev.title,
                summary: meta.description || prev.summary,
                thumbnailUrl: meta.imageUrl || prev.thumbnailUrl,
                publication: meta.publication || prev.publication,
                datePublished: meta.datePublished || prev.datePublished,
            }));
            if (meta.title) { setFetchSuccess(true); setTimeout(() => setFetchSuccess(false), 3000); }
            else if (meta.publication) setFetchError('שם המקור מולא. הוסיפו כותרת ותקציר ידנית.');
        } catch (err: any) {
            setFetchError(err.message || 'שגיאה בשליפת הפרטים');
        } finally { setFetching(false); }
    };

    const validate = (): boolean => {
        const e: typeof errors = {};
        const type = form.mediaType || 'article';
        if (type !== 'pdf') {
            if (!form.url.trim()) e.url = 'שדה חובה';
            else if (!/^https?:\/\/.+/.test(form.url)) e.url = 'כתובת URL לא תקינה';
        }
        if (type === 'article' && !form.title.trim()) e.title = 'שדה חובה';
        if (type === 'article' && !form.publication.trim()) e.publication = 'שדה חובה';
        if (type === 'article' && !form.summary.trim()) e.summary = 'שדה חובה';
        if (!form.datePublished) e.datePublished = 'שדה חובה';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (form.mediaType === 'pdf') { await handlePdfUploadAndSave(); return; }
        if (!validate()) return;
        await onSave(form);
    };

    const currentType = form.mediaType || 'article';
    const isArticle = currentType === 'article';
    const isPdf = currentType === 'pdf';
    const typeOption = MEDIA_TYPE_OPTIONS.find(o => o.value === currentType);

    const thumbPreview = isPdf && pdfFile
        ? URL.createObjectURL(pdfFile)   // local preview — just shows filename
        : form.thumbnailUrl;

    return (
        <div className="mca-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="mca-modal" dir="rtl">

                <div className="mca-modal__header">
                    <h2 className="mca-modal__title">{initial.title ? 'עריכת תוכן' : 'הוספת תוכן חדש'}</h2>
                    <button className="mca-modal__close" onClick={onClose} aria-label="סגור"><FiX /></button>
                </div>

                <div className="mca-modal__body">

                    {/* ── Type selector ── */}
                    <div className="mca-field">
                        <label className="mca-field__label">סוג תוכן</label>
                        <div className="mca-type-selector">
                            {MEDIA_TYPE_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    className={`mca-type-btn ${currentType === opt.value ? 'mca-type-btn--active' : ''}`}
                                    style={currentType === opt.value
                                        ? { borderColor: opt.color, color: opt.color, background: `${opt.color}12` }
                                        : {}}
                                    onClick={() => { set('mediaType', opt.value); setPdfFile(null); setFetchError(''); }}
                                >
                                    {opt.icon} {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── PDF upload zone ── */}
                    {isPdf ? (
                        <div className="mca-field">
                            <label className="mca-field__label">קובץ PDF *</label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                            <div
                                className={`mca-pdf-drop ${pdfFile ? 'mca-pdf-drop--selected' : ''}`}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {pdfFile ? (
                                    <>
                                        <MdPictureAsPdf className="mca-pdf-drop__icon mca-pdf-drop__icon--ready" />
                                        <span className="mca-pdf-drop__name">{pdfFile.name}</span>
                                        <span className="mca-pdf-drop__size">
                                            {(pdfFile.size / 1024 / 1024).toFixed(1)} MB — לחצו להחלפה
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <FiUpload className="mca-pdf-drop__icon" />
                                        <span className="mca-pdf-drop__label">לחצו לבחירת קובץ PDF</span>
                                        <span className="mca-pdf-drop__hint">מקסימום 20MB</span>
                                    </>
                                )}
                            </div>
                            {errors.url && <span className="mca-field__error">{errors.url}</span>}

                            {/* Upload progress */}
                            {uploading && (
                                <div className="mca-upload-progress">
                                    <div className="mca-upload-progress__bar">
                                        <div className="mca-upload-progress__fill" style={{ width: `${uploadProgress}%` }} />
                                    </div>
                                    <span className="mca-upload-progress__label">מעלה... {uploadProgress}%</span>
                                </div>
                            )}

                            {fetchError && <div className="mca-fetch-error">⚠️ {fetchError}</div>}
                        </div>
                    ) : (
                        /* ── URL + fetch (non-PDF) ── */
                        <div className="mca-field">
                            <label className="mca-field__label">
                                קישור{typeOption && (
                                    <span className="mca-field__label-hint" style={{ color: typeOption.color }}>
                                        {' '}({typeOption.label})
                                    </span>
                                )} *
                            </label>
                            <div className="mca-field__url-row">
                                <input
                                    className={`mca-field__input mca-field__input--url ${errors.url ? 'mca-field__input--error' : ''}`}
                                    value={form.url}
                                    onChange={e => handleUrlChange(e.target.value)}
                                    placeholder={
                                        currentType === 'youtube' ? 'https://www.youtube.com/watch?v=...' :
                                            currentType === 'facebook' ? 'https://www.facebook.com/...' :
                                                currentType === 'tiktok' ? 'https://www.tiktok.com/@.../video/...' :
                                                    'https://www.ynet.co.il/...'
                                    }
                                    dir="ltr"
                                    onKeyDown={e => e.key === 'Enter' && handleFetchMetadata()}
                                />
                                <button
                                    type="button"
                                    className={`mca-fetch-btn ${fetching ? 'mca-fetch-btn--loading' : ''} ${fetchSuccess ? 'mca-fetch-btn--success' : ''}`}
                                    onClick={handleFetchMetadata}
                                    disabled={fetching || !form.url.trim()}
                                >
                                    {fetching ? <span className="mca-fetch-btn__spinner" /> :
                                        fetchSuccess ? <>✓ <span>עודכן!</span></> :
                                            <><FiLink /> <span>שלוף פרטים</span></>}
                                </button>
                            </div>
                            {errors.url && <span className="mca-field__error">{errors.url}</span>}
                            {fetchError && <div className="mca-fetch-error">⚠️ {fetchError}</div>}
                            {fetchSuccess && !fetchError && (
                                <div className="mca-fetch-success">✓ הפרטים נשלפו — בדקו ותקנו לפי הצורך</div>
                            )}
                        </div>
                    )}

                    {/* ── Date ── */}
                    <div className="mca-field">
                        <label className="mca-field__label">תאריך *</label>
                        <input
                            className={`mca-field__input ${errors.datePublished ? 'mca-field__input--error' : ''}`}
                            type="date"
                            value={form.datePublished}
                            onChange={e => set('datePublished', e.target.value)}
                        />
                        {errors.datePublished && <span className="mca-field__error">{errors.datePublished}</span>}
                    </div>

                    {/* ── Title ── */}
                    <div className="mca-field">
                        <label className="mca-field__label">
                            כותרת {(isArticle || isPdf) ? '*' : '(אופציונלי)'}
                        </label>
                        <input
                            className={`mca-field__input ${errors.title ? 'mca-field__input--error' : ''}`}
                            value={form.title}
                            onChange={e => set('title', e.target.value)}
                            placeholder="כותרת שתופיע מתחת לתוכן"
                            dir="rtl"
                        />
                        {errors.title && <span className="mca-field__error">{errors.title}</span>}
                    </div>

                    {/* ── Article-only fields ── */}
                    {isArticle && (
                        <>
                            <div className="mca-field-row">
                                <div className="mca-field">
                                    <label className="mca-field__label">שם הפרסום *</label>
                                    <input
                                        className={`mca-field__input ${errors.publication ? 'mca-field__input--error' : ''}`}
                                        value={form.publication}
                                        onChange={e => set('publication', e.target.value)}
                                        placeholder="ynet, מאקו, הארץ..."
                                        dir="rtl"
                                        list="publications-list"
                                    />
                                    <datalist id="publications-list">
                                        {['ynet', 'מאקו', 'הארץ', 'ידיעות אחרונות', 'וואלה', 'ישראל היום', 'כאן', 'Times of Israel'].map(p => (
                                            <option key={p} value={p} />
                                        ))}
                                    </datalist>
                                    {errors.publication && <span className="mca-field__error">{errors.publication}</span>}
                                </div>
                                <div className="mca-field">
                                    <label className="mca-field__label">קטגוריה</label>
                                    <div className="mca-field__select-wrap">
                                        <select
                                            className="mca-field__select"
                                            value={form.category}
                                            onChange={e => set('category', e.target.value as MediaArticleCategory)}
                                        >
                                            {(Object.keys(CATEGORY_LABELS) as MediaArticleCategory[]).map(cat => (
                                                <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                                            ))}
                                        </select>
                                        <FiChevronDown className="mca-field__select-icon" />
                                    </div>
                                </div>
                            </div>

                            <div className="mca-field">
                                <label className="mca-field__label">תקציר *</label>
                                <textarea
                                    className={`mca-field__textarea ${errors.summary ? 'mca-field__input--error' : ''}`}
                                    value={form.summary}
                                    onChange={e => set('summary', e.target.value)}
                                    placeholder="תיאור קצר שיופיע בכרטיסייה"
                                    dir="rtl" rows={3}
                                />
                                {errors.summary && <span className="mca-field__error">{errors.summary}</span>}
                            </div>

                            <div className="mca-field">
                                <label className="mca-field__label">תמונה (URL)</label>
                                <input
                                    className="mca-field__input"
                                    value={form.thumbnailUrl}
                                    onChange={e => set('thumbnailUrl', e.target.value)}
                                    placeholder="נשלף אוטומטית, או הזינו ידנית"
                                    dir="ltr"
                                />
                                {form.thumbnailUrl && (
                                    <div className="mca-field__thumb-preview">
                                        <img src={form.thumbnailUrl} alt="תצוגה מקדימה"
                                            onError={e => (e.currentTarget.style.display = 'none')} />
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* ── Toggles ── */}
                    <div className="mca-field-row mca-field-row--toggles">
                        <label className="mca-toggle">
                            <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} />
                            <span className="mca-toggle__track" />
                            <span className="mca-toggle__label">פורסם באתר</span>
                        </label>
                        <label className="mca-toggle">
                            <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
                            <span className="mca-toggle__track mca-toggle__track--star" />
                            <span className="mca-toggle__label">מוצג בעמוד הבית</span>
                        </label>
                    </div>

                </div>

                <div className="mca-modal__footer">
                    <button className="mca-btn mca-btn--ghost" onClick={onClose} disabled={saving || uploading}>
                        ביטול
                    </button>
                    <button className="mca-btn mca-btn--primary" onClick={handleSubmit} disabled={saving || uploading}>
                        {(saving || uploading) ? <span className="mca-btn__spinner" /> : <FiSave />}
                        {uploading ? `מעלה... ${uploadProgress}%` : saving ? 'שומר...' : 'שמור'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormModal;