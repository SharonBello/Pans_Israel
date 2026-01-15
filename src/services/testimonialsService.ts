import type { Unsubscribe } from 'firebase/firestore';
import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    where,
    type DocumentData,
    type QuerySnapshot,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { NewTestimonialPayload, Testimonial } from '@/types/testimonials';

const toTestimonial = (doc: DocumentData, id: string): Testimonial => {
    const data: Record<string, unknown> = doc as Record<string, unknown>;

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

export const subscribeToTestimonials = (
    onData: (items: Testimonial[]) => void,
    onError: (error: Error) => void
): Unsubscribe => {
    const colRef = collection(db, 'testimonials');

    // Approved only, newest first
    const q = query(colRef, where('status', '==', 'approved'));

    const unsubscribe: Unsubscribe = onSnapshot(
        q,
        (snapshot: QuerySnapshot<DocumentData>) => {
            const items: Testimonial[] = snapshot.docs
                .map((d) => toTestimonial(d.data(), d.id))
                .filter((t) => t.content.trim().length > 0);

            onData(items);
        },
        (err: Error) => onError(err)
    );

    return unsubscribe;
};

export const addTestimonial = async (payload: NewTestimonialPayload): Promise<void> => {
    const colRef = collection(db, 'testimonials');

    const cleanTags: string[] = (payload.tags ?? [])
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 0)
        .slice(0, 8);

    await addDoc(colRef, {
        title: payload.title,
        highlight: payload.highlight,
        excerpt: payload.excerpt ?? '',
        content: payload.content,
        tags: cleanTags,
        isAnonymous: payload.isAnonymous,
        displayName: payload.displayName ?? null,
        authorName: payload.authorName ?? null,
        authorEmail: payload.authorEmail ?? null,
        status: payload.status ?? 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
};
