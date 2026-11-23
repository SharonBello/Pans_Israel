// ==========================================================================
// Cloudflare Pages Function — /api/unsubscribe?e=<email>&t=<code>
// ==========================================================================
//
// The link at the bottom of our emails (and the "Unsubscribe" button Gmail /
// Outlook show next to the sender) lead here.
//   GET  → a page asking to confirm. Opening the link alone changes nothing,
//          because some mail systems open links automatically to scan them.
//   POST → unsubscribes: marks the contact in Resend AND the member in the
//          site's list (Firestore), so both stay the same.
//
// Uses the secrets UNSUBSCRIBE_SECRET, RESEND_API_KEY and the Firebase ones.

import { isValidUnsubscribeToken, SITE_URL } from '../_lib/unsubscribeLink';
import { markMemberUnsubscribed, missingFirebaseVars, type FirebaseEnv } from '../_lib/firestoreAdmin';

interface Env extends FirebaseEnv {
    UNSUBSCRIBE_SECRET?: string;
    RESEND_API_KEY?: string;
}

interface UnsubscribeContext {
    request: Request;
    env: Env;
}

const WHATSAPP_URL = 'https://wa.me/972544222683';

const escapeHtml = (value: string): string =>
    value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

// ── Page ─────────────────────────────────────────────────────────────────────

const page = (status: number, title: string, bodyHtml: string): Response =>
    new Response(
        `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${title} | פאנס/פאנדס ישראל</title>
<link rel="icon" href="/favicon.ico">
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;700;800&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px 16px;
         background: #f4f6f9; font-family: Heebo, Arial, sans-serif; color: #0e0d26; }
  .card { width: 100%; max-width: 520px; background: #fff; border-radius: 16px; overflow: hidden;
          box-shadow: 0 10px 30px rgba(14, 13, 38, 0.08); }
  .brand { display: flex; align-items: center; gap: 10px; padding: 20px 28px; text-decoration: none; }
  .brand img { width: 40px; height: 40px; }
  .brand b { display: block; font-size: 18px; font-weight: 800; color: #023373; line-height: 1.1; }
  .brand span { display: block; font-size: 12px; color: #4a90d9; }
  .band { padding: 24px 28px; background: linear-gradient(135deg, #4a148c 0%, #6a1b9a 55%, #7b1fa2 100%); }
  .band h1 { margin: 0; font-size: 24px; line-height: 1.3; font-weight: 800; color: #fff; }
  .body { padding: 24px 28px 28px; font-size: 16px; line-height: 1.7; }
  .body p { margin: 0 0 16px; }
  bdi { font-weight: 700; }
  .actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 8px; }
  .btn { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; padding: 0 24px;
         border-radius: 999px; font: 700 16px Heebo, Arial, sans-serif; text-decoration: none; cursor: pointer;
         border: 1.5px solid #6a1b9a; }
  .btn-primary { background: #6a1b9a; color: #fff; }
  .btn-primary:hover { background: #4a148c; }
  .btn-secondary { background: #fff; color: #6a1b9a; }
  .btn:focus-visible { outline: 3px solid #6a1b9a; outline-offset: 3px; }
  a { color: #6a1b9a; font-weight: 700; }
  form { margin: 0; }
  @media (max-width: 420px) { .actions > * { flex: 1 1 100%; } .btn { width: 100%; } }
</style>
</head>
<body>
<main class="card">
  <a class="brand" href="${SITE_URL}">
    <img src="${SITE_URL}/android-chrome-192x192.png" alt="">
    <span><b>פאנס/פאנדס</b><span>ישראל</span></span>
  </a>
  <div class="band"><h1>${title}</h1></div>
  <div class="body">${bodyHtml}</div>
</main>
</body>
</html>`,
        {
            status,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'no-store',
                'Referrer-Policy': 'no-referrer',
                'X-Robots-Tag': 'noindex',
            },
        },
    );

const invalidLinkPage = (): Response =>
    page(
        400,
        'הקישור לא תקין',
        `<p>ייתכן שהקישור הועתק רק בחלקו. נסו ללחוץ שוב על הקישור שבמייל.</p>
<p>אפשר גם <a href="${WHATSAPP_URL}" target="_blank" rel="noopener">לכתוב לנו בוואטסאפ</a>, ונסיר אתכם ידנית.</p>`,
    );

