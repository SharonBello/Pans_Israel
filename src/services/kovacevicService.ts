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
function countCriteriaMet(formData: KovacevicFormData): {
    mandatory: number;
    core: number;
    secondaryGroup1: number;
    secondaryGroup2: number;
} {
    const { mandatory, core, secondaryGroup1, secondaryGroup2 } = formData;

    const mandatoryCount: number = [
        mandatory.suddenOnset,
        mandatory.canRecallExactOnset,
        mandatory.dynamicEvolution,
    ].filter((v: string) => v === 'yes').length;

    const coreCount: number = [
        core.ocdSymptoms,
        core.separationAnxiety,
        core.ticsOrMovements,
        core.eatingDisorder,
    ].filter((c: { present: string }) => c.present === 'yes').length;

    const group1Count: number = [
        secondaryGroup1.sleepDisturbances,
        secondaryGroup1.mydriasis,
        secondaryGroup1.behavioralRegression,
        secondaryGroup1.frightenedAppearance,
        secondaryGroup1.aggressionOrSuicidalBehavior,
    ].filter((c: { present: string }) => c.present === 'yes').length;

    const group2Count: number = [
        secondaryGroup2.fineMotorImpairment,
        secondaryGroup2.hyperactivityAttention,
        secondaryGroup2.memoryLoss,
        secondaryGroup2.learningDisabilities,
        secondaryGroup2.urinarySymptoms,
        secondaryGroup2.hallucinations,
        secondaryGroup2.sensoryHypersensitivity,
        secondaryGroup2.emotionalLabilityDepression,
        secondaryGroup2.dysgraphia,
        secondaryGroup2.selectiveMutism,
        secondaryGroup2.hypotonia,
        secondaryGroup2.intermittentDystonia,
        secondaryGroup2.abdominalComplaints,
    ].filter((c: { present: string }) => c.present === 'yes').length;

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
    const { treatmentResponse } = formData.additional;
    let score = 0;

    // Each positive response adds 5%
    if (treatmentResponse.antibioticsResponse === 'yes') score += 5;
    if (treatmentResponse.steroidsResponse === 'yes') score += 5;

    return score;
}

/**
 * Calculate lab results score (0-5%)
 */
function calculateLabScore(formData: KovacevicFormData): number {
    const { labResults } = formData.additional;

    switch (labResults.overallResult) {
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
    const hasSuddenOnset: boolean = mandatory.suddenOnset === 'yes';
    const hasMandatoryMet: boolean = counts.mandatory >= 2;
    const hasTwoCoreOrMore: boolean = counts.core >= 2;

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

    const confidence = {
        clinicalSymptoms: symptomScore,
        treatmentResponse: treatmentScore,
        labResults: labScore,
        margin: 5,
        total: Math.min(symptomScore + treatmentScore + labScore + 5, 100),
    };

    const criteriaMet = {
        mandatory: counts.mandatory >= 2,
        coreCount: counts.core,
        secondaryGroup1Count: counts.secondaryGroup1,
        secondaryGroup2Count: counts.secondaryGroup2,
        totalSecondary: counts.secondaryGroup1 + counts.secondaryGroup2,
    };

    return {
        formula,
        confidence,
        criteriaMet,
        summaryHebrew: '', // or generate a string if your type requires it
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
        inconclusive: number;
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
    // Filter/normalize: skip docs that don't have the minimum structure we need
    const validResults: KovacevicResultDocument[] = results.filter(
        (r: KovacevicResultDocument): boolean =>
            Boolean(r?.diagnosis?.formula) && Boolean(r?.formData)
    );

    if (validResults.length === 0) {
        return {
            count: 0,
            formulaCounts: { formula1: 0, formula2: 0, partial: 0, not_met: 0, inconclusive: 0 },
            averageCriteriaMet: { mandatory: 0, core: 0, secondaryGroup1: 0, secondaryGroup2: 0 },
            treatmentResponseRates: { antibiotics: 0, steroids: 0 },
            labResultsDistribution: { positive: 0, negative: 0, inconclusive: 0, not_tested: 0 },
        };
    }

    const count: number = validResults.length;

    // Count formulas safely
    const formulaCounts: Record<DiagnosisFormula, number> = {
        formula1: 0,
        formula2: 0,
        partial: 0,
        not_met: 0,
        inconclusive: 0,
    };

    validResults.forEach((r: KovacevicResultDocument) => {
        const formula: DiagnosisFormula = r.diagnosis.formula;
        formulaCounts[formula] += 1;
    });

    // Sum criteria met safely (handle older docs missing criteriaMet)
    const criteriaSums: { mandatory: number; core: number; secondaryGroup1: number; secondaryGroup2: number } = {
        mandatory: 0,
        core: 0,
        secondaryGroup1: 0,
        secondaryGroup2: 0,
    };

    validResults.forEach((r: KovacevicResultDocument) => {
        const criteriaMet = r.diagnosis?.criteriaMet;

        // If criteriaMet is missing (older docs), treat as zeroes instead of crashing
        const mandatoryVal: number = criteriaMet?.mandatory ? 1 : 0;
        const coreVal: number = typeof criteriaMet?.coreCount === 'number' ? criteriaMet.coreCount : 0;
        const g1Val: number =
            typeof criteriaMet?.secondaryGroup1Count === 'number' ? criteriaMet.secondaryGroup1Count : 0;
        const g2Val: number =
            typeof criteriaMet?.secondaryGroup2Count === 'number' ? criteriaMet.secondaryGroup2Count : 0;

        criteriaSums.mandatory += mandatoryVal;
        criteriaSums.core += coreVal;
        criteriaSums.secondaryGroup1 += g1Val;
        criteriaSums.secondaryGroup2 += g2Val;
    });

    // Treatment responses safely
    let antibioticsYes: number = 0;
    let steroidsYes: number = 0;

    validResults.forEach((r: KovacevicResultDocument) => {
        const tr = r.formData?.additional?.treatmentResponse;
        if (tr?.antibioticsResponse === 'yes') antibioticsYes += 1;
        if (tr?.steroidsResponse === 'yes') steroidsYes += 1;
    });

    // Lab results distribution safely
    type LabOverall = KovacevicFormData['additional']['labResults']['overallResult'];

    const labDist: Record<LabOverall, number> = {
        positive: 0,
        negative: 0,
        inconclusive: 0,
        not_tested: 0,
    };

    validResults.forEach((r: KovacevicResultDocument) => {
        const overall: LabOverall | undefined = r.formData?.additional?.labResults?.overallResult;
        const key: LabOverall = overall ?? 'not_tested';
        labDist[key] += 1;
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
