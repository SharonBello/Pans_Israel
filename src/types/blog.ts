import { Timestamp } from 'firebase/firestore';

export type ArticleCategory =
    | 'חוויות הורים'
    | 'מידע רפואי'
    | 'תמיכה רגשית'
    | 'זכויות וסיוע'
    | 'חדשות וחקר'
    | 'כללי';

export interface Article {
    id: string;
    title: string;
    summary: string;
    content: string;
    category: ArticleCategory;
    author: string;
    authorRole?: string;
    coverImage?: string;
    tags?: string[];
    featured: boolean;
    published: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    commentCount: number;
}

export type ArticleFormData = Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'commentCount'>;

export interface Comment {
    id: string;
    articleId: string;
    authorName: string;
    content: string;
    createdAt: Timestamp;
}

export type CommentFormData = Pick<Comment, 'authorName' | 'content'>;

export interface ArticleSubmission {
    title: string;
    summary: string;
    content: string;
    category: ArticleCategory;
    author: string;
    authorEmail: string;
    authorRole: string;
    coverImage?: string;
    tags?: string[];
}