const errorPage = (): Response =>
    page(
        502,
        'משהו השתבש',
        `<p>לא הצלחנו להסיר את הכתובת כרגע. נסו שוב בעוד כמה דקות.</p>
<p>אם זה ממשיך, <a href="${WHATSAPP_URL}" target="_blank" rel="noopener">כתבו לנו בוואטסאפ</a> ונסיר אתכם ידנית.</p>`,
    );

// ── Shared checks ────────────────────────────────────────────────────────────

const readLink = async (request: Request, env: Env): Promise<string | null> => {
    const url = new URL(request.url);
    const email = (url.searchParams.get('e') ?? '').trim().toLowerCase();
    const token = url.searchParams.get('t') ?? '';
    if (!email || !token || !env.UNSUBSCRIBE_SECRET) return null;
    return (await isValidUnsubscribeToken(env.UNSUBSCRIBE_SECRET, email, token)) ? email : null;
};

// ── GET: confirm ─────────────────────────────────────────────────────────────

export const onRequestGet = async ({ request, env }: UnsubscribeContext): Promise<Response> => {
    const email = await readLink(request, env);
    if (!email) return invalidLinkPage();

    // The form posts back to the same address (same e and t)
    const action = escapeHtml(new URL(request.url).pathname + new URL(request.url).search);
    return page(
        200,
        'הסרה מרשימת התפוצה',
        `<p>להסיר את <bdi dir="ltr">${escapeHtml(email)}</bdi> מרשימת התפוצה של פאנס/פאנדס ישראל?</p>
<p>לא נשלח לכתובת הזאת עוד עדכונים במייל.</p>
<div class="actions">
  <form method="post" action="${action}"><button class="btn btn-primary" type="submit">כן, להסיר אותי</button></form>
  <a class="btn btn-secondary" href="${SITE_URL}">לא, חזרה לאתר</a>
</div>`,
    );
};

// ── POST: unsubscribe (the confirm button, or the mail app's one-click button) ─

export const onRequestPost = async ({ request, env }: UnsubscribeContext): Promise<Response> => {
    const email = await readLink(request, env);
    if (!email) return invalidLinkPage();
    if (!env.RESEND_API_KEY) {
        console.error('unsubscribe: RESEND_API_KEY missing');
        return errorPage();
    }

    // 1. Resend — this is what stops the emails, so it must succeed
    try {
        const headers = { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' };
        let res = await fetch(`https://api.resend.com/contacts/${encodeURIComponent(email)}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ unsubscribed: true }),
        });
        if (res.status === 404) {
            // Not a contact yet — add them as unsubscribed, so a later import can't subscribe them
            res = await fetch('https://api.resend.com/contacts', {
                method: 'POST',
                headers,
                body: JSON.stringify({ email, unsubscribed: true }),
            });
        }
        if (!res.ok) {
            console.error('unsubscribe: Resend failed', res.status, await res.text());
            return errorPage();
        }
    } catch (error) {
        console.error('unsubscribe: Resend request failed', error);
        return errorPage();
    }

    // 2. The site's list — best effort (the emails have already stopped)
    const missing = missingFirebaseVars(env);
    if (missing.length > 0) {
        console.error(`unsubscribe: Firestore not updated, missing ${missing.join(', ')}`);
    } else {
        try {
            const found = await markMemberUnsubscribed(env, email);
            if (!found) console.warn('unsubscribe: no member record for this email');
        } catch (error) {
            console.error('unsubscribe: Firestore update failed', error);
        }
    }

    return page(
        200,
        'הכתובת הוסרה מרשימת התפוצה',
        `<p>לא נשלח עוד עדכונים לכתובת <bdi dir="ltr">${escapeHtml(email)}</bdi>.</p>
<p>אם תרצו לחזור, אפשר להצטרף שוב בכל זמן.</p>
<div class="actions">
  <a class="btn btn-primary" href="${SITE_URL}">לאתר</a>
  <a class="btn btn-secondary" href="${SITE_URL}/join">הצטרפות מחדש</a>
</div>`,
    );
};