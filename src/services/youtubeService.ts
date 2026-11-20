import type { YouTubeVideo } from '@/types/youtube';

/**
 * Latest videos from the NGO's YouTube channel (YouTube Data API v3).
 * Two requests per uncached visit (≈2 of the 10,000 free daily units):
 *   1. the channel's uploads playlist → the newest video ids
 *   2. those videos' details → title, thumbnail, length and shape, to skip Shorts
 * The result is cached for the visitor's session.
 */

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined;
const API_BASE = 'https://www.googleapis.com/youtube/v3';

export const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@PansPandasIsrael';
const CHANNEL_ID = 'UCCXJdKqJ9a-KphpyG39rgcw';
/** Every channel has an "uploads" playlist: its id is the channel id with UC → UU */
const UPLOADS_PLAYLIST_ID = `UU${CHANNEL_ID.slice(2)}`;

/** How many recent uploads to check, so a run of Shorts can't leave the section empty */
const CANDIDATE_COUNT = 15;
/** YouTube Shorts are at most 3 minutes long */
const SHORT_MAX_SECONDS = 180;

const CACHE_KEY = 'yt-latest:v1';
const CACHE_TTL_MS = 30 * 60 * 1000;

// ── API response shapes (only the fields used here) ──────────────────────────

interface PlaylistItemsResponse {
    items?: { contentDetails?: { videoId?: string } }[];
}

interface ThumbnailSet {
    maxres?: { url: string };
    standard?: { url: string };
    high?: { url: string };
    medium?: { url: string };
    default?: { url: string };
}

interface VideoResource {
    id: string;
    snippet: {
        title: string;
        publishedAt: string;
        liveBroadcastContent?: string; // 'none' | 'live' | 'upcoming'
        thumbnails?: ThumbnailSet;
    };
    contentDetails?: { duration?: string };
    player?: { embedWidth?: string | number; embedHeight?: string | number };
}

interface VideosResponse {
    items?: VideoResource[];
}

// ── helpers ──────────────────────────────────────────────────────────────────

/** ISO 8601 duration → seconds: 'PT1H2M3S' → 3723, 'P0D' → 0 */
export const parseIsoDuration = (iso = ''): number => {
    const m = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/.exec(iso);
    if (!m) return 0;
    const [days, hours, minutes, seconds] = m.slice(1).map((v) => Number(v ?? 0));
    return ((days * 24 + hours) * 60 + minutes) * 60 + seconds;
};

/** 3723 → '1:02:03', 95 → '1:35' */
export const formatDuration = (total: number): string => {
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
};

/**
 * There's no "is a Short" field in the API, so: a Short is 3 minutes or less AND vertical.
 * (If YouTube doesn't report the shape, length alone decides.)
 * Recorded live webinars and short horizontal promos are kept.
 */
const isShort = (v: VideoResource): boolean => {
    const seconds = parseIsoDuration(v.contentDetails?.duration);
    if (seconds === 0 || seconds > SHORT_MAX_SECONDS) return false;
    const width = Number(v.player?.embedWidth);
    const height = Number(v.player?.embedHeight);
    const shapeKnown = width > 0 && height > 0;
    return shapeKnown ? height > width : true;
};

const bestThumbnail = (t: ThumbnailSet | undefined, id: string): string =>
    t?.maxres?.url ?? t?.standard?.url ?? t?.high?.url ?? t?.medium?.url ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

const getJson = async <T,>(url: string): Promise<T> => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`YouTube API ${res.status}`);
    return (await res.json()) as T;
};

// ── session cache (best effort: storage can be blocked or full) ──────────────

const readCache = (): YouTubeVideo[] | null => {
    try {
        const raw = sessionStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const { savedAt, videos } = JSON.parse(raw) as { savedAt: number; videos: YouTubeVideo[] };
        return Date.now() - savedAt < CACHE_TTL_MS && Array.isArray(videos) ? videos : null;
    } catch {
        return null;
    }
};

const writeCache = (videos: YouTubeVideo[]): void => {
    try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), videos }));
    } catch {
        /* ignore */
    }
};

// ── public ───────────────────────────────────────────────────────────────────

const fetchRecentVideos = async (): Promise<YouTubeVideo[]> => {
    const playlist = await getJson<PlaylistItemsResponse>(
        `${API_BASE}/playlistItems?part=contentDetails&maxResults=${CANDIDATE_COUNT}` +
        `&playlistId=${UPLOADS_PLAYLIST_ID}&key=${API_KEY}`,
    );
    const ids = (playlist.items ?? [])
        .map((item) => item.contentDetails?.videoId)
        .filter((id): id is string => Boolean(id));
    if (ids.length === 0) return [];

    const details = await getJson<VideosResponse>(
        `${API_BASE}/videos?part=snippet,contentDetails,player&maxWidth=480` +
        `&id=${ids.join(',')}&key=${API_KEY}`,
    );

    return (details.items ?? [])
        .filter((v) => (v.snippet.liveBroadcastContent ?? 'none') === 'none' && !isShort(v))
        .sort((a, b) => b.snippet.publishedAt.localeCompare(a.snippet.publishedAt))
        .map((v) => ({
            id: v.id,
            title: v.snippet.title,
            publishedAt: v.snippet.publishedAt,
            thumbnailUrl: bestThumbnail(v.snippet.thumbnails, v.id),
            durationSeconds: parseIsoDuration(v.contentDetails?.duration),
        }));
};

/** Shared by every section on the page, so two sections never fetch twice */
let pending: Promise<YouTubeVideo[]> | null = null;

/** The channel's newest regular videos (no Shorts, no live or scheduled streams) */
export const getLatestVideos = async (count = 2): Promise<YouTubeVideo[]> => {
    if (!API_KEY) {
        console.warn('VITE_YOUTUBE_API_KEY is not set — the latest-videos section is hidden.');
        return [];
    }
    const cached = readCache();
    if (cached) return cached.slice(0, count);

    pending ??= fetchRecentVideos()
        .then((videos) => {
            writeCache(videos);
            return videos;
        })
        .finally(() => {
            pending = null;
        });
    return (await pending).slice(0, count);
};