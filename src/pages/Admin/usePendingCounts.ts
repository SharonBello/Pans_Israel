import { useCallback, useEffect, useState } from 'react';
import { collection, query, where, getCountFromServer } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { AdminTabId } from './adminSections';

export type PendingCounts = Partial<Record<AdminTabId, number>>;

const count = async (col: string, field: string, value: unknown): Promise<number> => {
    try {
        const snap = await getCountFromServer(query(collection(db, col), where(field, '==', value)));
        return snap.data().count;
    } catch {
        return 0;
    }
};

/** Live-ish pending counts for the admin nav; call `refresh()` after moderation actions. */
export const usePendingCounts = (refreshKey?: unknown) => {
    const [counts, setCounts] = useState<PendingCounts>({});

    const refresh = useCallback(async () => {
        const [testimonials, blog, volunteers] = await Promise.all([
            count('testimonials', 'status', 'pending'),
            count('blog_articles', 'published', false),
            count('support_volunteers', 'isApproved', false),
        ]);
        setCounts({ testimonials, blog, volunteers });
    }, []);

    useEffect(() => { refresh(); }, [refresh, refreshKey]);

    return { counts, refresh };
};