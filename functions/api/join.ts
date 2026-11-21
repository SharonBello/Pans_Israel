// ==========================================================================
// Cloudflare Pages Function — POST /api/join
// ==========================================================================
//
// Called by the /join form AFTER the member was saved in Firestore, only when
// they asked for email updates. It:
//   1. checks the reCAPTCHA token with Google (server side — bots can't use
//      this endpoint to send emails),
//   2. adds the person to Resend contacts (best effort: if the email is
//      already there, nothing changes — someone who unsubscribed stays so),
//   3. sends the welcome email.
//
// Secrets (Cloudflare → Pages project → Settings → Variables and Secrets):
//   RESEND_API_KEY        Resend API key (full access, so it can add contacts)
//   RESEND_FROM           e.g. פאנס/פאנדס ישראל <community@panspandasil.org>
//   RECAPTCHA_SECRET_KEY  reCAPTCHA secret key (same site as VITE_RECAPTCHA_SITE_KEY)
//   RESEND_SEGMENT_ID     optional — Resend segment to put new contacts in
//   RESEND_REPLY_TO       optional — address that receives replies

interface Env {
    RESEND_API_KEY?: string;
    RESEND_FROM?: string;
    RECAPTCHA_SECRET_KEY?: string;
    RESEND_SEGMENT_ID?: string;
    RESEND_REPLY_TO?: string;
}

interface JoinContext {
    request: Request;
    env: Env;
}

interface JoinBody {
    fullName?: unknown;
    email?: unknown;
    emailUpdates?: unknown;
    captchaToken?: unknown;
}

const SITE_URL = 'https://panspandasil.org';
const NAME_MIN = 2;
const NAME_MAX = 80;
const EMAIL_MAX = 254;
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const json = (status: number, body: Record<string, unknown>): Response =>
    new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
    });

const escapeHtml = (value: string): string =>
    value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

// ── reCAPTCHA ────────────────────────────────────────────────────────────────

const verifyCaptcha = async (secret: string, token: string, ip: string | null): Promise<boolean> => {
    const form = new URLSearchParams({ secret, response: token });
    if (ip) form.set('remoteip', ip);
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', { method: 'POST', body: form });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
};

// ── Resend ───────────────────────────────────────────────────────────────────

