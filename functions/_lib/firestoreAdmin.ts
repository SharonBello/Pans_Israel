// ==========================================================================
// Firestore from Cloudflare functions — community members (server side)
// ==========================================================================
//
// Uses a Google service account (Cloudflare secrets FIREBASE_CLIENT_EMAIL and
// FIREBASE_PRIVATE_KEY) and the Firestore REST API. Security rules don't apply
// to the service account, so the public rules can stay closed.
//
// One document per person: the document ID is the SHA-256 of the email, so
// signing up again with the same address updates the same document.

export interface FirebaseEnv {
    FIREBASE_CLIENT_EMAIL?: string;
    FIREBASE_PRIVATE_KEY?: string;
    FIREBASE_PROJECT_ID?: string;
    VITE_FIREBASE_PROJECT_ID?: string; // already defined for the site build — used if FIREBASE_PROJECT_ID isn't set
}

const COLLECTION = 'community_members';

const projectId = (env: FirebaseEnv): string => (env.FIREBASE_PROJECT_ID || env.VITE_FIREBASE_PROJECT_ID || '').trim();

/** Names of the Firebase variables that are missing (names only, never values) */
export const missingFirebaseVars = (env: FirebaseEnv): string[] => [
    ...(!env.FIREBASE_CLIENT_EMAIL?.trim() ? ['FIREBASE_CLIENT_EMAIL'] : []),
    ...(!env.FIREBASE_PRIVATE_KEY?.trim() ? ['FIREBASE_PRIVATE_KEY'] : []),
    ...(!projectId(env) ? ['FIREBASE_PROJECT_ID'] : []),
];

// ── Encoding helpers ─────────────────────────────────────────────────────────

const base64Url = (bytes: Uint8Array): string => {
    let binary = '';
    for (const b of bytes) binary += String.fromCharCode(b);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const hex = (bytes: Uint8Array): string => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

/** The private key as pasted from the JSON file — with real line breaks or with "\n" */
const pemToDer = (pem: string): ArrayBuffer => {
    const body = pem
        .replace(/\\n/g, '\n')
        .replace(/-----(BEGIN|END) PRIVATE KEY-----/g, '')
        .replace(/[\s"]/g, '');
    return Uint8Array.from(atob(body), (c) => c.charCodeAt(0)).buffer as ArrayBuffer;
};

// ── Access token (cached while this worker instance is warm) ─────────────────

let cachedToken: { value: string; expiresAt: number } | null = null;

const getAccessToken = async (env: FirebaseEnv): Promise<string> => {
    const now = Math.floor(Date.now() / 1000);
    if (cachedToken && cachedToken.expiresAt - 60 > now) return cachedToken.value;

    const enc = new TextEncoder();
    const header = base64Url(enc.encode(JSON.stringify({ alg: 'RS256', typ: 'JWT' })));
    const claims = base64Url(
        enc.encode(
            JSON.stringify({
                iss: env.FIREBASE_CLIENT_EMAIL,
                sub: env.FIREBASE_CLIENT_EMAIL,
                aud: 'https://oauth2.googleapis.com/token',
                scope: 'https://www.googleapis.com/auth/datastore',
                iat: now,
                exp: now + 3600,
            }),
        ),
    );
    const key = await crypto.subtle.importKey(
        'pkcs8',
        pemToDer(env.FIREBASE_PRIVATE_KEY ?? ''),
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['sign'],
    );
    const signature = new Uint8Array(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, enc.encode(`${header}.${claims}`)));

    const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: `${header}.${claims}.${base64Url(signature)}`,
        }),
    });
    if (!res.ok) throw new Error(`Google token ${res.status}: ${await res.text()}`);
    const data = (await res.json()) as { access_token: string; expires_in: number };
    cachedToken = { value: data.access_token, expiresAt: now + (data.expires_in || 3600) };
    return data.access_token;
};

// ── Documents ────────────────────────────────────────────────────────────────

export const memberDocId = async (email: string): Promise<string> =>
    hex(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(email.trim().toLowerCase()))));

const docUrl = (env: FirebaseEnv, id: string): string =>
    `https://firestore.googleapis.com/v1/projects/${projectId(env)}/databases/(default)/documents/${COLLECTION}/${id}`;

const firestore = async (env: FirebaseEnv, url: string, init: RequestInit = {}): Promise<Response> =>
    fetch(url, {
        ...init,
        headers: { Authorization: `Bearer ${await getAccessToken(env)}`, 'Content-Type': 'application/json', ...init.headers },
    });

const maskQuery = (fields: string[], exists: boolean): string =>
    [`currentDocument.exists=${exists}`, ...fields.map((f) => `updateMask.fieldPaths=${f}`)].join('&');

export interface MemberInput {
    fullName: string;
    email: string;
    emailUpdates: boolean;
    noticeVersion: string;
}

/**
 * Creates the member, or updates the existing one with the same email.
 * The first join date (createdAt) is kept; updatedAt shows the latest sign-up.
 */
export const upsertMember = async (env: FirebaseEnv, member: MemberInput): Promise<'created' | 'updated'> => {
    const id = await memberDocId(member.email);
    const url = docUrl(env, id);
    const now = new Date().toISOString();

    const fields: Record<string, unknown> = {
        fullName: { stringValue: member.fullName },
        email: { stringValue: member.email },
        emailUpdates: { booleanValue: member.emailUpdates },
        privacyAccepted: { booleanValue: true },
        noticeVersion: { stringValue: member.noticeVersion },
        updatedAt: { timestampValue: now },
    };

    const existing = await firestore(env, url);
    if (existing.status === 404) {
        const res = await firestore(env, `${url}?currentDocument.exists=false`, {
            method: 'PATCH',
            body: JSON.stringify({ fields: { ...fields, createdAt: { timestampValue: now } } }),
        });
        if (res.ok) return 'created';
        if (res.status !== 409 && res.status !== 400) throw new Error(`Firestore create ${res.status}: ${await res.text()}`);
        // created by a parallel request a moment ago — fall through to update
    } else if (!existing.ok) {
        throw new Error(`Firestore read ${existing.status}: ${await existing.text()}`);
    }

    // Signing up again with updates clears an earlier unsubscribe (listed in the mask, left out of the fields)
    const mask = [...Object.keys(fields), ...(member.emailUpdates ? ['unsubscribedAt'] : [])];
    const res = await firestore(env, `${url}?${maskQuery(mask, true)}`, { method: 'PATCH', body: JSON.stringify({ fields }) });
    if (!res.ok) throw new Error(`Firestore update ${res.status}: ${await res.text()}`);
    return 'updated';
};