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
  type DocumentData
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { PansFormData } from '../types/pandasScale';

// Firestore data structure
export interface ScaleResultDocument {
  userId: string | null;           // null for anonymous
  sessionId: string;                // browser fingerprint or UUID
  scaleType: 'PANDAS';              // scale type
  timestamp: Timestamp;             // when submitted
  formData: PansFormData;           // complete form data
  scores: {
    before: {
      ocd: number;
      np: number;
      functional: number;
      total: number;
    };
    after: {
      ocd: number;
      np: number;
      functional: number;
      total: number;
    };
    current: {
      ocd: number;
      np: number;
      functional: number;
      total: number;
    };
  };
}

/**
 * Compute all timeframe scores from form data
 */
function computeAllScores(formData: PansFormData) {
  const { ocdSymptoms, associatedSymptoms, functionalImpairment } = formData;

  // Helper: sum top 5 ratings
  const sumTop5 = (arr: number[]) =>
    [...arr].sort((a, b) => b - a).slice(0, 5).reduce((sum, v) => sum + v, 0);

  // OCD scores for each timeframe
  const ocdBefore = Math.max(...ocdSymptoms.map(s => s.ratingBefore)) * 5;
  const ocdAfter = Math.max(...ocdSymptoms.map(s => s.ratingAfter)) * 5;
  const ocdCurrent = Math.max(...ocdSymptoms.map(s => s.ratingCurrent)) * 5;

  // Associated scores for each timeframe
  const npBefore = sumTop5(associatedSymptoms.map(s => s.ratingBefore));
  const npAfter = sumTop5(associatedSymptoms.map(s => s.ratingAfter));
  const npCurrent = sumTop5(associatedSymptoms.map(s => s.ratingCurrent));

  // Functional scores for each timeframe
  const func = functionalImpairment[0];
  const funcBefore = func.ratingBefore * 10;
  const funcAfter = func.ratingAfter * 10;
  const funcCurrent = func.ratingCurrent * 10;

  return {
    before: {
      ocd: ocdBefore,
      np: npBefore,
      functional: funcBefore,
      total: ocdBefore + npBefore + funcBefore,
    },
    after: {
      ocd: ocdAfter,
      np: npAfter,
      functional: funcAfter,
      total: ocdAfter + npAfter + funcAfter,
    },
    current: {
      ocd: ocdCurrent,
      np: npCurrent,
      functional: funcCurrent,
      total: ocdCurrent + npCurrent + funcCurrent,
    },
  };
}

/**
 * Generate a session ID (simple UUID)
 */
function generateSessionId(): string {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Save PANDAS scale results to Firestore
 */
export async function saveScaleResult(
  formData: PansFormData,
  userId: string | null = null
): Promise<string> {
  try {
    // Get or create session ID
    let sessionId = localStorage.getItem('pandasSessionId');
    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem('pandasSessionId', sessionId);
    }

    // Compute all scores
    const scores = computeAllScores(formData);

    // Create document
    const resultDoc: Omit<ScaleResultDocument, 'timestamp'> & { timestamp: Timestamp } = {
      userId,
      sessionId,
      scaleType: 'PANDAS',
      timestamp: Timestamp.now(),
      formData,
      scores,
    };

    // Save to Firestore
    const docRef = await addDoc(collection(db, 'scaleResults'), resultDoc);
    
    console.log('✅ Scale result saved:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error saving scale result:', error);
    throw error;
  }
}

/**
 * Get recent scale results for charting
 */
export async function getRecentResults(limitCount: number = 100): Promise<ScaleResultDocument[]> {
  try {
    const q = query(
      collection(db, 'scaleResults'),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    const results: ScaleResultDocument[] = [];

    snapshot.forEach((doc) => {
      results.push(doc.data() as ScaleResultDocument);
    });

    return results;
  } catch (error) {
    console.error('❌ Error fetching results:', error);
    throw error;
  }
}

/**
 * Subscribe to real-time updates of scale results
 */
export function subscribeToResults(
  callback: (results: ScaleResultDocument[]) => void,
  limitCount: number = 100
): () => void {
  const q = query(
    collection(db, 'scaleResults'),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const results: ScaleResultDocument[] = [];
      snapshot.forEach((doc) => {
        results.push(doc.data() as ScaleResultDocument);
      });
      callback(results);
    },
    (error) => {
      console.error('❌ Error in real-time subscription:', error);
    }
  );

  return unsubscribe;
}

/**
 * Aggregate results for charting
 */
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
      count: 0,
      latest: null,
    };
  }

  const sums = {
    before: { ocd: 0, np: 0, functional: 0, total: 0 },
    after: { ocd: 0, np: 0, functional: 0, total: 0 },
    current: { ocd: 0, np: 0, functional: 0, total: 0 },
  };

  results.forEach((result) => {
    sums.before.ocd += result.scores.before.ocd;
    sums.before.np += result.scores.before.np;
    sums.before.functional += result.scores.before.functional;
    sums.before.total += result.scores.before.total;

    sums.after.ocd += result.scores.after.ocd;
    sums.after.np += result.scores.after.np;
    sums.after.functional += result.scores.after.functional;
    sums.after.total += result.scores.after.total;

    sums.current.ocd += result.scores.current.ocd;
    sums.current.np += result.scores.current.np;
    sums.current.functional += result.scores.current.functional;
    sums.current.total += result.scores.current.total;
  });

  const count = results.length;

  return {
    averages: {
      before: {
        ocd: Math.round(sums.before.ocd / count),
        np: Math.round(sums.before.np / count),
        functional: Math.round(sums.before.functional / count),
        total: Math.round(sums.before.total / count),
      },
      after: {
        ocd: Math.round(sums.after.ocd / count),
        np: Math.round(sums.after.np / count),
        functional: Math.round(sums.after.functional / count),
        total: Math.round(sums.after.total / count),
      },
      current: {
        ocd: Math.round(sums.current.ocd / count),
        np: Math.round(sums.current.np / count),
        functional: Math.round(sums.current.functional / count),
        total: Math.round(sums.current.total / count),
      },
    },
    count,
    latest: results[0],
  };
}