const resend = (env: Env, path: string, body: unknown, idempotencyKey?: string): Promise<Response> =>
    fetch(`https://api.resend.com${path}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
            ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
        },
        body: JSON.stringify(body),
    });

const splitName = (fullName: string): { first: string; last: string } => {
    const [first = '', ...rest] = fullName.split(' ');
    return { first, last: rest.join(' ') };
};

// ── Welcome email (same design as the Resend template welcome.html) ─────────

const FACEBOOK_URL =
    'https://www.facebook.com/p/%D7%A4%D7%90%D7%A0%D7%A1-%D7%A4%D7%90%D7%A0%D7%93%D7%A1-%D7%99%D7%A9%D7%A8%D7%90%D7%9C-Pans-Pandas-Israel-61589380803440/';
const WHATSAPP_URL = 'https://wa.me/972544222683';
const YOUTUBE_URL = 'https://www.youtube.com/@PansPandasIsrael';

const FONT = 'font-family:Heebo, Arial, sans-serif;';

const benefit = (title: string, text: string): string => `
        <tr><td style="padding:10px 14px; background:#f3e8f8; border-radius:10px; ${FONT} font-size:15px; line-height:1.6; color:#0e0d26;">
          <strong>${title}</strong><br>${text}
        </td></tr>`;

const welcomeHtml = (firstName: string): string => {
    const greeting = firstName ? escapeHtml(firstName) : 'לך';
    return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ברוכים הבאים לקהילת פאנס/פאנדס ישראל</title>
<style>
  @media only screen and (max-width: 620px) {
    .px { padding-left: 20px !important; padding-right: 20px !important; }
    .h1 { font-size: 24px !important; }
  }
</style>
</head>
<body style="margin:0; padding:0; background:#f4f6f9;" dir="rtl">
<div style="display:none; max-height:0; overflow:hidden;">שמחים שהצטרפת. הנה מה שמחכה לך בקהילה.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f6f9;" dir="rtl">
<tr><td align="center" style="padding:24px 12px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; background:#ffffff; border-radius:16px; overflow:hidden;" dir="rtl">
    <tr><td class="px" align="right" style="padding:24px 36px 20px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" dir="rtl"><tr>
        <td style="padding-left:10px;"><img src="${SITE_URL}/android-chrome-192x192.png" width="48" height="48" alt="" style="display:block; border:0;"></td>
        <td style="${FONT} line-height:1.1;">
          <div style="font-size:20px; font-weight:800; color:#023373;">פאנס/פאנדס</div>
          <div style="font-size:13px; color:#4a90d9;">ישראל</div>
        </td>
      </tr></table>
    </td></tr>
    <tr><td class="px" align="right" bgcolor="#6a1b9a" style="background:#6a1b9a; background-image:linear-gradient(135deg,#4a148c 0%,#6a1b9a 55%,#7b1fa2 100%); padding:32px 36px; ${FONT}">
      <div style="font-size:13px; font-weight:700; letter-spacing:1px; color:#e1bee7;">תמיכה וקהילה</div>
      <h1 class="h1" style="margin:6px 0 0; font-size:28px; line-height:1.25; font-weight:800; color:#ffffff;">ברוכים הבאים לקהילה</h1>
    </td></tr>
    <tr><td class="px" align="right" style="padding:32px 36px 8px; ${FONT} font-size:16px; line-height:1.7; color:#0e0d26;">
      <p style="margin:0 0 16px; font-size:18px; font-weight:700;">שלום ${greeting},</p>
      <p style="margin:0 0 16px;">תודה שהצטרפת לקהילת פאנס/פאנדס ישראל. כאן נמצאות משפחות שמתמודדות עם פאנס/פאנדס, ואנשים שתומכים בהן. אף אחד לא צריך לעבור את זה לבד.</p>
      <p style="margin:0 0 8px;">מה מחכה לך:</p>
    </td></tr>
    <tr><td class="px" style="padding:0 36px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" dir="rtl">${benefit('מפגשים, וובינרים והרצאות', 'עם רופאים, מטפלים והורים שכבר עברו את הדרך.')}
        <tr><td height="10" style="font-size:0; line-height:0;">&nbsp;</td></tr>${benefit('מידע עדכני בעברית', 'מה זה פאנס/פאנדס, איך מאבחנים, דרכי טיפול ומשאבים להורים.')}
        <tr><td height="10" style="font-size:0; line-height:0;">&nbsp;</td></tr>${benefit('עדכונים במייל', 'נכתוב לך כשנפתחת הרשמה למפגש, להרצאה או לכנס. לא יותר מזה.')}
      </table>
    </td></tr>
    <tr><td class="px" align="right" style="padding:24px 36px 8px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td align="center" bgcolor="#6a1b9a" style="border-radius:999px;">
          <a href="${SITE_URL}/activities" target="_blank" style="display:inline-block; padding:14px 32px; ${FONT} font-size:16px; font-weight:700; color:#ffffff; text-decoration:none; border-radius:999px;">לפעילויות הקרובות</a>
        </td>
      </tr></table>
    </td></tr>
    <tr><td class="px" align="right" style="padding:16px 36px 32px; ${FONT} font-size:15px; line-height:1.7; color:#5b6b7b;">
      יש שאלה? אפשר לכתוב לנו <a href="${WHATSAPP_URL}" target="_blank" style="color:#6a1b9a; font-weight:700;">בוואטסאפ</a> או לעקוב אחרינו <a href="${FACEBOOK_URL}" target="_blank" style="color:#6a1b9a; font-weight:700;">בפייסבוק</a>.<br><br>
      באהבה,<br><strong style="color:#0e0d26;">צוות פאנס/פאנדס ישראל</strong>
    </td></tr>
    <tr><td class="px" align="center" bgcolor="#0e0d26" style="background:#0e0d26; padding:24px 36px; ${FONT} font-size:13px; line-height:1.7; color:#b8c3d1;">
      <a href="${SITE_URL}" target="_blank" style="color:#ffffff; text-decoration:none; font-weight:700;">panspandasil.org</a>
      &nbsp;·&nbsp; <a href="${FACEBOOK_URL}" target="_blank" style="color:#ffffff; text-decoration:none;">פייסבוק</a>
      &nbsp;·&nbsp; <a href="${YOUTUBE_URL}" target="_blank" style="color:#ffffff; text-decoration:none;">יוטיוב</a>
      &nbsp;·&nbsp; <a href="${WHATSAPP_URL}" target="_blank" style="color:#ffffff; text-decoration:none;">וואטסאפ</a>
      <br>העמותה הישראלית לאנצפליטיס אוטואימוני (פאנס/פאנדס ישראל)
      <br>קיבלת את המייל הזה כי נרשמת לקהילה באתר וביקשת עדכונים. בכל עדכון שנשלח יהיה קישור להסרה מרשימת התפוצה.
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
};

const welcomeText = (firstName: string): string =>
    [
        `שלום ${firstName || 'לך'},`,
        '',
        'תודה שהצטרפת לקהילת פאנס/פאנדס ישראל. כאן נמצאות משפחות שמתמודדות עם פאנס/פאנדס, ואנשים שתומכים בהן.',
        '',
        'מה מחכה לך: מפגשים, וובינרים והרצאות; מידע עדכני בעברית; ועדכונים במייל כשנפתחת הרשמה למפגש, להרצאה או לכנס.',
        '',
        `לפעילויות הקרובות: ${SITE_URL}/activities`,
        `יש שאלה? וואטסאפ: ${WHATSAPP_URL}`,
        '',
        'באהבה,',
        'צוות פאנס/פאנדס ישראל',
    ].join('\n');

// ── Handler ──────────────────────────────────────────────────────────────────

export const onRequestPost = async ({ request, env }: JoinContext): Promise<Response> => {
    if (!env.RESEND_API_KEY || !env.RESEND_FROM || !env.RECAPTCHA_SECRET_KEY) {
        console.error('join: missing RESEND_API_KEY / RESEND_FROM / RECAPTCHA_SECRET_KEY');
        return json(503, { ok: false, error: 'not-configured' });
    }

    let body: JoinBody;
    try {
        body = (await request.json()) as JoinBody;
    } catch {
        return json(400, { ok: false, error: 'bad-json' });
    }

    const fullName = typeof body.fullName === 'string' ? body.fullName.trim().replace(/\s+/g, ' ') : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const token = typeof body.captchaToken === 'string' ? body.captchaToken : '';

    if (fullName.length < NAME_MIN || fullName.length > NAME_MAX) return json(400, { ok: false, error: 'bad-name' });
    if (!email || email.length > EMAIL_MAX || !EMAIL_PATTERN.test(email)) return json(400, { ok: false, error: 'bad-email' });
    if (body.emailUpdates !== true) return json(400, { ok: false, error: 'no-consent' });
    if (!token) return json(400, { ok: false, error: 'no-captcha' });

    try {
        if (!(await verifyCaptcha(env.RECAPTCHA_SECRET_KEY, token, request.headers.get('CF-Connecting-IP')))) {
            return json(403, { ok: false, error: 'captcha-failed' });
        }
    } catch (error) {
        console.error('join: captcha check failed', error);
        return json(502, { ok: false, error: 'captcha-unavailable' });
    }

    const { first, last } = splitName(fullName);

    // 1. Contact — best effort. If it already exists, Resend keeps it as it is.
    let contactAdded = false;
    try {
        const res = await resend(env, '/contacts', {
            email,
            first_name: first,
            last_name: last,
            unsubscribed: false,
            ...(env.RESEND_SEGMENT_ID ? { segments: [{ id: env.RESEND_SEGMENT_ID }] } : {}),
        });
        contactAdded = res.ok;
        if (!res.ok) console.warn('join: contact not added', res.status, await res.text());
    } catch (error) {
        console.error('join: contact request failed', error);
    }

    // 2. Welcome email. The idempotency key stops a double-click from sending it twice.
    try {
        const res = await resend(
            env,
            '/emails',
            {
                from: env.RESEND_FROM,
                to: [email],
                subject: 'ברוכים הבאים לקהילת פאנס/פאנדס ישראל',
                html: welcomeHtml(first),
                text: welcomeText(first),
                ...(env.RESEND_REPLY_TO ? { reply_to: env.RESEND_REPLY_TO } : {}),
                tags: [{ name: 'type', value: 'welcome' }],
            },
            `welcome-${email}`,
        );
        if (!res.ok) {
            console.error('join: welcome email failed', res.status, await res.text());
            return json(502, { ok: false, contactAdded, welcomeSent: false });
        }
    } catch (error) {
        console.error('join: welcome email request failed', error);
        return json(502, { ok: false, contactAdded, welcomeSent: false });
    }

    return json(200, { ok: true, contactAdded, welcomeSent: true });
};