import React, { useState, useEffect, useRef } from 'react';
import { FiMessageCircle, FiSend, FiUser } from 'react-icons/fi';
import { getComments, submitComment } from '../../../services/blogService';
import type { Comment, CommentFormData } from '../../../types/blog';
import ReCAPTCHA from 'react-google-recaptcha';
import './CommentSection.scss';

interface Props {
    articleId: string;
    articleTitle: string;
}

const formatDate = (ts: any): string => {
    if (!ts) return '';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' });
};

const CommentSection: React.FC<Props> = ({ articleId, articleTitle }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState<CommentFormData>({ authorName: '', content: '' });
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        setLoading(true);
        getComments(articleId)
            .then(data => { if (active) setComments(data); })
            .catch(() => { })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [articleId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.authorName.trim() || !form.content.trim()) {
            setError('נא למלא את כל השדות.');
            return;
        }
        if (form.content.trim().length < 10) {
            setError('התגובה קצרה מדי — נא כתוב לפחות 10 תווים.');
            return;
        }
        setSubmitting(true);
        setError(null);

        if (!captchaToken) {
            setError('אנא אשר שאינך רובוט');
            return;
        }

        try {
            const newComment = await submitComment(articleId, articleTitle, form);
            setComments(prev => [...prev, newComment]);
            setForm({ authorName: '', content: '' });
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 4000);
            recaptchaRef.current?.reset();
            setCaptchaToken(null);
        } catch {
            setError('שגיאה בשליחת התגובה. נסה שוב.');
            recaptchaRef.current?.reset();
            setCaptchaToken(null);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="comment-section" aria-label="תגובות">
            <h3 className="comment-section__heading">
                <FiMessageCircle />תגובות ({comments.length})
            </h3>

            {loading ? (
                <div className="comment-section__loading">טוען תגובות...</div>
            ) : comments.length === 0 ? (
                <p className="comment-section__empty">היה הראשון להגיב על מאמר זה!</p>
            ) : (
                <ol className="comment-section__list">
                    {comments.map(c => (
                        <li key={c.id} className="comment-section__item">
                            <div className="comment-section__avatar"><FiUser /></div>
                            <div className="comment-section__content">
                                <div className="comment-section__item-header">
                                    <span className="comment-section__author">{c.authorName}</span>
                                    <span className="comment-section__date">{formatDate(c.createdAt)}</span>
                                </div>
                                <p className="comment-section__text">{c.content}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            )}

            <div className="comment-section__form-wrap">
                <h4 className="comment-section__form-heading">הוסף תגובה</h4>
                {submitted && <div className="comment-section__success" role="alert">✅ תגובתך נוספה בהצלחה!</div>}
                <form className="comment-section__form" onSubmit={handleSubmit} noValidate>
                    <div className="comment-section__field">
                        <label htmlFor="authorName" className="comment-section__label">שם מלא *</label>
                        <input
                            id="authorName" name="authorName" type="text"
                            value={form.authorName} onChange={handleChange}
                            placeholder="השם שיופיע לצד התגובה"
                            className="comment-section__input"
                            maxLength={60} disabled={submitting} dir="rtl"
                        />
                    </div>
                    <div className="comment-section__field">
                        <label htmlFor="content" className="comment-section__label">תגובה *</label>
                        <textarea
                            id="content" name="content"
                            value={form.content} onChange={handleChange}
                            placeholder="שתפו את המחשבות שלכם..."
                            className="comment-section__textarea"
                            rows={4} maxLength={1200} disabled={submitting} dir="rtl"
                        />
                        <span className="comment-section__char-count">{form.content.length}/1200</span>
                    </div>
                    {error && <p className="comment-section__error" role="alert">{error}</p>}
                    <div className="comment-section__captcha-wrap">
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY as string}
                            onChange={(token) => setCaptchaToken(token)}
                            onExpired={() => setCaptchaToken(null)}
                            hl="he"
                        />
                    </div>
                    <button type="submit" className="comment-section__submit" disabled={submitting || !captchaToken}>
                        {submitting ? 'שולח...' : <><FiSend size={15} />שלח תגובה</>}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default CommentSection;