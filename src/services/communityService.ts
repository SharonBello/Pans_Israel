// ==========================================================================
// Community members — the /join list
// ==========================================================================
//
// Visitors can only ADD themselves (create-only rule). Reading and deleting
// the list is for admins only, so nobody can check whether an email is on it.

import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
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
// Join (public)
// --------------------------------------------------------------------------

export const joinCommunity = async (
    input: CommunityJoinInput,
): Promise<{ success: boolean; error?: string }> => {
    try {
        await addDoc(collection(db, COLLECTION_NAME), {
            fullName: normalizeName(input.fullName),
            email: normalizeEmail(input.email),
            emailUpdates: input.emailUpdates,
            privacyAccepted: true,
            noticeVersion: COMMUNITY_NOTICE_VERSION,
            createdAt: serverTimestamp(),
        });
        return { success: true };
    } catch (error) {
        console.error('Error joining community:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
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