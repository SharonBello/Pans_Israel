import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    increment,
    updateDoc,
    runTransaction,
    writeBatch,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type {
    BaseSurveyResponse,
    SurveySerial,
    SurveyStatistics,
    ExportOptions,
} from '../types/baseSurveyTypes';

// --------------------------------------------------------------------------
// Collection References
// --------------------------------------------------------------------------

const SERIALS_COLLECTION = 'survey_serials';
const SURVEYS_COLLECTION = 'surveys';
const RESPONSES_COLLECTION = 'survey_responses';

// --------------------------------------------------------------------------
// Hash function for email (simple, not cryptographic)
// --------------------------------------------------------------------------

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

// --------------------------------------------------------------------------
// Generate Serial Number
// --------------------------------------------------------------------------

const generateSerial = async (): Promise<string> => {
    const year = new Date().getFullYear();
    const counterRef = doc(db, 'counters', 'survey_serial');
    
    try {
        const newSerial = await runTransaction(db, async (transaction) => {
            const counterDoc = await transaction.get(counterRef);
            
            let currentCount = 1;
            if (counterDoc.exists()) {
                currentCount = (counterDoc.data().count || 0) + 1;
            }
            
            transaction.set(counterRef, { count: currentCount }, { merge: true });
            
            // Format: IL-2025-00001
            const paddedCount = currentCount.toString().padStart(5, '0');
            return `IL-${year}-${paddedCount}`;
        });
        
        return newSerial;
    } catch (error) {
        // Fallback if transaction fails
        console.error('Error generating serial:', error);
        const fallbackId = Date.now().toString(36);
        return `IL-${year}-${fallbackId}`;
    }
};

// --------------------------------------------------------------------------
// Get or Create Serial for Email
// --------------------------------------------------------------------------

export const getOrCreateSerial = async (email: string): Promise<SurveySerial> => {
    const emailHash = hashEmail(email);
    const serialRef = doc(db, SERIALS_COLLECTION, emailHash);
    
    const existingDoc = await getDoc(serialRef);
    
    if (existingDoc.exists()) {
        const data = existingDoc.data() as SurveySerial;
        // Update response count
        await updateDoc(serialRef, {
            responseCount: increment(1),
        });
        return {
            ...data,
            responseCount: data.responseCount + 1,
        };
    }
    
    // Create new serial
    const newSerial = await generateSerial();
    const serialData: SurveySerial = {
        email,
        serial: newSerial,
        createdAt: Timestamp.now(),
        responseCount: 1,
    };
    
    await setDoc(serialRef, serialData);
    
    return serialData;
};

// --------------------------------------------------------------------------
// Submit Survey Response
// --------------------------------------------------------------------------

export const submitSurveyResponse = async <T extends BaseSurveyResponse>(
    surveyId: string,
    email: string,
    answers: Record<string, unknown>,
    childIndex: number = 1
): Promise<{ success: boolean; responseId?: string; error?: string }> => {
    try {
        // Get or create serial
        const serialData = await getOrCreateSerial(email);
        
        // Prepare response document
        const responseData: BaseSurveyResponse = {
            surveyId,
            serial: serialData.serial,
            childIndex,
            submittedAt: Timestamp.now(),
            answers: answers as Record<string, string | number | boolean | string[]>,
        };
        
        // Save to survey-specific collection
        const responsesRef = collection(db, RESPONSES_COLLECTION, surveyId, 'responses');
        const docRef = await addDoc(responsesRef, responseData);
        
        // Update survey metadata (total responses)
        const surveyMetaRef = doc(db, SURVEYS_COLLECTION, surveyId);
        await setDoc(surveyMetaRef, {
            totalResponses: increment(1),
            lastResponseAt: Timestamp.now(),
        }, { merge: true });
        
        return {
            success: true,
            responseId: docRef.id,
        };
    } catch (error) {
        console.error('Error submitting survey:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
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

export const getSurveyResponseCount = async (surveyId: string): Promise<number> => {
    try {
        const surveyMetaRef = doc(db, SURVEYS_COLLECTION, surveyId);
        const surveyDoc = await getDoc(surveyMetaRef);
        
        if (surveyDoc.exists()) {
            return surveyDoc.data().totalResponses || 0;
        }
        
        return 0;
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
// Check if Email Has Submitted (for info purposes)
// --------------------------------------------------------------------------

export const getEmailSubmissionInfo = async (
    email: string
): Promise<{ hasSubmitted: boolean; submissionCount: number }> => {
    const emailHash = hashEmail(email);
    const serialRef = doc(db, SERIALS_COLLECTION, emailHash);
    
    const existingDoc = await getDoc(serialRef);
    
    if (existingDoc.exists()) {
        const data = existingDoc.data() as SurveySerial;
        return {
            hasSubmitted: true,
            submissionCount: data.responseCount,
        };
    }
    
    return {
        hasSubmitted: false,
        submissionCount: 0,
    };
};
