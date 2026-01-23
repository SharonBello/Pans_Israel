import {
    collection,
    addDoc,
    query,
    orderBy,
    limit,
    getDocs,
    Timestamp,
    onSnapshot,
    QuerySnapshot,
    type DocumentData,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { PansFormData, NPDomainKey } from '../types/pandasScale';

// Firestore data structure
export interface ScaleResultDocument {
    userId: string | null;
    sessionId: string;
    scaleType: 'PANDAS';
    timestamp: Timestamp;
    formData: PansFormData;
    scores: {
        before: { ocd: number; np: number; functional: number; total: number };
        after: { ocd: number; np: number; functional: number; total: number };
        current: { ocd: number; np: number; functional: number; total: number };
    };
}

// All NP domains
const ALL_DOMAINS: NPDomainKey[] = [
    'anxiety', 'moodiness', 'irritability', 'cognitive', 'regression',
    'sensory', 'hallucinations', 'motor', 'urinary', 'sleep', 'pupil',
];

/** Helper: sum top 5 values */
const sumTop5 = (arr: number[]): number =>
    [...arr].sort((a, b) => b - a).slice(0, 5).reduce((sum, v) => sum + v, 0);

/**
 * Compute NP score correctly by grouping by domain first
 * FIXED: Takes max rating per domain, then sums top 5 domains
 */
function computeNPScore(
    associatedSymptoms: PansFormData['associatedSymptoms'],
    timeframe: 'ratingBefore' | 'ratingAfter' | 'ratingCurrent'
): number {
    const domainRatings: Record<string, number> = {};

    ALL_DOMAINS.forEach((domainKey) => {
        const symptomsInDomain = associatedSymptoms.filter((s) => s.domain === domainKey);
        domainRatings[domainKey] = symptomsInDomain.length > 0
            ? Math.max(...symptomsInDomain.map((s) => s[timeframe]))
            : 0;
    });

    return sumTop5(Object.values(domainRatings));
}

/** Compute all timeframe scores from form data */
function computeAllScores(formData: PansFormData) {
    const { ocdSymptoms, associatedSymptoms, functionalImpairment } = formData;

    // OCD: max × 5
    const ocdBefore = Math.max(...ocdSymptoms.map((s) => s.ratingBefore)) * 5;
    const ocdAfter = Math.max(...ocdSymptoms.map((s) => s.ratingAfter)) * 5;
    const ocdCurrent = Math.max(...ocdSymptoms.map((s) => s.ratingCurrent)) * 5;

    // NP: group by domain, max per domain, sum top 5
    const npBefore = computeNPScore(associatedSymptoms, 'ratingBefore');
    const npAfter = computeNPScore(associatedSymptoms, 'ratingAfter');
    const npCurrent = computeNPScore(associatedSymptoms, 'ratingCurrent');

    // Functional: × 10
    const func = functionalImpairment[0];
    const funcBefore = func.ratingBefore * 10;
    const funcAfter = func.ratingAfter * 10;
    const funcCurrent = func.ratingCurrent * 10;

    return {
        before: { ocd: ocdBefore, np: npBefore, functional: funcBefore, total: ocdBefore + npBefore + funcBefore },
        after: { ocd: ocdAfter, np: npAfter, functional: funcAfter, total: ocdAfter + npAfter + funcAfter },
        current: { ocd: ocdCurrent, np: npCurrent, functional: funcCurrent, total: ocdCurrent + npCurrent + funcCurrent },
    };
}

function generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/** Save PANDAS scale results to Firestore */
export async function saveScaleResult(
    formData: PansFormData,
    userId: string | null = null
): Promise<string> {
    try {
        let sessionId = localStorage.getItem('pandasSessionId');
        if (!sessionId) {
            sessionId = generateSessionId();
            localStorage.setItem('pandasSessionId', sessionId);
        }

        const scores = computeAllScores(formData);
        const resultDoc = {
            userId, sessionId, scaleType: 'PANDAS' as const,
            timestamp: Timestamp.now(), formData, scores,
        };

        const docRef = await addDoc(collection(db, 'scaleResults'), resultDoc);
        return docRef.id;
    } catch (error) {
        console.error('❌ Error saving scale result:', error);
        throw error;
    }
}

/** Get recent scale results for charting */
export async function getRecentResults(limitCount: number = 100): Promise<ScaleResultDocument[]> {
    try {
        const q = query(collection(db, 'scaleResults'), orderBy('timestamp', 'desc'), limit(limitCount));
        const snapshot = await getDocs(q);
        const results: ScaleResultDocument[] = [];
        snapshot.forEach((doc) => results.push(doc.data() as ScaleResultDocument));
        return results;
    } catch (error) {
        console.error('❌ Error fetching results:', error);
        throw error;
    }
}

/** Subscribe to real-time updates of scale results */
export function subscribeToResults(
    callback: (results: ScaleResultDocument[]) => void,
    limitCount: number = 100
): () => void {
    const q = query(collection(db, 'scaleResults'), orderBy('timestamp', 'desc'), limit(limitCount));

    const unsubscribe = onSnapshot(q,
        (snapshot: QuerySnapshot<DocumentData>) => {
            const results: ScaleResultDocument[] = [];
            snapshot.forEach((doc) => results.push(doc.data() as ScaleResultDocument));
            callback(results);
        },
        (error) => console.error('❌ Error in real-time subscription:', error)
    );

    return unsubscribe;
}

/** Aggregate results for charting */
export interface AggregatedScores {
    averages: {
        before: { ocd: number; np: number; functional: number; total: number };
        after: { ocd: number; np: number; functional: number; total: number };
        current: { ocd: number; np: number; functional: number; total: number };
    };
    count: number;
    latest: ScaleResultDocument | null;
}

export function aggregateResults(results: ScaleResultDocument[]): AggregatedScores {
    if (results.length === 0) {
        return {
            averages: {
                before: { ocd: 0, np: 0, functional: 0, total: 0 },
                after: { ocd: 0, np: 0, functional: 0, total: 0 },
                current: { ocd: 0, np: 0, functional: 0, total: 0 },
            },
            count: 0, latest: null,
        };
    }

    const sums = {
        before: { ocd: 0, np: 0, functional: 0, total: 0 },
        after: { ocd: 0, np: 0, functional: 0, total: 0 },
        current: { ocd: 0, np: 0, functional: 0, total: 0 },
    };

    results.forEach((result) => {
        if (result.scores) {
            sums.before.ocd += result.scores.before?.ocd || 0;
            sums.before.np += result.scores.before?.np || 0;
            sums.before.functional += result.scores.before?.functional || 0;
            sums.before.total += result.scores.before?.total || 0;
            sums.after.ocd += result.scores.after?.ocd || 0;
            sums.after.np += result.scores.after?.np || 0;
            sums.after.functional += result.scores.after?.functional || 0;
            sums.after.total += result.scores.after?.total || 0;
            sums.current.ocd += result.scores.current?.ocd || 0;
            sums.current.np += result.scores.current?.np || 0;
            sums.current.functional += result.scores.current?.functional || 0;
            sums.current.total += result.scores.current?.total || 0;
        }
    });

    const count = results.length;
    return {
        averages: {
            before: {
                ocd: Math.round((sums.before.ocd / count) * 10) / 10,
                np: Math.round((sums.before.np / count) * 10) / 10,
                functional: Math.round((sums.before.functional / count) * 10) / 10,
                total: Math.round((sums.before.total / count) * 10) / 10,
            },
            after: {
                ocd: Math.round((sums.after.ocd / count) * 10) / 10,
                np: Math.round((sums.after.np / count) * 10) / 10,
                functional: Math.round((sums.after.functional / count) * 10) / 10,
                total: Math.round((sums.after.total / count) * 10) / 10,
            },
            current: {
                ocd: Math.round((sums.current.ocd / count) * 10) / 10,
                np: Math.round((sums.current.np / count) * 10) / 10,
                functional: Math.round((sums.current.functional / count) * 10) / 10,
                total: Math.round((sums.current.total / count) * 10) / 10,
            },
        },
        count, latest: results[0],
    };
}
