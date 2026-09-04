import {
    collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc,
    query, where, orderBy, increment, Timestamp, serverTimestamp,
} from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import { db } from '../config/firebase';
import type { Article, ArticleFormData, ArticleSubmission, Comment, CommentFormData } from '../types/blog';

const ARTICLES_COL = 'blog_articles';
const COMMENTS_COL = 'blog_comments';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? '';
const EMAILJS_ARTICLE_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_ARTICLE_TEMPLATE_ID ?? '';

// ── Public reads ─────────────────────────────────────────────────────────────
export const getPublishedArticles = async (): Promise<Article[]> => {
    const q = query(
        collection(db, ARTICLES_COL),
        where('published', '==', true),
        orderBy('createdAt', 'desc'),
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Article));
};

export const getArticleById = async (id: string): Promise<Article | null> => {
    const snap = await getDoc(doc(db, ARTICLES_COL, id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Article;
};

export const getFeaturedArticle = async (): Promise<Article | null> => {
    const snap = await getDocs(collection(db, ARTICLES_COL));
    const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as Article));
    const featured = all
        .filter(a => a.published && a.featured)
        .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
    return featured[0] ?? null;
};

// ── Writes used by the app ───────────────────────────────────────────────────
export const createArticle = async (data: ArticleFormData): Promise<string> => {
    const ref = await addDoc(collection(db, ARTICLES_COL), {
        ...data,
        commentCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return ref.id;
};

export const updateArticle = async (id: string, data: Partial<ArticleFormData>): Promise<void> => {
    await updateDoc(doc(db, ARTICLES_COL, id), {
        ...data,
        updatedAt: serverTimestamp(),
    });
};

// ── Comments ─────────────────────────────────────────────────────────────────
export const getComments = async (articleId: string): Promise<Comment[]> => {
    const q = query(
        collection(db, COMMENTS_COL),
        where('articleId', '==', articleId),
        orderBy('createdAt', 'asc'),
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Comment));
};

export const submitComment = async (
    articleId: string,
    articleTitle: string,
    data: CommentFormData,
): Promise<Comment> => {
    try {
        const ref = await addDoc(collection(db, COMMENTS_COL), {
            articleId,
            ...data,
            createdAt: serverTimestamp(),
        });

        // counter — fire and forget
        updateDoc(doc(db, ARTICLES_COL, articleId), {
            commentCount: increment(1),
        }).catch(err => console.warn('Counter update failed:', err));

        // email — fire and forget
        if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
            emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    article_title: articleTitle,
                    article_url: `${window.location.origin}/community/articles/${articleId}`,
                    commenter_name: data.authorName,
                    comment_text: data.content,
                },
                EMAILJS_PUBLIC_KEY,
            ).catch(err => console.warn('EmailJS notification failed:', err));
        }

        return { id: ref.id, articleId, ...data, createdAt: Timestamp.now() };
    } catch (err) {
        console.error('submitComment error:', err);
        throw err;
    }
};

// ── Public submission (lands unpublished) ────────────────────────────────────
export const submitArticleForReview = async (data: ArticleSubmission): Promise<string> => {
    try {
        const ref = await addDoc(collection(db, ARTICLES_COL), {
            ...data,
            featured: false,
            published: false,
            commentCount: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        if (EMAILJS_SERVICE_ID && EMAILJS_ARTICLE_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
            emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_ARTICLE_TEMPLATE_ID,
                {
                    article_title: data.title,
                    article_content: data.content,
                    author_name: data.author,
                    author_email: data.authorEmail,
                },
                EMAILJS_PUBLIC_KEY,
            ).catch(err => console.warn('EmailJS failed:', err));
        }

        return ref.id;
    } catch (err) {
        console.error('submitArticleForReview error:', err);
        throw err;
    }
};

// ── Admin ────────────────────────────────────────────────────────────────────
export const getAllArticlesAdmin = async (): Promise<Article[]> => {
    const q = query(collection(db, ARTICLES_COL), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Article));
};

export const setArticleFlags = async (
    id: string,
    flags: Partial<Pick<Article, 'published' | 'featured'>>,
): Promise<void> => {
    await updateDoc(doc(db, ARTICLES_COL, id), { ...flags, updatedAt: serverTimestamp() });
};

export const deleteArticle = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, ARTICLES_COL, id));
};