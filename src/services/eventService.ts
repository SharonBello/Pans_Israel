import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { EventItem, EventFormData } from '@/types/event';

const COLLECTION = 'events';
const colRef = () => collection(db, COLLECTION);

const toEvent = (id: string, data: Record<string, unknown>): EventItem =>
    ({ id, ...data } as EventItem);

const todayIso = (): string => new Date().toISOString().split('T')[0];

// ── Public: published events whose date hasn't passed, soonest first ─────────
export const getUpcomingEvents = async (): Promise<EventItem[]> => {
    const q = query(
        colRef(),
        where('published', '==', true),
        where('date', '>=', todayIso()),
        orderBy('date', 'asc'),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => toEvent(d.id, d.data()));
};

// ── Admin: everything, newest date first ─────────────────────────────────────
export const getAllEvents = async (): Promise<EventItem[]> => {
    const q = query(colRef(), orderBy('date', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => toEvent(d.id, d.data()));
};

// ── Create / update / delete ─────────────────────────────────────────────────
export const createEvent = async (data: EventFormData): Promise<string> => {
    const ref = await addDoc(colRef(), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return ref.id;
};

export const updateEvent = async (id: string, data: Partial<EventFormData>): Promise<void> => {
    await updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: serverTimestamp() });
};

export const deleteEvent = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTION, id));
};

export const togglePublished = async (id: string, current: boolean): Promise<void> => {
    await updateDoc(doc(db, COLLECTION, id), { published: !current, updatedAt: serverTimestamp() });
};