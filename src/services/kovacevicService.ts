import {
    collection,
    addDoc,
    query,
    orderBy,
    limit,
    Timestamp,
    onSnapshot,
    QuerySnapshot,
    type DocumentData,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type {
    KovacevicFormData,
    KovacevicDiagnosisResult,
    DiagnosisFormula,
} from '../types/kovacevicScale';

// ============================================================================
// Firestore Document Structure
// ============================================================================

export interface KovacevicResultDocument {
    sessionId: string;
    scaleType: 'KOVACEVIC';
    timestamp: Timestamp;
    formData: KovacevicFormData;
    diagnosis: KovacevicDiagnosisResult;
}

// ============================================================================
// Diagnosis Calculation Functions
// ============================================================================

/**
 * Count how many criteria are met in each section
 */
function countCriteriaMet(formData: KovacevicFormData) {
    const { mandatory, core, secondaryGroup1, secondaryGroup2 } = formData;

    // Count mandatory criteria (3 total)
    const mandatoryCount = [
        mandatory.suddenOnset,
        mandatory.canRecallExactOnset,
        mandatory.dynamicEvolution,
    ].filter(Boolean).length;

    // Count core criteria (4 total)
    const coreCount = [
        core.ocdSymptoms,
        core.separationAnxiety,
        core.ticsOrMovements,
        core.eatingDisorder,
    ].filter(Boolean).length;

    // Count secondary group 1 (5 total)
    const group1Count = [
        secondaryGroup1.sleepDisturbances,
        secondaryGroup1.mydriasis,
        secondaryGroup1.behavioralRegression,
        secondaryGroup1.frightenedAppearance,
        secondaryGroup1.aggressionOrSuicidal,
    ].filter(Boolean).length;

    // Count secondary group 2 (13 total)
    const group2Count = [
        secondaryGroup2.fineMotorImpairment,
        secondaryGroup2.hyperactivityAttention,
        secondaryGroup2.memoryLoss,
        secondaryGroup2.learningDisabilities,
        secondaryGroup2.urinarySymptoms,
        secondaryGroup2.hallucinations,
        secondaryGroup2.sensoryHypersensitivity,
        secondaryGroup2.emotionalLability,
        secondaryGroup2.dysgraphia,
        secondaryGroup2.selectiveMutism,
        secondaryGroup2.hypotonia,
        secondaryGroup2.dystonia,
        secondaryGroup2.abdominalComplaints,
    ].filter(Boolean).length;

    return {
        mandatory: mandatoryCount,
        core: coreCount,
        secondaryGroup1: group1Count,
        secondaryGroup2: group2Count,
    };
}

/**
 * Calculate treatment response score (0-10%)
 */
function calculateTreatmentScore(formData: KovacevicFormData): number {
    const { treatment } = formData;
    let score = 0;

    // Each positive response adds 5%
    if (treatment.antibioticsResponse === 'yes') score += 5;
    if (treatment.steroidsResponse === 'yes') score += 5;

    return score;
}

/**
 * Calculate lab results score (0-5%)
 */
function calculateLabScore(formData: KovacevicFormData): number {
    const { labs } = formData;

    switch (labs.status) {
        case 'positive':
            return 5;
        case 'inconclusive':
            return 2.5;
        case 'negative':
        case 'not_tested':
        default:
            return 0;
    }
}

/**
 * Determine which diagnosis formula is met
 * 
 * Formula 1: Sudden onset + mandatory criterion met + 2 core criteria
 * Formula 2: 2 core criteria + 3 secondary criteria (at least 1 from each group)
 */
function determineFormula(
    formData: KovacevicFormData,
    counts: ReturnType<typeof countCriteriaMet>
): DiagnosisFormula {
    const { mandatory } = formData;

    // Check Formula 1: Sudden onset + 2+ core criteria
    const hasSuddenOnset = mandatory.suddenOnset;
    const hasMandatoryMet = counts.mandatory >= 2; // At least 2 of 3 mandatory
    const hasTwoCoreOrMore = counts.core >= 2;

    if (hasSuddenOnset && hasMandatoryMet && hasTwoCoreOrMore) {
        return 'formula1';
    }

    // Check Formula 2: 2 core + 3 secondary (at least 1 from each group)
    const hasOneFromGroup1 = counts.secondaryGroup1 >= 1;
    const hasOneFromGroup2 = counts.secondaryGroup2 >= 1;
    const totalSecondary = counts.secondaryGroup1 + counts.secondaryGroup2;
    const hasThreeSecondary = totalSecondary >= 3;

    if (hasTwoCoreOrMore && hasThreeSecondary && hasOneFromGroup1 && hasOneFromGroup2) {
        return 'formula2';
    }

    // Check for partial match
    const hasAnyCore = counts.core >= 1;
    const hasAnySecondary = totalSecondary >= 1;

    if (hasAnyCore && hasAnySecondary) {
        return 'partial';
    }

    return 'not_met';
}

/**
 * Calculate symptom-based confidence score (up to 80%)
 */
function calculateSymptomScore(
    formula: DiagnosisFormula,
    counts: ReturnType<typeof countCriteriaMet>
): number {
    if (formula === 'formula1') {
        // Full 80% for formula 1
        return 80;
    }

    if (formula === 'formula2') {
        // 70% base + bonus for extra criteria
        const extraCore = Math.max(0, counts.core - 2);
        const extraSecondary = Math.max(0, counts.secondaryGroup1 + counts.secondaryGroup2 - 3);
        const bonus = Math.min(10, (extraCore + extraSecondary) * 2);
        return 70 + bonus;
    }

    if (formula === 'partial') {
        // Partial score based on criteria met
        const corePercent = (counts.core / 4) * 40;
        const secondaryPercent =
            ((counts.secondaryGroup1 + counts.secondaryGroup2) / 18) * 20;
        return Math.round(corePercent + secondaryPercent);
    }

    return 0;
}

/**
 * Main diagnosis calculation function
 */
export function calculateDiagnosis(formData: KovacevicFormData): KovacevicDiagnosisResult {
    const counts = countCriteriaMet(formData);
    const formula = determineFormula(formData, counts);
    const treatmentScore = calculateTreatmentScore(formData);
    const labScore = calculateLabScore(formData);
    const symptomScore = calculateSymptomScore(formula, counts);

    return {
        formula,
        criteriaMetCount: counts,
        treatmentScore,
        labScore,
        confidenceBreakdown: {
            symptoms: symptomScore,
            treatment: treatmentScore,
            labs: labScore,
            margin: 5, // Always 5% error margin
        },
    };
}

// ============================================================================
// Firebase Operations
// ============================================================================

/**
 * Generate a session ID
 */
function generateSessionId(): string {
    return 'kovacevic_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Save Kovacevic scale results to Firestore
 */
export async function saveKovacevicResult(formData: KovacevicFormData): Promise<string> {
    try {
        // Get or create session ID
        let sessionId = localStorage.getItem('kovacevicSessionId');
        if (!sessionId) {
            sessionId = generateSessionId();
            localStorage.setItem('kovacevicSessionId', sessionId);
        }

        // Calculate diagnosis
        const diagnosis = calculateDiagnosis(formData);

        // Create document
        const resultDoc: Omit<KovacevicResultDocument, 'timestamp'> & { timestamp: Timestamp } = {
            sessionId,
            scaleType: 'KOVACEVIC',
            timestamp: Timestamp.now(),
            formData,
            diagnosis,
        };

        // Save to Firestore
        const docRef = await addDoc(collection(db, 'kovacevicResults'), resultDoc);

        console.log('✅ Kovacevic result saved:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('❌ Error saving Kovacevic result:', error);
        throw error;
    }
}

/**
 * Subscribe to real-time updates of Kovacevic results
 */
export function subscribeToKovacevicResults(
    callback: (results: KovacevicResultDocument[]) => void,
    limitCount: number = 100
): () => void {
    const q = query(
        collection(db, 'kovacevicResults'),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
    );

    const unsubscribe = onSnapshot(
        q,
        (snapshot: QuerySnapshot<DocumentData>) => {
            const results: KovacevicResultDocument[] = [];
            snapshot.forEach((doc) => {
                results.push(doc.data() as KovacevicResultDocument);
            });
            callback(results);
        },
        (error) => {
            console.error('❌ Error in Kovacevic subscription:', error);
        }
    );

    return unsubscribe;
}

// ============================================================================
// Aggregation for Charts
// ============================================================================

export interface KovacevicAggregatedData {
    count: number;
    formulaCounts: {
        formula1: number;
        formula2: number;
        partial: number;
        not_met: number;
    };
    averageCriteriaMet: {
        mandatory: number;
        core: number;
        secondaryGroup1: number;
        secondaryGroup2: number;
    };
    treatmentResponseRates: {
        antibiotics: number; // percentage who responded
        steroids: number;
    };
    labResultsDistribution: {
        positive: number;
        negative: number;
        inconclusive: number;
        not_tested: number;
    };
}

export function aggregateKovacevicResults(
    results: KovacevicResultDocument[]
): KovacevicAggregatedData {
    if (results.length === 0) {
        return {
            count: 0,
            formulaCounts: { formula1: 0, formula2: 0, partial: 0, not_met: 0 },
            averageCriteriaMet: { mandatory: 0, core: 0, secondaryGroup1: 0, secondaryGroup2: 0 },
            treatmentResponseRates: { antibiotics: 0, steroids: 0 },
            labResultsDistribution: { positive: 0, negative: 0, inconclusive: 0, not_tested: 0 },
        };
    }

    const count = results.length;

    // Count formulas
    const formulaCounts = { formula1: 0, formula2: 0, partial: 0, not_met: 0 };
    results.forEach((r) => {
        formulaCounts[r.diagnosis.formula]++;
    });

    // Sum criteria met
    const criteriaSums = { mandatory: 0, core: 0, secondaryGroup1: 0, secondaryGroup2: 0 };
    results.forEach((r) => {
        criteriaSums.mandatory += r.diagnosis.criteriaMetCount.mandatory;
        criteriaSums.core += r.diagnosis.criteriaMetCount.core;
        criteriaSums.secondaryGroup1 += r.diagnosis.criteriaMetCount.secondaryGroup1;
        criteriaSums.secondaryGroup2 += r.diagnosis.criteriaMetCount.secondaryGroup2;
    });

    // Treatment responses
    let antibioticsYes = 0;
    let steroidsYes = 0;
    results.forEach((r) => {
        if (r.formData.treatment.antibioticsResponse === 'yes') antibioticsYes++;
        if (r.formData.treatment.steroidsResponse === 'yes') steroidsYes++;
    });

    // Lab results distribution
    const labDist = { positive: 0, negative: 0, inconclusive: 0, not_tested: 0 };
    results.forEach((r) => {
        labDist[r.formData.labs.status]++;
    });

    return {
        count,
        formulaCounts,
        averageCriteriaMet: {
            mandatory: Math.round((criteriaSums.mandatory / count) * 10) / 10,
            core: Math.round((criteriaSums.core / count) * 10) / 10,
            secondaryGroup1: Math.round((criteriaSums.secondaryGroup1 / count) * 10) / 10,
            secondaryGroup2: Math.round((criteriaSums.secondaryGroup2 / count) * 10) / 10,
        },
        treatmentResponseRates: {
            antibiotics: Math.round((antibioticsYes / count) * 100),
            steroids: Math.round((steroidsYes / count) * 100),
        },
        labResultsDistribution: labDist,
    };
}
