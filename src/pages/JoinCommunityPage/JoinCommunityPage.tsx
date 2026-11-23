import React, { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import {
    Alert,
    Button,
    Checkbox,
    Collapse,
    FormControlLabel,
    FormHelperText,
    TextField,
} from '@mui/material';
import {
    Groups as GroupsIcon,
    EventAvailable as EventsIcon,
    Forum as ForumIcon,
    MenuBook as ResourcesIcon,
    ExpandMore as ExpandMoreIcon,
    CheckCircleOutline as DoneIcon,
} from '@mui/icons-material';
import SupportPageHero from '@/components/Support/SupportPageHero/SupportPageHero';
import {
    EMAIL_MAX,
    EMAIL_PATTERN,
    NAME_MAX,
    NAME_MIN,
    joinCommunity,
    normalizeEmail,
    normalizeName,
} from '@/services/communityService';
import './JoinCommunityPage.scss';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string;
const FACEBOOK_PAGE_URL =
    'https://www.facebook.com/p/%D7%A4%D7%90%D7%A0%D7%A1-%D7%A4%D7%90%D7%A0%D7%93%D7%A1-%D7%99%D7%A9%D7%A8%D7%90%D7%9C-Pans-Pandas-Israel-61589380803440/';
const WHATSAPP_URL =
    'https://wa.me/972544222683?text=' +
    encodeURIComponent('שלום,\nאני פונה בנושא הפרטים שלי ברשימת חברי הקהילה באתר פאנס/פאנדס ישראל.');

interface FormState {
    fullName: string;
    email: string;
    emailUpdates: boolean;
    privacyAccepted: boolean;
}

type FieldErrors = Partial<Record<'fullName' | 'email' | 'privacyAccepted' | 'captcha', string>>;

const EMPTY_FORM: FormState = { fullName: '', email: '', emailUpdates: false, privacyAccepted: false };

const validate = (form: FormState, captchaToken: string | null): FieldErrors => {
    const errors: FieldErrors = {};
    const name = normalizeName(form.fullName);
    const email = normalizeEmail(form.email);

    if (name.length < NAME_MIN) errors.fullName = 'נא להזין שם מלא';
    else if (name.length > NAME_MAX) errors.fullName = `השם ארוך מדי (עד ${NAME_MAX} תווים)`;

    if (!email) errors.email = 'נא להזין כתובת אימייל';
    else if (email.length > EMAIL_MAX || !EMAIL_PATTERN.test(email)) errors.email = 'כתובת האימייל לא תקינה';

    if (!form.privacyAccepted) errors.privacyAccepted = 'כדי להצטרף צריך לאשר את שמירת הפרטים';
    if (!captchaToken) errors.captcha = 'נא לסמן "אני לא רובוט"';

    return errors;
};

const BENEFITS = [
    {
        Icon: EventsIcon,
        title: 'מפגשים, וובינרים והרצאות',
        text: 'עם רופאים, מטפלים והורים שכבר עברו את הדרך.',
    },
    {
        Icon: ForumIcon,
        title: 'הורים שמבינים',
        text: 'מקום לשאול, לשתף ולקבל עצה ממי שמכיר את ההתמודדות מבפנים.',
    },
    {
        Icon: ResourcesIcon,
        title: 'מידע עדכני בעברית',
        text: 'מחקרים, כלים ומשאבים שמתעדכנים כל הזמן.',
    },
];

const JoinCommunityPage: React.FC = () => {
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [noticeOpen, setNoticeOpen] = useState(false);
    const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle');
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [joined, setJoined] = useState<{ firstName: string; email: string; emailUpdates: boolean; welcomeSent: boolean } | null>(null);

    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const privacyRef = useRef<HTMLInputElement>(null);
    const doneHeadingRef = useRef<HTMLHeadingElement>(null);
    const noticeId = useId();

    // Move focus to the thank-you message so screen readers announce it
    useEffect(() => {
        if (status === 'done') doneHeadingRef.current?.focus();
    }, [status]);

    const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);

        const found = validate(form, captchaToken);
        setErrors(found);
        if (found.fullName) { nameRef.current?.focus(); return; }
        if (found.email) { emailRef.current?.focus(); return; }
        if (found.privacyAccepted) { privacyRef.current?.focus(); return; }
        if (found.captcha) return;

        setStatus('submitting');
        const input = { fullName: form.fullName, email: form.email, emailUpdates: form.emailUpdates };
        const result = await joinCommunity(input, captchaToken ?? '');

        if (result.success) {
            setJoined({
                firstName: normalizeName(form.fullName).split(' ')[0],
                email: normalizeEmail(form.email),
                emailUpdates: form.emailUpdates,
                welcomeSent: result.welcomeSent,
            });
            setForm(EMPTY_FORM);
            setStatus('done');
        } else {
            setSubmitError('לא הצלחנו לשמור את הפרטים. נסו שוב בעוד רגע.');
            setStatus('idle');
        }
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
    };

    return (
        <div className="join-page" dir="rtl">
            <SupportPageHero
                icon={<GroupsIcon />}
                title="הצטרפות לקהילה"
                subtitle="משפחות שמתמודדות עם פאנס/פאנדס, ואנשים שתומכים בהן. השאירו פרטים והיו חלק מהקהילה."
            />

            <div className="join-page__container">
                <section className="join-page__card" aria-labelledby="join-form-title">
                    {status === 'done' && joined ? (
                        <div className="join-page__done" role="status">
                            <DoneIcon className="join-page__done-icon" aria-hidden="true" />
                            <h2 id="join-form-title" ref={doneHeadingRef} tabIndex={-1} className="join-page__title">
                                תודה, {joined.firstName}! הצטרפתם לקהילה.
                            </h2>
                            <p className="join-page__text">
                                {joined.welcomeSent ? (
                                    <>שלחנו מייל ברכה לכתובת <bdi dir="ltr">{joined.email}</bdi>. אם הוא לא מגיע בעוד כמה דקות, כדאי להציץ בתיקיית הספאם.</>
                                ) : joined.emailUpdates ? (
                                    <>כשיהיו מפגשים או מידע חדש, נשלח עדכון לכתובת <bdi dir="ltr">{joined.email}</bdi>.</>
                                ) : (
                                    'בחרתם לא לקבל עדכונים במייל. את כל המפגשים הקרובים אפשר לראות בעמוד הפעילויות.'
                                )}
                            </p>
                            <div className="join-page__done-actions">
                                <Button component={Link} to="/activities" variant="contained" className="join-page__btn">
                                    לפעילויות הקרובות
                                </Button>
                                <Button
                                    href={FACEBOOK_PAGE_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="outlined"
                                    className="join-page__btn join-page__btn--outline"
                                >
                                    לעמוד הפייסבוק שלנו
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <form className="join-page__form" onSubmit={handleSubmit} noValidate>
                            <h2 id="join-form-title" className="join-page__title">השאירו פרטים</h2>
                            <p className="join-page__text">
                                מספיק שם ואימייל. ההצטרפות בחינם, ואפשר לבקש שנמחק את הפרטים בכל עת.
                            </p>

                            <TextField
                                label="שם מלא"
                                name="name"
                                autoComplete="name"
                                value={form.fullName}
                                onChange={(e) => update('fullName', e.target.value)}
                                inputRef={nameRef}
                                error={Boolean(errors.fullName)}
                                helperText={errors.fullName}
                                slotProps={{ htmlInput: { maxLength: NAME_MAX + 20 } }}
                                required
                                fullWidth
                            />

                            <TextField
                                label="אימייל"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={form.email}
                                onChange={(e) => update('email', e.target.value)}
                                inputRef={emailRef}
                                error={Boolean(errors.email)}
                                helperText={errors.email}
                                slotProps={{ htmlInput: { dir: 'ltr', inputMode: 'email', maxLength: EMAIL_MAX } }}
                                required
                                fullWidth
                            />

                            <FormControlLabel
                                className="join-page__check"
                                control={
                                    <Checkbox
                                        checked={form.emailUpdates}
                                        onChange={(e) => update('emailUpdates', e.target.checked)}
                                    />
                                }
                                label="אשמח לקבל במייל עדכונים על מפגשים, הרצאות ומידע חדש. אפשר להפסיק בכל רגע דרך הקישור שבכל מייל."
                            />

                            {/* ── Privacy notice: short, with the full details one click away ── */}
                            <div className="join-page__notice">
                                <p className="join-page__notice-short">
                                    הפרטים נשמרים אצל העמותה, ורק הצוות שלנו רואה אותם. נשתמש בהם רק כדי לדעת מי בקהילה
                                    ולשלוח עדכונים למי שביקש.
                                </p>
                                <button
                                    type="button"
                                    className="join-page__notice-toggle"
                                    aria-expanded={noticeOpen}
                                    aria-controls={noticeId}
                                    onClick={() => setNoticeOpen((open) => !open)}
                                >
                                    {noticeOpen ? 'הסתרת הפרטים' : 'מה בדיוק נעשה עם הפרטים?'}
                                    <ExpandMoreIcon
                                        aria-hidden="true"
                                        className={`join-page__notice-chevron${noticeOpen ? ' join-page__notice-chevron--open' : ''}`}
                                    />
                                </button>
                                <Collapse in={noticeOpen}>
                                    <dl id={noticeId} className="join-page__notice-full">
                                        <dt>מי אוסף את המידע</dt>
                                        <dd>העמותה הישראלית לאנספיליטיס אוטואימוני (פאנס/פאנדס ישראל).</dd>

                                        <dt>מה נשמר</dt>
                                        <dd>שם מלא, כתובת אימייל, האם ביקשתם לקבל עדכונים, ותאריך ההצטרפות.</dd>

                                        <dt>למה</dt>
                                        <dd>כדי לדעת כמה אנשים בקהילה, ולשלוח עדכונים במייל למי שביקש.</dd>

                                        <dt>האם חובה למסור</dt>
                                        <dd>
                                            אין חובה לפי חוק. מוסרים את הפרטים מרצון, ובלי שם ואימייל אי אפשר להצטרף
                                            לרשימה.
                                        </dd>

                                        <dt>מי רואה את המידע</dt>
                                        <dd>
                                            רק אנשי צוות מורשים של העמותה. המידע שמור בשירות הענן Firebase של Google,
                                            שהשרתים שלו עשויים להיות מחוץ לישראל. אם ביקשתם עדכונים, השם והאימייל יועברו
                                            גם לשירות הדיוור שדרכו נשלחים המיילים.
                                        </dd>

                                        <dt>מה לא נעשה</dt>
                                        <dd>לא נמכור את הפרטים, לא נשכיר אותם ולא נמסור אותם לאף גורם אחר.</dd>

                                        <dt>הזכויות שלכם</dt>
                                        <dd>
                                            אפשר לבקש לראות את הפרטים, לתקן אותם או למחוק אותם.{' '}
                                            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                                                פנו אלינו בוואטסאפ
                                            </a>
                                            . להפסקת העדכונים יש קישור הסרה בכל מייל.
                                        </dd>
                                    </dl>
                                </Collapse>
                            </div>

                            <div className="join-page__check-wrap">
                                <FormControlLabel
                                    className="join-page__check"
                                    control={
                                        <Checkbox
                                            checked={form.privacyAccepted}
                                            onChange={(e) => update('privacyAccepted', e.target.checked)}
                                            inputRef={privacyRef}
                                            slotProps={{
                                                input: {
                                                    'aria-required': true,
                                                    'aria-invalid': Boolean(errors.privacyAccepted),
                                                    'aria-describedby': errors.privacyAccepted ? 'join-privacy-error' : undefined,
                                                } as React.InputHTMLAttributes<HTMLInputElement>,
                                            }}
                                        />
                                    }
                                    label="קראתי ואני מסכים/ה שהעמותה תשמור את הפרטים שלי כמתואר כאן *"
                                />
                                {errors.privacyAccepted && (
                                    <FormHelperText id="join-privacy-error" error>{errors.privacyAccepted}</FormHelperText>
                                )}
                            </div>

                            <div className="join-page__captcha">
                                <ReCAPTCHA
                                    ref={recaptchaRef}
                                    sitekey={RECAPTCHA_SITE_KEY}
                                    hl="he"
                                    onChange={(token) => {
                                        setCaptchaToken(token);
                                        setErrors((prev) => ({ ...prev, captcha: undefined }));
                                    }}
                                    onExpired={() => setCaptchaToken(null)}
                                />
                                {errors.captcha && <FormHelperText error>{errors.captcha}</FormHelperText>}
                            </div>

                            {submitError && (
                                <Alert severity="error" className="join-page__alert">{submitError}</Alert>
                            )}

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                className="join-page__btn join-page__submit"
                                disabled={status === 'submitting'}
                            >
                                {status === 'submitting' ? 'שולחים…' : 'הצטרפות לקהילה'}
                            </Button>
                        </form>
                    )}
                </section>

                <aside className="join-page__aside" aria-labelledby="join-benefits-title">
                    <h2 id="join-benefits-title" className="join-page__aside-title">מה מחכה לכם בקהילה</h2>
                    <ul className="join-page__benefits">
                        {BENEFITS.map(({ Icon, title, text }) => (
                            <li key={title} className="join-page__benefit">
                                <span className="join-page__benefit-icon" aria-hidden="true"><Icon /></span>
                                <span>
                                    <strong className="join-page__benefit-title">{title}</strong>
                                    <span className="join-page__benefit-text">{text}</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>
        </div>
    );
};

export default JoinCommunityPage;