import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    where,
    Timestamp,
    onSnapshot,
    type Unsubscribe
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Professional, ProfessionalCategory } from '../types/professionals';

// Collection name in Firestore
const COLLECTION_NAME = 'professionals';

// Reference to the professionals collection
const professionalsCollection = collection(db, COLLECTION_NAME);

const removeUndefinedFields = <T extends Record<string, unknown>>(obj: T): Partial<T> => {
    const entries: [string, unknown][] = Object.entries(obj);
    const filtered: [string, unknown][] = entries.filter(([, value]: [string, unknown]) => value !== undefined);
    return Object.fromEntries(filtered) as Partial<T>;
};

// ============ CREATE ============
export const addProfessional = async (professional: Omit<Professional, 'id'>): Promise<Professional> => {
    try {
        const docData: Record<string, unknown> = removeUndefinedFields({
            ...professional,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            isApproved: false,
        });

        const docRef = await addDoc(professionalsCollection, docData);

        return {
            ...professional,
            id: docRef.id,
        };
    } catch (error) {
        throw error;
    }
};

// ============ READ ============
export const getAllProfessionals = async (): Promise<Professional[]> => {
    try {
        const q = query(professionalsCollection);
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Professional[];
    } catch (error) {
        throw error;
    }
};

// Get professionals by category
export const getProfessionalsByCategory = async (category: ProfessionalCategory): Promise<Professional[]> => {
    try {
        const q = query(
            professionalsCollection,
            where('category', '==', category),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Professional[];
    } catch (error) {
        throw error;
    }
};

// ============ REAL-TIME LISTENER ============
export const subscribeToProfessionals = (
    callback: (professionals: Professional[]) => void,
    onError?: (error: Error) => void
): Unsubscribe => {
    const q = query(professionalsCollection);

    return onSnapshot(
        q,
        (querySnapshot) => {
            const professionals = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Professional[];
            callback(professionals);
        },
        (error) => {
            if (onError) onError(error);
        }
    );
};

// ============ UPDATE ============
export const updateProfessional = async (
    id: string,
    updates: Partial<Professional>
): Promise<void> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: Timestamp.now(),
        });
    } catch (error) {
        throw error;
    }
};

// ============ DELETE ============
export const deleteProfessional = async (id: string): Promise<void> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    } catch (error) {
        throw error;
    }
};

// ============ SEED DATA (One-time use to populate initial data) ============
export const seedInitialData = async (professionals: Omit<Professional, 'id'>[]): Promise<void> => {
    try {
        // Check if collection is empty
        const snapshot = await getDocs(professionalsCollection);
        if (!snapshot.empty) {
            return;
        }

        // Add all professionals
        for (const professional of professionals) {
            await addDoc(professionalsCollection, {
                ...professional,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
                isApproved: true, // Seed data is pre-approved
            });
        }

    } catch (error) {
        console.error('Error seeding data:', error);
        throw error;
    }
};