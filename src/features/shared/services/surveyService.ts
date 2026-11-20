import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    query,
    orderBy,
    limit,
    Timestamp,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type {
    BaseSurveyResponse,
    SurveyStatistics,
    ExportOptions,
} from '../types/baseSurveyTypes';

// --------------------------------------------------------------------------
// Collection References
// --------------------------------------------------------------------------

/** email + serial, one record per family per device — create-only, nobody can read it from the site */
const SERIALS_COLLECTION = 'survey_serials';
const RESPONSES_COLLECTION = 'survey_responses';
/** Published aggregate statistics: public read, admin write (individual responses stay admin-only) */
const STATS_COLLECTION = 'survey_stats';

// --------------------------------------------------------------------------
// Family serials
// --------------------------------------------------------------------------
//
// Saving only ever CREATES documents. Reading the email records or updating shared
// counters is blocked by the security rules (and must stay blocked: those records hold
// parents' emails), so:
//   - each family gets a random serial instead of a running counter;
//   - the serial is remembered in this browser, per email, so siblings filled in on
//     the same device share it ("כבר מילאתם N סקרים" works on that device);
//   - the email + serial record is written once per family per device, so admins can
//     still match families across devices in the Firebase Console.

const FAMILY_STORAGE_KEY = 'soc-survey-families:v1';

interface LocalFamily {
    serial: string;
    count: number;   // surveys sent from this browser with this email
}

/** Local lookup key only (never sent anywhere) */
const hashEmail = (email: string): string => {
    const normalized = email.toLowerCase().trim();
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
        const char = normalized.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
};

const readFamilies = (): Record<string, LocalFamily> => {
    try {
        return JSON.parse(localStorage.getItem(FAMILY_STORAGE_KEY) || '{}') as Record<string, LocalFamily>;
    } catch {
        return {};
    }
};

const writeFamilies = (families: Record<string, LocalFamily>): void => {
    try {
        localStorage.setItem(FAMILY_STORAGE_KEY, JSON.stringify(families));
    } catch {
        /* storage blocked — the survey still saves, siblings just won't be grouped */
    }
};

/** 'IL-2026-K7Q2M9XD' — random, so no shared counter is needed */
const generateSerial = (): string => {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I
    const bytes = crypto.getRandomValues(new Uint8Array(8));
    const code = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
    return `IL-${new Date().getFullYear()}-${code}`;
};

// --------------------------------------------------------------------------
// Submit Survey Response
// --------------------------------------------------------------------------

export const submitSurveyResponse = async (
    surveyId: string,
    email: string,
    answers: Record<string, unknown>,
    childIndex: number = 1
): Promise<{ success: boolean; responseId?: string; error?: string }> => {
    const key = hashEmail(email);
    const families = readFamilies();
    const known = families[key];
    const serial = known?.serial ?? generateSerial();

    let responseId: string;
    try {
        // 1. The answers — the part that matters most
        const responseData: BaseSurveyResponse = {
            surveyId,
            serial,
            childIndex,
            submittedAt: Timestamp.now(),
            answers: answers as Record<string, string | number | boolean | string[]>,
        };
        const docRef = await addDoc(collection(db, RESPONSES_COLLECTION, surveyId, 'responses'), responseData);
        responseId = docRef.id;
    } catch (error) {
        console.error('Error submitting survey:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }

    // The answers are saved. Remember the family on this device…
    writeFamilies({ ...families, [key]: { serial, count: (known?.count ?? 0) + 1 } });

    // 2. …and, for a new family, store email + serial (separately from the answers).
    // Best effort: if this fails, the answers are still saved, so don't report an error.
    if (!known) {
        try {
            await addDoc(collection(db, SERIALS_COLLECTION), {
                email: email.trim().toLowerCase(),
                serial,
                createdAt: Timestamp.now(),
            });
        } catch (error) {
            console.error('Error saving family record (answers were saved):', error);
        }
    }

    return { success: true, responseId };
};

// --------------------------------------------------------------------------
// Get Survey Responses (for admin/results)
// --------------------------------------------------------------------------

export const getSurveyResponses = async (
    surveyId: string,
    limitCount?: number
): Promise<BaseSurveyResponse[]> => {
    try {
        const responsesRef = collection(db, RESPONSES_COLLECTION, surveyId, 'responses');

        let q = query(responsesRef, orderBy('submittedAt', 'desc'));
        if (limitCount) {
            q = query(q, limit(limitCount));
        }

        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        } as BaseSurveyResponse));
    } catch (error) {
        console.error('Error fetching responses:', error);
        return [];
    }
};

