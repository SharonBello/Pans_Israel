// ==========================================================================
// mediaArticleService.ts — Firestore CRUD for כתבות בתקשורת
// ==========================================================================
import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    limit,
} from 'firebase/firestore';
import { db } from '../config/firebase'; // adjust to your firebase config path
import type { MediaArticle, MediaArticleFormData } from '../types/mediaArticle';

const COLLECTION = 'mediaArticles';
const colRef = () => collection(db, COLLECTION);

// ── Fetch all published articles ─────────────────────────────────────────────
export const getPublishedArticles = async (): Promise<MediaArticle[]> => {
    const snap = await getDocs(collection(db, 'mediaArticles'));
    return snap.docs
        .map(d => ({ id: d.id, ...d.data() } as MediaArticle))
        .filter(a => a.published)
        .sort((a, b) => (b.datePublished > a.datePublished ? 1 : -1));
};

// ── Fetch featured articles (for homepage widget) ────────────────────────────
export const getFeaturedArticles = async (count = 3): Promise<MediaArticle[]> => {
    const q = query(
        colRef(),
        where('published', '==', true),
        where('featured', '==', true),
        orderBy('datePublished', 'desc'),
        limit(count)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as MediaArticle));
};

// ── Fetch ALL articles (admin) ───────────────────────────────────────────────
export const getAllArticles = async (): Promise<MediaArticle[]> => {
    const q = query(colRef(), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as MediaArticle));
};

// ── Get single article ───────────────────────────────────────────────────────
export const getArticleById = async (id: string): Promise<MediaArticle | null> => {
    const snap = await getDoc(doc(db, COLLECTION, id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as MediaArticle;
};

// ── Create ───────────────────────────────────────────────────────────────────
export const createMediaArticle = async (data: MediaArticleFormData): Promise<string> => {
    const ref = await addDoc(colRef(), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return ref.id;
};

// ── Update ───────────────────────────────────────────────────────────────────
export const updateMediaArticle = async (
    id: string,
    data: Partial<MediaArticleFormData>
): Promise<void> => {
    await updateDoc(doc(db, COLLECTION, id), {
        ...data,
        updatedAt: serverTimestamp(),
    });
};

// ── Delete ───────────────────────────────────────────────────────────────────
export const deleteMediaArticle = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTION, id));
};

// ── Toggle published ─────────────────────────────────────────────────────────
export const togglePublished = async (id: string, current: boolean): Promise<void> => {
    await updateDoc(doc(db, COLLECTION, id), {
        published: !current,
        updatedAt: serverTimestamp(),
    });
};

// ── Toggle featured ──────────────────────────────────────────────────────────
export const toggleFeatured = async (id: string, current: boolean): Promise<void> => {
    await updateDoc(doc(db, COLLECTION, id), {
        featured: !current,
        updatedAt: serverTimestamp(),
    });
};