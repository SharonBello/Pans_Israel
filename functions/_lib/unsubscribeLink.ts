// ==========================================================================
// Signed unsubscribe links
// ==========================================================================
//
// Each link carries a code made from the email + the UNSUBSCRIBE_SECRET
// (Cloudflare secret). Without the secret nobody can make a valid link for
// someone else's address, so changing the email in the URL doesn't work.

export const SITE_URL = 'https://panspandasil.org';

const base64Url = (bytes: Uint8Array): string => {
    let binary = '';
    for (const b of bytes) binary += String.fromCharCode(b);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const normalize = (email: string): string => email.trim().toLowerCase();

export const unsubscribeToken = async (secret: string, email: string): Promise<string> => {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const mac = await crypto.subtle.sign('HMAC', key, enc.encode(`unsubscribe:${normalize(email)}`));
    return base64Url(new Uint8Array(mac));
};

/** Compares in constant time, so the code can't be guessed character by character */
export const isValidUnsubscribeToken = async (secret: string, email: string, token: string): Promise<boolean> => {
    const expected = await unsubscribeToken(secret, email);
    if (token.length !== expected.length) return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
    return diff === 0;
};

export const unsubscribeUrl = async (secret: string, email: string): Promise<string> =>
    `${SITE_URL}/api/unsubscribe?e=${encodeURIComponent(normalize(email))}&t=${await unsubscribeToken(secret, email)}`;