export type NodeType = 'start' | 'question' | 'action' | 'outcome' | 'treatment' | 'followup';

export interface FlowNode {
    id: string;
    type: NodeType;
    title: string;
    content?: string;
    notes?: string[];
    options?: { label: string; nextId: string; color?: string }[];
    actions?: string[];
    severity?: 'mild' | 'moderate' | 'severe' | 'info' | 'warning' | 'success';
    showComorbidBox?: boolean;
    showSeverityScale?: boolean;
}


export const typeLabel: Record<NodeType, string> = {
    start: '🚀 כניסה', question: '❓ שאלה', action: '🔬 פעולה',
    treatment: '💊 טיפול', outcome: '📋 תוצאה', followup: '🔄 מעקב',
};
