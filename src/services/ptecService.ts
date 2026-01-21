import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  where,
  Timestamp,
  onSnapshot,
  QuerySnapshot,
  getDocs,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { CATEGORY_LABELS, MAX_SCORES, type PTECFormData, type PTECScores, type PTECSymptomData } from '@/types/ptecScale';

// ============================================================================
// Firestore Document Structure
// ============================================================================

export interface PTECResultDocument {
  sessionId: string;
  scaleType: 'PTEC';
  timestamp: Timestamp;
  formData: PTECFormData;
  scores: PTECScores;
}

// ============================================================================
// Scoring Functions
// ============================================================================

/**
 * Sum all symptom ratings in an object
 */
function sumRatings(symptoms: Record<string, SymptomRating>): number {
  return Object.values(symptoms).reduce((sum, rating) => sum + rating, 0);
}

/**
 * Calculate scores for all PTEC categories
 */
export function calculatePTECScores(symptoms: PTECSymptomData): PTECScores {
  const scores: PTECScores = {
    behaviorMood: sumRatings(symptoms.behaviorMood),
    ocd: sumRatings(symptoms.ocd),
    anxiety: sumRatings(symptoms.anxiety),
    foodIntake: sumRatings(symptoms.foodIntake),
    tics: sumRatings(symptoms.tics),
    cognitive: sumRatings(symptoms.cognitive),
    sensory: sumRatings(symptoms.sensory),
    other: sumRatings(symptoms.other),
    sleep: sumRatings(symptoms.sleep),
    health: sumRatings(symptoms.health),
    total: 0,
  };

  // Calculate total
  scores.total =
    scores.behaviorMood +
    scores.ocd +
    scores.anxiety +
    scores.foodIntake +
    scores.tics +
    scores.cognitive +
    scores.sensory +
    scores.other +
    scores.sleep +
    scores.health;

  return scores;
}

/**
 * Get severity level based on total score
 */
export function getSeverityLevel(totalScore: number): {
  level: 'minimal' | 'mild' | 'moderate' | 'severe' | 'extreme';
  label: string;
  color: string;
} {
  if (totalScore <= 30) {
    return { level: 'minimal', label: 'מינימלי', color: '#4CAF50' };
  } else if (totalScore <= 75) {
    return { level: 'mild', label: 'קל', color: '#8BC34A' };
  } else if (totalScore <= 150) {
    return { level: 'moderate', label: 'בינוני', color: '#FFC107' };
  } else if (totalScore <= 225) {
    return { level: 'severe', label: 'חמור', color: '#FF9800' };
  } else {
    return { level: 'extreme', label: 'קיצוני', color: '#F44336' };
  }
}

/**
 * Compare two PTEC evaluations
 */
export function comparePTECScores(
  before: PTECScores,
  after: PTECScores
): {
  category: string;
  before: number;
  after: number;
  change: number;
  percentChange: number;
}[] {
  const categories = Object.keys(CATEGORY_LABELS) as (keyof typeof CATEGORY_LABELS)[];

  return categories.map((cat) => {
    const beforeScore = before[cat];
    const afterScore = after[cat];
    const change = afterScore - beforeScore;
    const maxScore = MAX_SCORES[cat];
    const percentChange = maxScore > 0 ? Math.round((change / maxScore) * 100) : 0;

    return {
      category: CATEGORY_LABELS[cat],
      before: beforeScore,
      after: afterScore,
      change,
      percentChange,
    };
  });
}

// ============================================================================
// Firebase Operations
// ============================================================================

/**
 * Generate a session ID for PTEC
 */
function generateSessionId(): string {
  return 'ptec_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Save PTEC results to Firestore
 */
export async function savePTECResult(formData: PTECFormData): Promise<string> {
  try {
    // Get or create session ID
    let sessionId = localStorage.getItem('ptecSessionId');
    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem('ptecSessionId', sessionId);
    }

    // Calculate scores
    const scores = calculatePTECScores(formData.symptoms);

    // Create document
    const resultDoc: Omit<PTECResultDocument, 'timestamp'> & { timestamp: Timestamp } = {
      sessionId,
      scaleType: 'PTEC',
      timestamp: Timestamp.now(),
      formData,
      scores,
    };

    // Save to Firestore
    const docRef = await addDoc(collection(db, 'ptecResults'), resultDoc);

    console.log('✅ PTEC result saved:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error saving PTEC result:', error);
    throw error;
  }
}

/**
 * Subscribe to real-time updates of PTEC results
 */
