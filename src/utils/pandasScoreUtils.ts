import type { PansFormData, PansScores } from '../types/pandasScale';

/**
 * Computes the PANS/PANDAS scale scores from form data
 * Formula:
 * - OCD Score (0-25): Maximum rating among OCD symptoms × 5
 * - Associated Score (0-25): Sum of top 5 domain ratings
 * - Functional Score (0-50): Functional impairment rating × 10
 * - Total Score (0-100): Sum of all above
 */
export const computeScores = (formData: PansFormData): PansScores => {
    const { ocdSymptoms, associatedSymptoms, functionalImpairment } = formData;

    // 1. OCD Score: Max rating × 5
    const maxOcdRating = Math.max(...ocdSymptoms.map((s) => s.ratingCurrent));
    const ocdScore = maxOcdRating * 5;

    // 2. Associated Score: Sum of top 5 domain ratings
    // Group by domain and get max rating for each
    const domainRatings: Record<string, number> = {};
    associatedSymptoms.forEach((symptom) => {
        const currentMax = domainRatings[symptom.domain] || 0;
        domainRatings[symptom.domain] = Math.max(currentMax, symptom.ratingCurrent);
    });

    // Get top 5 domain ratings
    const sortedDomainRatings = Object.values(domainRatings)
        .sort((a, b) => b - a)
        .slice(0, 5);
    const associatedScore = sortedDomainRatings.reduce((sum, val) => sum + val, 0);

    // 3. Functional Score: Rating × 10
    const functionalScore = functionalImpairment[0].ratingCurrent * 10;

    // 4. Total Score
    const totalScore = ocdScore + associatedScore + functionalScore;

    return {
        ocdScore,
        associatedScore,
        functionalScore,
        totalScore,
    };
};

/**
 * Helper function to sum top 5 values from an array
 */
export const sumTop5 = (arr: number[]): number => {
    return [...arr].sort((a, b) => b - a).slice(0, 5).reduce((sum, v) => sum + v, 0);
};