// --------------------------------------------------------------------------
// Get Survey Response Count
// --------------------------------------------------------------------------

// Replace the getSurveyResponseCount function with this:
export const getSurveyResponseCount = async (surveyId: string): Promise<number> => {
    try {
        const responsesRef = collection(db, RESPONSES_COLLECTION, surveyId, 'responses');
        const snapshot = await getDocs(responsesRef);
        return snapshot.docs.length;
    } catch (error) {
        console.error('Error getting response count:', error);
        return 0;
    }
};

// --------------------------------------------------------------------------
// Get Unique Family Count
// --------------------------------------------------------------------------

export const getUniqueFamilyCount = async (surveyId: string): Promise<number> => {
    try {
        const responsesRef = collection(db, RESPONSES_COLLECTION, surveyId, 'responses');
        const snapshot = await getDocs(responsesRef);

        const uniqueSerials = new Set<string>();
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            if (data.serial) {
                uniqueSerials.add(data.serial);
            }
        });

        return uniqueSerials.size;
    } catch (error) {
        console.error('Error getting family count:', error);
        return 0;
    }
};

// --------------------------------------------------------------------------
// Calculate Survey Statistics
// --------------------------------------------------------------------------

export const calculateSurveyStatistics = async (
    surveyId: string
): Promise<SurveyStatistics | null> => {
    try {
        const responses = await getSurveyResponses(surveyId);

        if (responses.length === 0) {
            return null;
        }

        const uniqueSerials = new Set(responses.map(r => r.serial));

        // Calculate question-level statistics
        const questionStats: Record<string, {
            questionId: string;
            totalAnswers: number;
            optionCounts: Record<string, number>;
            optionPercentages: Record<string, number>;
            values: number[];
        }> = {};

        responses.forEach(response => {
            Object.entries(response.answers).forEach(([questionId, answer]) => {
                if (!questionStats[questionId]) {
                    questionStats[questionId] = {
                        questionId,
                        totalAnswers: 0,
                        optionCounts: {},
                        optionPercentages: {},
                        values: [],
                    };
                }

                const stat = questionStats[questionId];
                stat.totalAnswers++;

                // Handle different answer types
                if (typeof answer === 'number') {
                    stat.values.push(answer);
                } else if (typeof answer === 'string') {
                    stat.optionCounts[answer] = (stat.optionCounts[answer] || 0) + 1;
                } else if (Array.isArray(answer)) {
                    answer.forEach(a => {
                        stat.optionCounts[a] = (stat.optionCounts[a] || 0) + 1;
                    });
                } else if (typeof answer === 'boolean') {
                    const key = answer ? 'yes' : 'no';
                    stat.optionCounts[key] = (stat.optionCounts[key] || 0) + 1;
                }
            });
        });

        // Calculate percentages and averages
        Object.values(questionStats).forEach(stat => {
            // Percentages for option counts
            Object.entries(stat.optionCounts).forEach(([option, count]) => {
                stat.optionPercentages[option] = Math.round((count / stat.totalAnswers) * 100);
            });
        });

        // Get last response time
        const sortedResponses = responses.sort((a, b) => {
            const aTime = a.submittedAt instanceof Timestamp ? a.submittedAt.toMillis() : 0;
            const bTime = b.submittedAt instanceof Timestamp ? b.submittedAt.toMillis() : 0;
            return bTime - aTime;
        });

        return {
            totalResponses: responses.length,
            uniqueFamilies: uniqueSerials.size,
            lastResponseAt: sortedResponses[0]?.submittedAt,
            questionStats: questionStats as Record<string, any>,
        };
    } catch (error) {
        console.error('Error calculating statistics:', error);
        return null;
    }
};

