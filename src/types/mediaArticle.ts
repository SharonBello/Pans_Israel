export type MediaType = 'article' | 'youtube' | 'facebook' | 'tiktok' | 'pdf';

export type MediaArticleCategory =
    | 'diagnosis' | 'research' | 'story' | 'treatment'
    | 'awareness' | 'international' | 'other';

export const CATEGORY_LABELS: Record<MediaArticleCategory, string> = {
    diagnosis: 'אבחון', research: 'מחקר', story: 'סיפור אישי',
    treatment: 'טיפול', awareness: 'מודעות', international: 'בינלאומי', other: 'אחר',
};

export const CATEGORY_COLORS: Record<MediaArticleCategory, string> = {
    diagnosis: '#023373', research: '#5B9A8B', story: '#E67E22',
    treatment: '#6a1b9a', awareness: '#c0392b', international: '#2c3e50', other: '#718096',
};

export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
    article: 'כתבה', youtube: 'YouTube', facebook: 'Facebook', tiktok: 'TikTok', pdf: 'PDF',
};

export const MEDIA_TYPE_COLORS: Record<MediaType, string> = {
    article: '#023373', youtube: '#FF0000', facebook: '#1877F2', tiktok: '#010101', pdf: '#E53E3E',
};

export interface MediaArticle {
    id: string;
    mediaType: MediaType;
    title: string;
    url: string;
    thumbnailUrl?: string;
    publication: string;
    publicationLogoUrl?: string;
    datePublished: string;
    summary: string;
    category: MediaArticleCategory;
    featured: boolean;
    published: boolean;
    createdAt: any;
    updatedAt: any;
}

export type MediaArticleFormData = Omit<MediaArticle, 'id' | 'createdAt' | 'updatedAt'>;
