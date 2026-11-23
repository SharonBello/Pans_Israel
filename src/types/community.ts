import type { Timestamp } from 'firebase/firestore';

/**
 * Version of the notice people agree to on /join.
 * Change it whenever the notice text changes, so every record shows which text that person saw.
 */
export const COMMUNITY_NOTICE_VERSION = '2026-11';

/** What the /join form sends */
export interface CommunityJoinInput {
    fullName: string;
    email: string;
    emailUpdates: boolean;   // opted in to email updates (optional checkbox)
}

/** A stored member (admins only can read these) */
export interface CommunityMember extends CommunityJoinInput {
    id: string;
    privacyAccepted: true;
    noticeVersion: string;
    createdAt: Timestamp | null;
    updatedAt?: Timestamp | null;       // last sign-up with this email
    unsubscribedAt?: Timestamp | null;  // set when they used the unsubscribe link
}