export function subscribeToPTECResults(
  callback: (results: PTECResultDocument[]) => void,
  limitCount: number = 100
): () => void {
  const q = query(
    collection(db, 'ptecResults'),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const results: PTECResultDocument[] = [];
      snapshot.forEach((doc) => {
        results.push(doc.data() as PTECResultDocument);
      });
      callback(results);
    },
    (error) => {
      console.error('❌ Error in PTEC subscription:', error);
    }
  );

  return unsubscribe;
}

/**
 * Get user's previous PTEC results for comparison
 */
export async function getUserPTECHistory(sessionId: string): Promise<PTECResultDocument[]> {
  try {
    const q = query(
      collection(db, 'ptecResults'),
      where('sessionId', '==', sessionId),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const snapshot = await getDocs(q);
    const results: PTECResultDocument[] = [];
    snapshot.forEach((doc) => {
      results.push(doc.data() as PTECResultDocument);
    });

    return results;
  } catch (error) {
    console.error('❌ Error fetching PTEC history:', error);
    return [];
  }
}

// ============================================================================
// Aggregation for Charts
// ============================================================================

export interface PTECAggregatedData {
  count: number;
  averageScores: PTECScores;
  scoreDistribution: {
    minimal: number;
    mild: number;
    moderate: number;
    severe: number;
    extreme: number;
  };
  flareStatusDistribution: {
    ongoing_flare: number;
    new_flare: number;
    no_flare: number;
  };
  diagnosisDistribution: {
    pans: number;
    pandas: number;
    other: number;
    undiagnosed: number;
  };
  mostCommonSymptoms: { category: string; avgScore: number; percentOfMax: number }[];
}

export function aggregatePTECResults(results: PTECResultDocument[]): PTECAggregatedData {
  if (results.length === 0) {
    return {
      count: 0,
      averageScores: { ...MAX_SCORES, total: 0 },
      scoreDistribution: { minimal: 0, mild: 0, moderate: 0, severe: 0, extreme: 0 },
      flareStatusDistribution: { ongoing_flare: 0, new_flare: 0, no_flare: 0 },
      diagnosisDistribution: { pans: 0, pandas: 0, other: 0, undiagnosed: 0 },
      mostCommonSymptoms: [],
    };
  }

  const count = results.length;

  // Sum scores for averaging
  const scoreSums: PTECScores = {
    behaviorMood: 0,
    ocd: 0,
    anxiety: 0,
    foodIntake: 0,
    tics: 0,
    cognitive: 0,
    sensory: 0,
    other: 0,
    sleep: 0,
    health: 0,
    total: 0,
  };

  const scoreDistribution = { minimal: 0, mild: 0, moderate: 0, severe: 0, extreme: 0 };
  const flareStatusDistribution = { ongoing_flare: 0, new_flare: 0, no_flare: 0 };
  const diagnosisDistribution = { pans: 0, pandas: 0, other: 0, undiagnosed: 0 };

  results.forEach((r) => {
    // Sum scores
    Object.keys(scoreSums).forEach((key) => {
      scoreSums[key as keyof PTECScores] += r.scores[key as keyof PTECScores];
    });

    // Score distribution
    const severity = getSeverityLevel(r.scores.total);
    scoreDistribution[severity.level]++;

    // Flare status
    flareStatusDistribution[r.formData.patientInfo.flareStatus]++;

    // Diagnosis
    diagnosisDistribution[r.formData.patientInfo.diagnosis]++;
  });

  // Calculate averages
  const averageScores: PTECScores = {
    behaviorMood: Math.round(scoreSums.behaviorMood / count),
    ocd: Math.round(scoreSums.ocd / count),
    anxiety: Math.round(scoreSums.anxiety / count),
    foodIntake: Math.round(scoreSums.foodIntake / count),
    tics: Math.round(scoreSums.tics / count),
    cognitive: Math.round(scoreSums.cognitive / count),
    sensory: Math.round(scoreSums.sensory / count),
    other: Math.round(scoreSums.other / count),
    sleep: Math.round(scoreSums.sleep / count),
    health: Math.round(scoreSums.health / count),
    total: Math.round(scoreSums.total / count),
  };

  // Most common symptoms (sorted by percentage of max)
  const categories = Object.keys(CATEGORY_LABELS) as (keyof typeof CATEGORY_LABELS)[];
  const mostCommonSymptoms = categories
    .map((cat) => ({
      category: CATEGORY_LABELS[cat],
      avgScore: averageScores[cat],
      percentOfMax: Math.round((averageScores[cat] / MAX_SCORES[cat]) * 100),
    }))
    .sort((a, b) => b.percentOfMax - a.percentOfMax);

  return {
    count,
    averageScores,
    scoreDistribution,
    flareStatusDistribution,
    diagnosisDistribution,
    mostCommonSymptoms,
  };
}
