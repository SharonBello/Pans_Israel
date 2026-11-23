// ==========================================================================
// Community members — the /join list
// ==========================================================================
//
// Joining goes through the site's Cloudflare function (/api/join): it checks the
// reCAPTCHA, saves ONE record per email (signing up again updates it), keeps
// Resend in step and sends the welcome email. Visitors can't write to Firestore
// directly. Reading and deleting the list is for admins only.

import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { COMMUNITY_NOTICE_VERSION } from '@/types/community';
import type { CommunityJoinInput, CommunityMember } from '@/types/community';

const COLLECTION_NAME = 'community_members';

/** Same limits the Firestore rule checks */
export const NAME_MIN = 2;
export const NAME_MAX = 80;
export const EMAIL_MAX = 254;
export const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export const normalizeName = (name: string): string => name.trim().replace(/\s+/g, ' ');
export const normalizeEmail = (email: string): string => email.trim().toLowerCase();

// --------------------------------------------------------------------------
// Join (public) — through the Cloudflare function
// --------------------------------------------------------------------------

/**
 * Note: `npm run dev` doesn't run Cloudflare functions, so joining only works on the
 * live site (or with `npx wrangler pages dev`).
 */
export const joinCommunity = async (
    input: CommunityJoinInput,
    captchaToken: string,
): Promise<{ success: boolean; welcomeSent: boolean; error?: string }> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
        const res = await fetch('/api/join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName: normalizeName(input.fullName),
                email: normalizeEmail(input.email),
                emailUpdates: input.emailUpdates,
                privacyAccepted: true,
                noticeVersion: COMMUNITY_NOTICE_VERSION,
                captchaToken,
            }),
            signal: controller.signal,
        });
        const data = (await res.json().catch(() => ({}))) as { ok?: boolean; welcomeSent?: boolean; error?: string };
        if (!res.ok || !data.ok) {
            console.error('Join failed:', res.status, data);
            return { success: false, welcomeSent: false, error: data.error ?? `status-${res.status}` };
        }
        return { success: true, welcomeSent: data.welcomeSent === true };
    } catch (error) {
        console.error('Join request failed:', error);
        return { success: false, welcomeSent: false, error: error instanceof Error ? error.message : 'network' };
    } finally {
        clearTimeout(timer);
    }
};

// --------------------------------------------------------------------------
// Admin
// --------------------------------------------------------------------------

export const getCommunityMembers = async (): Promise<CommunityMember[]> => {
    const snapshot = await getDocs(query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc')));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as CommunityMember);
};

export const deleteCommunityMember = async (
    id: string,
): Promise<{ success: boolean; error?: string }> => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
        return { success: true };
    } catch (error) {
        console.error('Error deleting community member:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};