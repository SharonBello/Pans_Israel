import type { Unsubscribe } from 'firebase/firestore';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
    type DocumentData,
    type QuerySnapshot,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { NewTestimonialPayload, Testimonial } from '@/types/testimonials';

const COLLECTION = 'testimonials';

const toTestimonial = (docData: DocumentData, id: string): Testimonial => {
    const data: Record<string, unknown> = docData as Record<string, unknown>;

    return {
        id,
        title: String(data.title ?? ''),
        highlight: String(data.highlight ?? ''),
        excerpt: typeof data.excerpt === 'string' ? data.excerpt : undefined,
        content: String(data.content ?? ''),
        tags: Array.isArray(data.tags) ? (data.tags as string[]).filter((t: string) => Boolean(t)) : [],
        isAnonymous: Boolean(data.isAnonymous),
        displayName: typeof data.displayName === 'string' ? data.displayName : undefined,
        authorName: typeof data.authorName === 'string' ? data.authorName : undefined,
        authorEmail: typeof data.authorEmail === 'string' ? data.authorEmail : undefined,
        status: (data.status as Testimonial['status']) ?? 'pending',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
    };
};

// ── Public: approved only (realtime) ─────────────────────────────────────────
export const subscribeToTestimonials = (
    onData: (items: Testimonial[]) => void,
    onError: (error: Error) => void
): Unsubscribe => {
    const q = query(collection(db, COLLECTION), where('status', '==', 'approved'));

    return onSnapshot(
        q,
        (snapshot: QuerySnapshot<DocumentData>) => {
            const items: Testimonial[] = snapshot.docs
                .map((d) => toTestimonial(d.data(), d.id))
                .filter((t) => t.content.trim().length > 0);
            onData(items);
        },
        (err: Error) => onError(err)
    );
};

// ── Public: submit (always lands as pending) ─────────────────────────────────
export const addTestimonial = async (payload: NewTestimonialPayload): Promise<void> => {
    const cleanTags: string[] = (payload.tags ?? [])
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 0)
        .slice(0, 8);

    await addDoc(collection(db, COLLECTION), {
        title: payload.title,
        highlight: payload.highlight,
        excerpt: payload.excerpt ?? '',
        content: payload.content,
        tags: cleanTags,
        isAnonymous: payload.isAnonymous,
        displayName: payload.displayName ?? null,
        authorName: payload.authorName ?? null,
        authorEmail: payload.authorEmail ?? null,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
};

// ── Admin ────────────────────────────────────────────────────────────────────
export const getAllTestimonials = async (): Promise<Testimonial[]> => {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => toTestimonial(d.data(), d.id));
};

export const setTestimonialStatus = async (id: string, status: Testimonial['status']): Promise<void> => {
    await updateDoc(doc(db, COLLECTION, id), { status, updatedAt: serverTimestamp() });
};

export const deleteTestimonial = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTION, id));
};