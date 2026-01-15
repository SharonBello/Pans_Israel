import React, { useMemo, useState } from 'react';
import type { NewTestimonialPayload, SubmitTestimonialModalProps } from '@/types/testimonials';
import { CloseIcon } from '@/components/icons/Icons';
import './SubmitTestimonialModal.scss';

interface FormState {
    title: string;
    highlight: string;
    content: string;
    tagsText: string;
    isAnonymous: boolean;
    displayName: string,
    authorName: string;
    authorEmail: string;
}

const INITIAL_STATE: FormState = {
    title: '',
    highlight: '',
    content: '',
    tagsText: '',
    isAnonymous: true,
    displayName: '',
    authorName: '',
    authorEmail: '',
};

const parseTags = (tagsText: string): string[] => {
    const tags: string[] = tagsText
        .split(',')
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 0);

    return Array.from(new Set(tags)).slice(0, 8);
};

const makeExcerpt = (content: string, maxLen: number): string => {
    const clean: string = content.replace(/\s+/g, ' ').trim();
    if (clean.length <= maxLen) return clean;
    return `${clean.slice(0, maxLen).trim()}…`;
};

const SubmitTestimonialModal: React.FC<SubmitTestimonialModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}): React.JSX.Element | null => {
    const [form, setForm] = useState<FormState>(INITIAL_STATE);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const tags: string[] = useMemo((): string[] => parseTags(form.tagsText), [form.tagsText]);

    const handleClose = (): void => {
        setForm(INITIAL_STATE);
        setIsSubmitting(false);
        setIsSubmitted(false);
        setError('');
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError('');

        const title: string = form.title.trim();
        const highlight: string = form.highlight.trim();
        const content: string = form.content.trim();

        const payloadBase: NewTestimonialPayload = {
            title,
            highlight,
            excerpt: makeExcerpt(content, 220),
            content,
            tags,
            isAnonymous: form.isAnonymous,
            displayName: form.isAnonymous ? (form.displayName.trim() || 'עדות אנונימית') : form.displayName.trim(),
            status: 'pending',
            authorName: undefined,
            authorEmail: undefined,
        };

        // Never send undefined fields to Firestore — remove them if not used.
        const payload: NewTestimonialPayload = form.isAnonymous
            ? {
                ...payloadBase,
                authorName: '',
                authorEmail: '',
            }
            : {
                ...payloadBase,
                authorName: form.authorName.trim(),
                authorEmail: form.authorEmail.trim(),
            };

        // Remove empty author fields too (cleaner DB)
        if (payload.authorName === '') delete (payload as Record<string, unknown>).authorName;
        if (payload.authorEmail === '') delete (payload as Record<string, unknown>).authorEmail;

        setIsSubmitting(true);

        try {
            await onSubmit(payload);
            setIsSubmitted(true);
        } catch (err: unknown) {
            const message: string = err instanceof Error ? err.message : 'Failed to submit testimonial.';
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={handleClose}>
            <div className="modal" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
                <button className="modal__close" onClick={handleClose} type="button">
                    <CloseIcon />
                </button>

                {isSubmitted ? (
                    <div className="modal__success">
                        <div className="modal__success-icon">✓</div>
                        <h2>תודה רבה!</h2>
                        <p>העדות נשלחה ותפורסם לאחר בדיקה קצרה.</p>
                        <button className="modal__btn" onClick={handleClose} type="button">
                            סגור
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 className="modal__title">שיתוף עדות (אפשר בעילום שם)</h2>
                        <p className="modal__subtitle">עדות קצרה, אמיתית, שעשויה לעזור להורים אחרים.</p>

                        <form onSubmit={handleSubmit} className="modal__form">
                            <div className="modal__field">
                                <label>כותרת *</label>
                                <input
                                    type="text"
                                    required
                                    value={form.title}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setForm((prev: FormState) => ({ ...prev, title: e.target.value }))
                                    }
                                    placeholder="לדוגמה: רגע ששינה לנו את הדרך"
                                />
                            </div>

                            <div className="modal__field">
                                <label>משפט מודגש *</label>
                                <input
                                    type="text"
                                    required
                                    value={form.highlight}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setForm((prev: FormState) => ({ ...prev, highlight: e.target.value }))
                                    }
                                    placeholder="משפט קצר שיופיע בכרטיס העדות"
                                    maxLength={160}
                                />
                            </div>

                            <div className="modal__field">
                                <label>העדות המלאה *</label>
                                <textarea
                                    required
                                    value={form.content}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        setForm((prev: FormState) => ({ ...prev, content: e.target.value }))
                                    }
                                    rows={6}
                                    placeholder="כתבו כאן את הסיפור במילים שלכם..."
                                />
                            </div>

                            <div className="modal__field">
                                <label>תגיות (אופציונלי, מופרד בפסיקים)</label>
                                <input
                                    type="text"
                                    value={form.tagsText}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setForm((prev: FormState) => ({ ...prev, tagsText: e.target.value }))
                                    }
                                    placeholder="לדוגמה: אבחון, בית ספר, חרדה, אנטיביוטיקה"
                                />
                            </div>

                            <div className="modal__row">
                                <label className="modal__checkbox">
                                    <input
                                        type="checkbox"
                                        checked={form.isAnonymous}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setForm((prev: FormState) => ({ ...prev, isAnonymous: e.target.checked }))
                                        }
                                    />
                                    <span>פרסום בעילום שם</span>
                                </label>
                            </div>

                            {!form.isAnonymous && (
                                <div className="modal__row">
                                    <div className="modal__field">
                                        <label>שם לתצוגה</label>
                                        <input
                                            type="text"
                                            value={form.authorName}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setForm((prev: FormState) => ({ ...prev, authorName: e.target.value }))
                                            }
                                            placeholder="שם פרטי או כינוי"
                                        />
                                    </div>

                                    <div className="modal__field">
                                        <label>אימייל (לא יוצג באתר)</label>
                                        <input
                                            type="email"
                                            dir="ltr"
                                            value={form.authorEmail}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setForm((prev: FormState) => ({ ...prev, authorEmail: e.target.value }))
                                            }
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                </div>
                            )}

                            {error && <div className="modal__error">{error}</div>}

                            <button className="modal__submit" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'שולח…' : 'שליחת עדות'}
                            </button>

                            <p className="modal__note">
                                העדות תפורסם לאחר בדיקה כדי לשמור על פרטיות ולהסיר פרטים מזהים.
                            </p>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default SubmitTestimonialModal;