// --------------------------------------------------------------------------
// Export Survey Data
// --------------------------------------------------------------------------

export const exportSurveyData = async (
    surveyId: string,
    options: ExportOptions
): Promise<{ data: string; filename: string; mimeType: string }> => {
    const responses = await getSurveyResponses(surveyId);

    // Filter by date range if provided
    let filteredResponses = responses;
    if (options.dateRange) {
        filteredResponses = responses.filter(r => {
            const submittedAt = r.submittedAt instanceof Timestamp
                ? r.submittedAt.toDate()
                : new Date();
            return submittedAt >= options.dateRange!.start &&
                submittedAt <= options.dateRange!.end;
        });
    }

    // Prepare data rows
    const rows = filteredResponses.map(response => {
        const row: Record<string, unknown> = {
            ...(options.anonymize ? {} : { serial: response.serial }),
            childIndex: response.childIndex,
            submittedAt: response.submittedAt instanceof Timestamp
                ? response.submittedAt.toDate().toISOString()
                : '',
            ...response.answers,
        };
        return row;
    });

    const timestamp = options.includeTimestamp
        ? `_${new Date().toISOString().split('T')[0]}`
        : '';

    if (options.format === 'json') {
        return {
            data: JSON.stringify(rows, null, 2),
            filename: `${surveyId}${timestamp}.json`,
            mimeType: 'application/json',
        };
    }

    // CSV format
    if (rows.length === 0) {
        return {
            data: '',
            filename: `${surveyId}${timestamp}.csv`,
            mimeType: 'text/csv',
        };
    }

    const headers = Object.keys(rows[0]);
    const csvRows = [
        headers.join(','),
        ...rows.map(row =>
            headers.map(header => {
                const value = row[header];
                if (value === null || value === undefined) return '';
                if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                if (Array.isArray(value)) {
                    return `"${value.join('; ')}"`;
                }
                return String(value);
            }).join(',')
        ),
    ];

    return {
        data: csvRows.join('\n'),
        filename: `${surveyId}${timestamp}.csv`,
        mimeType: 'text/csv',
    };
};

// --------------------------------------------------------------------------
// Check if Email Has Submitted (for info purposes) — on this device
// --------------------------------------------------------------------------

export const getEmailSubmissionInfo = async (
    email: string
): Promise<{ hasSubmitted: boolean; submissionCount: number }> => {
    const family = readFamilies()[hashEmail(email)];
    return {
        hasSubmitted: Boolean(family),
        submissionCount: family?.count ?? 0,
    };
};

// --------------------------------------------------------------------------
// Published statistics (what the public results page shows)
// --------------------------------------------------------------------------

/** The statistics last published for a survey, or null if none have been published yet */
export const getPublishedSurveyStats = async <T extends object>(surveyId: string): Promise<T | null> => {
    const snap = await getDoc(doc(db, STATS_COLLECTION, surveyId));
    return snap.exists() ? (snap.data() as T) : null;
};

/** Admin only: replace the published statistics for a survey */
export const publishSurveyStats = async <T extends object>(surveyId: string, stats: T): Promise<void> => {
    // JSON round-trip drops undefined values, which Firestore rejects
    const clean = JSON.parse(JSON.stringify(stats)) as T;
    await setDoc(doc(db, STATS_COLLECTION, surveyId), { ...clean, publishedAt: serverTimestamp() });
};