import React, { useState, useRef } from 'react';
import { FiX, FiArrowLeft, FiArrowRight, FiUpload, FiLink, FiCheck } from 'react-icons/fi';
import { submitArticleForReview } from '../../../services/blogService';
import type { ArticleCategory, ArticleSubmission } from '../../../types/blog';
import './SubmitArticleModal.scss';

interface Props {
    open: boolean;
    onClose: () => void;
}

const CATEGORIES: ArticleCategory[] = [
    'חוויות הורים', 'מידע רפואי', 'תמיכה רגשית',
    'זכויות וסיוע', 'חדשות וחקר', 'כללי',
];

const AUTHOR_ROLES = [
    'הורה מנוסה', 'הורה חדש במסע', 'איש מקצוע', 'צוות העמותה', 'אחר',
];

const STEPS = ['פרטים אישיים', 'המאמר', 'תמונה ותגיות', 'סיכום'];

type ImageMode = 'url' | 'file';

const empty: ArticleSubmission = {
    title: '', summary: '', content: '',
    category: 'כללי', author: '', authorRole: '',
    authorEmail: '',
    coverImage: '', tags: [],
};

const SubmitArticleModal: React.FC<Props> = ({ open, onClose }) => {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState<ArticleSubmission>(empty);
    const [tagInput, setTagInput] = useState('');
    const [imageMode, setImageMode] = useState<ImageMode>('url');
    const [previewUrl, setPreviewUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileRef = useRef<HTMLInputElement>(null);

    if (!open) return null;

    const set = (field: keyof ArticleSubmission, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    // ── File upload → convert to base64 data URL ──────────────────────────
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 3 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, coverImage: 'הקובץ גדול מדי — מקסימום 3MB' }));
            return;
        }
        const reader = new FileReader();
        reader.onload = ev => {
            const url = ev.target?.result as string;
            setPreviewUrl(url);
            set('coverImage', url);
        };
        reader.readAsDataURL(file);
    };

    // ── Tags ──────────────────────────────────────────────────────────────
    const addTag = () => {
        const tag = tagInput.trim();
        if (!tag || (form.tags ?? []).includes(tag)) return;
        set('tags', [...(form.tags ?? []), tag]);
        setTagInput('');
    };

    const removeTag = (tag: string) =>
        set('tags', (form.tags ?? []).filter(t => t !== tag));

    // ── Validation per step ───────────────────────────────────────────────
    const validate = (): boolean => {
        const e: Record<string, string> = {};
        if (step === 0) {
            if (!form.author.trim()) e.author = 'שם חובה';
            if (!form.authorRole) e.authorRole = 'בחר תפקיד';
        }
        if (step === 1) {
            if (!form.title.trim()) e.title = 'כותרת חובה';
            if (!form.summary.trim()) e.summary = 'תקציר חובה';
            if (form.summary.length > 300) e.summary = 'תקציר ארוך מדי — עד 300 תווים';
            if (!form.content.trim()) e.content = 'תוכן המאמר חובה';
            if (form.content.length < 100) e.content = 'המאמר קצר מדי — לפחות 100 תווים';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const next = () => { if (validate()) setStep(s => s + 1); };
    const back = () => setStep(s => s - 1);

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            await submitArticleForReview(form);
            setDone(true);
        } catch {
            setErrors({ submit: 'שגיאה בשליחה. נסה שוב.' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setStep(0); setForm(empty); setDone(false);
        setErrors({}); setPreviewUrl(''); setTagInput('');
        onClose();
    };

    // ── Render ────────────────────────────────────────────────────────────
    return (
        <div className="submit-modal__overlay" onClick={e => e.target === e.currentTarget && handleClose()}>
            <div className="submit-modal" dir="rtl" role="dialog" aria-modal="true" aria-label="שליחת מאמר">

                {/* Header */}
                <div className="submit-modal__header">
                    <h2 className="submit-modal__title">שלח/י מאמר לקהילה</h2>
                    <button className="submit-modal__close" onClick={handleClose} aria-label="סגור"><FiX size={20} /></button>
                </div>

                {/* Success state */}
                {done ? (
                    <div className="submit-modal__success">
                        <div className="submit-modal__success-icon"><FiCheck size={32} /></div>
                        <h3>תודה! המאמר שלך נשלח לבדיקה</h3>
                        <p>נבדוק את המאמר ונפרסם אותו בקרוב. נשלח לך הודעה לאחר האישור.</p>
                        <button className="submit-modal__btn submit-modal__btn--primary" onClick={handleClose}>סגור</button>
                    </div>
                ) : (
                    <>
                        {/* Progress steps */}
                        <div className="submit-modal__steps">
                            {STEPS.map((label, i) => (
                                <div key={label} className={`submit-modal__step${i === step ? ' submit-modal__step--active' : ''}${i < step ? ' submit-modal__step--done' : ''}`}>
                                    <div className="submit-modal__step-dot">{i < step ? <FiCheck size={11} /> : i + 1}</div>
                                    <span className="submit-modal__step-label">{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Step content */}
                        <div className="submit-modal__body">

                            {/* ── Step 0: Personal details ─────────────────────────── */}
                            {step === 0 && (
                                <div className="submit-modal__fields">
                                    <div className="submit-modal__field">
                                        <label className="submit-modal__label">שם מלא *</label>
                                        <input className={`submit-modal__input${errors.author ? ' submit-modal__input--error' : ''}`}
                                            value={form.author} onChange={e => set('author', e.target.value)}
                                            placeholder="השם שיופיע על המאמר" dir="rtl" />
                                        {errors.author && <span className="submit-modal__error">{errors.author}</span>}
                                    </div>
                                    <div className="submit-modal__field">
                                        <label className="submit-modal__label">
                                            דואר אלקטרוני <span className="submit-modal__hint">(אופציונלי — לעדכון לאחר פרסום)</span>
                                        </label>
                                        <input
                                            className="submit-modal__input"
                                            value={form.authorEmail}
                                            onChange={e => set('authorEmail', e.target.value)}
                                            placeholder="your@email.com"
                                            type="email"
                                            dir="ltr"
                                        />
                                    </div>
                                    <div className="submit-modal__field">
                                        <label className="submit-modal__label">אני *</label>
                                        <div className="submit-modal__role-grid">
                                            {AUTHOR_ROLES.map(role => (
                                                <button key={role} type="button"
                                                    className={`submit-modal__role-btn${form.authorRole === role ? ' submit-modal__role-btn--active' : ''}`}
                                                    onClick={() => set('authorRole', role)}>{role}</button>
                                            ))}
                                        </div>
                                        {errors.authorRole && <span className="submit-modal__error">{errors.authorRole}</span>}
                                    </div>
                                </div>
                            )}

                            {/* ── Step 1: Article content ──────────────────────────── */}
                            {step === 1 && (
                                <div className="submit-modal__fields">
                                    <div className="submit-modal__field">
                                        <label className="submit-modal__label">קטגוריה *</label>
                                        <div className="submit-modal__category-grid">
                                            {CATEGORIES.map(cat => (
                                                <button key={cat} type="button"
                                                    className={`submit-modal__cat-btn${form.category === cat ? ' submit-modal__cat-btn--active' : ''}`}
                                                    onClick={() => set('category', cat)}>{cat}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="submit-modal__field">
                                        <label className="submit-modal__label">כותרת המאמר *</label>
                                        <input className={`submit-modal__input${errors.title ? ' submit-modal__input--error' : ''}`}
                                            value={form.title} onChange={e => set('title', e.target.value)}
                                            placeholder="כותרת ברורה ומושכת..." dir="rtl" />
                                        {errors.title && <span className="submit-modal__error">{errors.title}</span>}
                                    </div>
                                    <div className="submit-modal__field">
                                        <label className="submit-modal__label">תקציר קצר * <span className="submit-modal__hint">(עד 300 תווים — יופיע בכרטיס המאמר)</span></label>
                                        <textarea className={`submit-modal__textarea submit-modal__textarea--short${errors.summary ? ' submit-modal__input--error' : ''}`}
                                            value={form.summary} onChange={e => set('summary', e.target.value)}
                                            placeholder="2-3 משפטים שיסבירו על מה המאמר..." rows={3} dir="rtl" maxLength={300} />
                                        <span className="submit-modal__char-count">{form.summary.length}/300</span>
                                        {errors.summary && <span className="submit-modal__error">{errors.summary}</span>}
                                    </div>
                                    <div className="submit-modal__field">
                                        <label className="submit-modal__label">תוכן המאמר * <span className="submit-modal__hint">(ניתן לכתוב בחופשיות — נוסיף עיצוב לפני הפרסום)</span></label>
                                        <textarea className={`submit-modal__textarea submit-modal__textarea--tall${errors.content ? ' submit-modal__input--error' : ''}`}
                                            value={form.content} onChange={e => set('content', e.target.value)}
                                            placeholder="כתבו את המאמר שלכם כאן..." rows={12} dir="rtl" />
                                        <span className="submit-modal__char-count">{form.content.length} תווים</span>
                                        {errors.content && <span className="submit-modal__error">{errors.content}</span>}
                                    </div>
                                </div>
                            )}

                            {/* ── Step 2: Image + tags ─────────────────────────────── */}
                            {step === 2 && (
                                <div className="submit-modal__fields">
                                    <div className="submit-modal__field">
                                        <label className="submit-modal__label">תמונת כותרת (אופציונלי)</label>
                                        <div className="submit-modal__image-toggle">
                                            <button type="button"
                                                className={`submit-modal__toggle-btn${imageMode === 'url' ? ' submit-modal__toggle-btn--active' : ''}`}
                                                onClick={() => setImageMode('url')}><FiLink size={14} /> קישור URL</button>
                                            <button type="button"
                                                className={`submit-modal__toggle-btn${imageMode === 'file' ? ' submit-modal__toggle-btn--active' : ''}`}
                                                onClick={() => setImageMode('file')}><FiUpload size={14} /> העלאת קובץ</button>
                                        </div>

                                        {imageMode === 'url' ? (
                                            <input className="submit-modal__input" dir="ltr"
                                                value={typeof form.coverImage === 'string' && !form.coverImage.startsWith('data:') ? form.coverImage : ''}
                                                onChange={e => { set('coverImage', e.target.value); setPreviewUrl(e.target.value); }}
                                                placeholder="https://example.com/image.jpg" />
                                        ) : (
                                            <div className="submit-modal__upload-area" onClick={() => fileRef.current?.click()}>
                                                <FiUpload size={24} />
                                                <span>לחץ להעלאת תמונה (מקסימום 3MB)</span>
                                                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
                                            </div>
                                        )}

                                        {errors.coverImage && <span className="submit-modal__error">{errors.coverImage}</span>}

                                        {previewUrl && (
                                            <div className="submit-modal__image-preview">
                                                <img src={previewUrl} alt="תצוגה מקדימה" onError={() => setPreviewUrl('')} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="submit-modal__field">
                                        <label className="submit-modal__label">תגיות (אופציונלי)</label>
                                        <div className="submit-modal__tag-input-row">
                                            <input className="submit-modal__input" value={tagInput}
                                                onChange={e => setTagInput(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                                placeholder="הקלד תגית ולחץ Enter..." dir="rtl" />
                                            <button type="button" className="submit-modal__tag-add-btn" onClick={addTag}>הוסף</button>
                                        </div>
                                        <div className="submit-modal__tags">
                                            {(form.tags ?? []).map(tag => (
                                                <span key={tag} className="submit-modal__tag">
                                                    {tag}
                                                    <button type="button" onClick={() => removeTag(tag)} aria-label={`הסר תגית ${tag}`}>×</button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Step 3: Preview ──────────────────────────────────── */}
                            {step === 3 && (
                                <div className="submit-modal__preview">
                                    <h3 className="submit-modal__preview-title">סיכום לפני שליחה</h3>
                                    {previewUrl && <img src={previewUrl} alt="תמונת כותרת" className="submit-modal__preview-img" />}
                                    <div className="submit-modal__preview-row"><span>כותרת:</span><strong>{form.title}</strong></div>
                                    <div className="submit-modal__preview-row"><span>קטגוריה:</span><strong>{form.category}</strong></div>
                                    <div className="submit-modal__preview-row"><span>מחבר/ת:</span><strong>{form.author} · {form.authorRole}</strong></div>
                                    {form.authorEmail && (<div className="submit-modal__preview-row"><span>אימייל:</span><strong dir="ltr">{form.authorEmail}</strong></div>)}
                                    <div className="submit-modal__preview-row"><span>תקציר:</span><p>{form.summary}</p></div>
                                    {(form.tags ?? []).length > 0 && (
                                        <div className="submit-modal__preview-row">
                                            <span>תגיות:</span>
                                            <div className="submit-modal__tags">{(form.tags ?? []).map(t => <span key={t} className="submit-modal__tag">{t}</span>)}</div>
                                        </div>
                                    )}
                                    <p className="submit-modal__preview-note">⚠️ המאמר יישלח לבדיקה ויפורסם לאחר אישור הצוות.</p>
                                    {errors.submit && <p className="submit-modal__error">{errors.submit}</p>}
                                </div>
                            )}
                        </div>

                        {/* Footer nav */}
                        <div className="submit-modal__footer">
                            {step > 0 && (
                                <button type="button" className="submit-modal__btn submit-modal__btn--secondary" onClick={back}>
                                    <FiArrowRight size={15} /> הקודם
                                </button>
                            )}
                            <div style={{ flex: 1 }} />
                            {step < STEPS.length - 1 ? (
                                <button type="button" className="submit-modal__btn submit-modal__btn--primary" onClick={next}>
                                    הבא <FiArrowLeft size={15} />
                                </button>
                            ) : (
                                <button type="button" className="submit-modal__btn submit-modal__btn--primary"
                                    onClick={handleSubmit} disabled={submitting}>
                                    {submitting ? 'שולח...' : <><FiCheck size={15} /> שלח לבדיקה</>}
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SubmitArticleModal;