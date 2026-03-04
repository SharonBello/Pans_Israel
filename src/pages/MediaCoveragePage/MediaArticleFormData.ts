// ── Embed URL helpers ─────────────────────────────────────────────────────────

import type { MediaType } from "@/types/mediaArticle";

/** Convert any YouTube URL to embed URL */
export const getYouTubeEmbedUrl = (url: string): string | null => {
    try {
        const u = new URL(url);
        let videoId: string | null = null;

        if (u.hostname.includes('youtu.be')) {
            videoId = u.pathname.slice(1);
        } else if (u.hostname.includes('youtube.com')) {
            videoId = u.searchParams.get('v');
            // Handle /shorts/VIDEO_ID
            if (!videoId && u.pathname.includes('/shorts/')) {
                videoId = u.pathname.split('/shorts/')[1]?.split('/')[0];
            }
        }

        return videoId
            ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
            : null;
    } catch {
        return null;
    }
};

/** Convert any TikTok URL to embed URL */
export const getTikTokEmbedUrl = (url: string): string | null => {
    try {
        const match = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
        return match
            ? `https://www.tiktok.com/embed/v2/${match[1]}`
            : null;
    } catch {
        return null;
    }
};

/** Convert Facebook post/video URL to embed URL */
export const getFacebookEmbedUrl = (url: string): string => {
    return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&show_text=true&width=500`;
};

/** Detect media type from URL automatically */
export const detectMediaType = (url: string): MediaType => {
    try {
        const { hostname } = new URL(url);
        if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return 'youtube';
        if (hostname.includes('facebook.com') || hostname.includes('fb.com')) return 'facebook';
        if (hostname.includes('tiktok.com')) return 'tiktok';
    } catch { /* ignore */ }
    return 'article';
};

export const getCloudinaryThumb = (pdfUrl: string): string =>
    pdfUrl
        .replace('/auto/upload/', '/image/upload/w_400,f_jpg,pg_1/')
        .replace('/raw/upload/', '/image/upload/w_400,f_jpg,pg_1/')
        .replace(/\.pdf$/i, '.jpg');












