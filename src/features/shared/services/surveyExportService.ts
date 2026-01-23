import type { BaseSurveyResponse } from '../types/baseSurveyTypes';
import { Timestamp } from 'firebase/firestore';

// --------------------------------------------------------------------------
// Excel Export (using SheetJS)
// --------------------------------------------------------------------------

export const exportToExcel = async (
    responses: BaseSurveyResponse[],
    surveyId: string,
    questionLabels: Record<string, string>,
    includeSerial: boolean = false
): Promise<Blob> => {
    // Dynamically import xlsx
    const XLSX = await import('xlsx');
    
    // Prepare data with Hebrew column headers
    const data = responses.map(response => {
        const row: Record<string, unknown> = {};
        
        if (includeSerial) {
            row['מספר סידורי'] = response.serial;
        }
        
        row['מספר ילד במשפחה'] = response.childIndex;
        row['תאריך מילוי'] = response.submittedAt instanceof Timestamp
            ? response.submittedAt.toDate().toLocaleDateString('he-IL')
            : '';
        
        // Add answers with Hebrew labels
        Object.entries(response.answers).forEach(([questionId, answer]) => {
            const label = questionLabels[questionId] || questionId;
            if (Array.isArray(answer)) {
                row[label] = answer.join(', ');
            } else if (typeof answer === 'boolean') {
                row[label] = answer ? 'כן' : 'לא';
            } else {
                row[label] = answer;
            }
        });
        
        return row;
    });
    
    // Create workbook
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'תשובות');
    
    // Set RTL for the worksheet
    worksheet['!dir'] = 'rtl';
    
    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    
    return new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
};

// --------------------------------------------------------------------------
// CSV Export with UTF-8 BOM (for Excel Hebrew support)
// --------------------------------------------------------------------------

export const exportToCSV = (
    responses: BaseSurveyResponse[],
    questionLabels: Record<string, string>,
    includeSerial: boolean = false
): string => {
    if (responses.length === 0) {
        return '';
    }
    
    // Build headers
    const headers: string[] = [];
    if (includeSerial) {
        headers.push('מספר סידורי');
    }
    headers.push('מספר ילד במשפחה', 'תאריך מילוי');
    
    // Get all unique question IDs from all responses
    const allQuestionIds = new Set<string>();
    responses.forEach(r => {
        Object.keys(r.answers).forEach(id => allQuestionIds.add(id));
    });
    
    allQuestionIds.forEach(questionId => {
        headers.push(questionLabels[questionId] || questionId);
    });
    
    // Build rows
    const rows = responses.map(response => {
        const row: string[] = [];
        
        if (includeSerial) {
            row.push(escapeCSV(response.serial));
        }
        
        row.push(String(response.childIndex));
        row.push(response.submittedAt instanceof Timestamp
            ? response.submittedAt.toDate().toLocaleDateString('he-IL')
            : '');
        
        allQuestionIds.forEach(questionId => {
            const answer = response.answers[questionId];
            if (answer === undefined || answer === null) {
                row.push('');
            } else if (Array.isArray(answer)) {
                row.push(escapeCSV(answer.join('; ')));
            } else if (typeof answer === 'boolean') {
                row.push(answer ? 'כן' : 'לא');
            } else {
                row.push(escapeCSV(String(answer)));
            }
        });
        
        return row.join(',');
    });
    
    // Add UTF-8 BOM for Excel Hebrew support
    const BOM = '\uFEFF';
    return BOM + [headers.map(escapeCSV).join(','), ...rows].join('\n');
};

// --------------------------------------------------------------------------
// Helper: Escape CSV value
// --------------------------------------------------------------------------

const escapeCSV = (value: string): string => {
    if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
};

// --------------------------------------------------------------------------
// Download Helper
// --------------------------------------------------------------------------

export const downloadFile = (
    content: string | Blob,
    filename: string,
    mimeType: string
): void => {
    const blob = content instanceof Blob 
        ? content 
        : new Blob([content], { type: mimeType });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// --------------------------------------------------------------------------
// Get Question Labels Map
// --------------------------------------------------------------------------

export const getQuestionLabelsFromCategories = (
    categories: Array<{ questions: Array<{ id: string; questionText: string }> }>
): Record<string, string> => {
    const labels: Record<string, string> = {};
    
    categories.forEach(category => {
        category.questions.forEach(question => {
            // Truncate long questions for column headers
            const label = question.questionText.length > 50
                ? question.questionText.substring(0, 47) + '...'
                : question.questionText;
            labels[question.id] = label;
        });
    });
    
    return labels;
};

// --------------------------------------------------------------------------
// Export Statistics Summary
// --------------------------------------------------------------------------

export interface StatisticsSummary {
    label: string;
    value: string | number;
    percentage?: number;
}

export const exportStatisticsSummary = (
    statistics: Record<string, {
        questionId: string;
        totalAnswers: number;
        optionCounts?: Record<string, number>;
        optionPercentages?: Record<string, number>;
        values?: number[];
    }>,
    questionLabels: Record<string, string>
): string => {
    const lines: string[] = [
        '\uFEFF', // UTF-8 BOM
        'סיכום סטטיסטי - סקר מצב ילדינו',
        `תאריך הפקה: ${new Date().toLocaleDateString('he-IL')}`,
        '',
        '---',
        '',
    ];
    
    Object.entries(statistics).forEach(([questionId, stat]) => {
        const label = questionLabels[questionId] || questionId;
        lines.push(`שאלה: ${label}`);
        lines.push(`מספר תשובות: ${stat.totalAnswers}`);
        
        if (stat.optionCounts && Object.keys(stat.optionCounts).length > 0) {
            lines.push('התפלגות תשובות:');
            Object.entries(stat.optionCounts).forEach(([option, count]) => {
                const percentage = stat.optionPercentages?.[option] || 0;
                lines.push(`  - ${option}: ${count} (${percentage}%)`);
            });
        }
        
        if (stat.values && stat.values.length > 0) {
            const avg = stat.values.reduce((a, b) => a + b, 0) / stat.values.length;
            lines.push(`ממוצע: ${avg.toFixed(2)}`);
        }
        
        lines.push('');
    });
    
    return lines.join('\n');
};
