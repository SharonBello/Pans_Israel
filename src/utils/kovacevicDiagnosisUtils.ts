// ============================================================================
// Kovacevic Diagnosis Calculator
// Implements the diagnostic formulas from Dr. Kovacevic's 2019 criteria
// ============================================================================

import type {
  KovacevicFormData,
  KovacevicDiagnosisResult,
  DiagnosisFormula,
  CriterionResponse,
} from '@/types/kovacevicScale';

/**
 * Check if a criterion response is "yes"
 */
const isYes = (response: CriterionResponse): boolean => response === 'yes';

/**
 * Count how many core criteria are met (present = 'yes')
 */
function countCoreCriteriaMet(formData: KovacevicFormData): number {
  const { core } = formData;
  let count = 0;

  if (isYes(core.ocdSymptoms.present)) count++;
  if (isYes(core.separationAnxiety.present)) count++;
  if (isYes(core.ticsOrMovements.present)) count++;
  if (isYes(core.eatingDisorder.present)) count++;

  return count;
}

/**
 * Count secondary criteria met in Group 1
 */
function countSecondaryGroup1Met(formData: KovacevicFormData): number {
  const { secondaryGroup1 } = formData;
  let count = 0;

  if (isYes(secondaryGroup1.sleepDisturbances.present)) count++;
  if (isYes(secondaryGroup1.mydriasis.present)) count++;
  if (isYes(secondaryGroup1.behavioralRegression.present)) count++;
  if (isYes(secondaryGroup1.frightenedAppearance.present)) count++;
  if (isYes(secondaryGroup1.aggressionOrSuicidalBehavior.present)) count++;

  return count;
}

/**
 * Count secondary criteria met in Group 2
 */
function countSecondaryGroup2Met(formData: KovacevicFormData): number {
  const { secondaryGroup2 } = formData;
  let count = 0;

  if (isYes(secondaryGroup2.fineMotorImpairment.present)) count++;
  if (isYes(secondaryGroup2.hyperactivityAttention.present)) count++;
  if (isYes(secondaryGroup2.memoryLoss.present)) count++;
  if (isYes(secondaryGroup2.learningDisabilities.present)) count++;
  if (isYes(secondaryGroup2.urinarySymptoms.present)) count++;
  if (isYes(secondaryGroup2.hallucinations.present)) count++;
  if (isYes(secondaryGroup2.sensoryHypersensitivity.present)) count++;
  if (isYes(secondaryGroup2.emotionalLabilityDepression.present)) count++;
  if (isYes(secondaryGroup2.dysgraphia.present)) count++;
  if (isYes(secondaryGroup2.selectiveMutism.present)) count++;
  if (isYes(secondaryGroup2.hypotonia.present)) count++;
  if (isYes(secondaryGroup2.intermittentDystonia.present)) count++;
  if (isYes(secondaryGroup2.abdominalComplaints.present)) count++;

  return count;
}

/**
 * Check if mandatory criterion is met (sudden onset)
 */
function isMandatoryCriterionMet(formData: KovacevicFormData): boolean {
  const { mandatory } = formData;
  
  // Sudden onset is the key mandatory criterion
  // Having at least suddenOnset OR (canRecallExactOnset AND dynamicEvolution)
  return (
    isYes(mandatory.suddenOnset) ||
    (isYes(mandatory.canRecallExactOnset) && isYes(mandatory.dynamicEvolution))
  );
}

/**
 * Calculate clinical symptoms score (80% of diagnosis)
 * Based on how many criteria are met
 */
function calculateClinicalScore(
  mandatoryMet: boolean,
  coreCount: number,
  secondaryGroup1Count: number,
  secondaryGroup2Count: number,
  formula: DiagnosisFormula
): number {
  if (formula === 'not_met' || formula === 'inconclusive') {
    // Partial score based on criteria met
    let score = 0;
    if (mandatoryMet) score += 20;
    score += Math.min(coreCount * 15, 60); // Max 60 for core (4 criteria)
    return score;
  }

  // Full clinical score if formula is met
  return 80;
}

/**
 * Calculate treatment response score (10% of diagnosis)
 */
function calculateTreatmentScore(formData: KovacevicFormData): number {
  const { treatmentResponse } = formData.additional;
  
  if (isYes(treatmentResponse.antibioticsResponse) || isYes(treatmentResponse.steroidsResponse)) {
    return 10;
  }
  
  // Partial score if one is unknown but other is positive
  if (treatmentResponse.antibioticsResponse === 'unknown' && treatmentResponse.steroidsResponse === 'unknown') {
    return 0;
  }
  
  return 0;
}

/**
 * Calculate lab results score (5% of diagnosis)
 */
function calculateLabScore(formData: KovacevicFormData): number {
  const { labResults } = formData.additional;
  
  if (labResults.overallResult === 'positive') {
    return 5;
  }
  
  if (isYes(labResults.elevatedASO) || isYes(labResults.positiveThroatCulture)) {
    return 5;
  }
  
  // Partial score for inconclusive
  if (labResults.overallResult === 'inconclusive') {
    return 2.5;
  }
  
  return 0;
}

/**
 * Determine which diagnostic formula is met
 * 
 * Formula 1: Sudden onset + Mandatory criterion + 2 Core criteria
 * Formula 2: 2 Core criteria + 3 Secondary criteria (at least 1 from each group)
 */
function determineFormula(
  mandatoryMet: boolean,
  coreCount: number,
  secondaryGroup1Count: number,
  secondaryGroup2Count: number
): DiagnosisFormula {
  const totalSecondary = secondaryGroup1Count + secondaryGroup2Count;
  const hasAtLeastOneFromEachGroup = secondaryGroup1Count >= 1 && secondaryGroup2Count >= 1;

  // Formula 1: Sudden onset + 2 core criteria
  if (mandatoryMet && coreCount >= 2) {
    return 'formula1';
  }

  // Formula 2: 2 core criteria + 3 secondary (at least 1 from each group)
  if (coreCount >= 2 && totalSecondary >= 3 && hasAtLeastOneFromEachGroup) {
    return 'formula2';
  }

  // Check if we have enough data to make a determination
  // If too many "unknown" responses, return inconclusive
  if (coreCount === 0 && totalSecondary === 0) {
    return 'inconclusive';
  }

  return 'not_met';
}

/**
 * Generate Hebrew summary based on diagnosis result
 */
function generateSummaryHebrew(
  formula: DiagnosisFormula,
  criteriaMet: KovacevicDiagnosisResult['criteriaMet'],
  confidence: KovacevicDiagnosisResult['confidence']
): string {
  switch (formula) {
    case 'formula1':
      return `האבחנה עומדת בקריטריונים של נוסחה מס' 1: הופעה פתאומית עם ${criteriaMet.coreCount} קריטריונים מרכזיים. רמת הביטחון: ${confidence.total}%.`;
    
    case 'formula2':
      return `האבחנה עומדת בקריטריונים של נוסחה מס' 2: ${criteriaMet.coreCount} קריטריונים מרכזיים ו-${criteriaMet.totalSecondary} קריטריונים משניים. רמת הביטחון: ${confidence.total}%.`;
    
    case 'inconclusive':
      return 'לא ניתן לקבוע אבחנה על סמך המידע שהוזן. מומלץ להתייעץ עם רופא מומחה.';
    
    case 'not_met':
    default:
      return `הנתונים שהוזנו אינם עומדים בקריטריונים לאבחנה. נמצאו ${criteriaMet.coreCount} קריטריונים מרכזיים ו-${criteriaMet.totalSecondary} קריטריונים משניים. מומלץ להתייעץ עם רופא מומחה.`;
  }
}

/**
 * Main function to calculate diagnosis based on Kovacevic criteria
 */
export function calculateKovacevicDiagnosis(
  formData: KovacevicFormData
): KovacevicDiagnosisResult {
  // Count criteria met
  const mandatoryMet = isMandatoryCriterionMet(formData);
  const coreCount = countCoreCriteriaMet(formData);
  const secondaryGroup1Count = countSecondaryGroup1Met(formData);
  const secondaryGroup2Count = countSecondaryGroup2Met(formData);
  const totalSecondary = secondaryGroup1Count + secondaryGroup2Count;

  // Determine which formula is met
  const formula = determineFormula(
    mandatoryMet,
    coreCount,
    secondaryGroup1Count,
    secondaryGroup2Count
  );

  // Calculate confidence scores
  const clinicalScore = calculateClinicalScore(
    mandatoryMet,
    coreCount,
    secondaryGroup1Count,
    secondaryGroup2Count,
    formula
  );
  const treatmentScore = calculateTreatmentScore(formData);
  const labScore = calculateLabScore(formData);
  const margin = 5; // Always 5% margin

  const confidence = {
    clinicalSymptoms: clinicalScore,
    treatmentResponse: treatmentScore,
    labResults: labScore,
    margin,
    total: Math.min(clinicalScore + treatmentScore + labScore, 100),
  };

  const criteriaMet = {
    mandatory: mandatoryMet,
    coreCount,
    secondaryGroup1Count,
    secondaryGroup2Count,
    totalSecondary,
  };

  const summaryHebrew = generateSummaryHebrew(formula, criteriaMet, confidence);

  return {
    formula,
    confidence,
    criteriaMet,
    summaryHebrew,
  };
}

/**
 * Get severity score for charting (0-100 normalized)
 * This helps compare across different patients
 */
export function calculateSeverityScore(formData: KovacevicFormData): number {
  const { core, secondaryGroup1, secondaryGroup2 } = formData;

  const coreList = Object.values(core);
  const g1List = Object.values(secondaryGroup1);
  const g2List = Object.values(secondaryGroup2);

  const totalSeverity: number =
    coreList.reduce((s, c) => s + c.severity, 0) +
    g1List.reduce((s, c) => s + c.severity, 0) +
    g2List.reduce((s, c) => s + c.severity, 0);

  const maxPossible: number = (coreList.length + g1List.length + g2List.length) * 5;

  if (maxPossible <= 0) return 0;
  return Math.round((totalSeverity / maxPossible) * 100);
}
