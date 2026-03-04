// ==========================================================================
// fetchUrlMetadata.ts — multi-proxy fallback version
// Tries several free CORS proxies in sequence until one works.
// ==========================================================================

export interface UrlMetadata {
    title: string;
    description: string;
    imageUrl: string;
    publication: string;
    datePublished: string;
}

// ── Publication map ──────────────────────────────────────────────────────────
export const PUBLICATION_MAP: Record<string, string> = {
    'www.ynet.co.il': 'ynet',
    'ynet.co.il': 'ynet',
    'www.mako.co.il': 'מאקו',
    'mako.co.il': 'מאקו',
    'www.haaretz.co.il': 'הארץ',
    'haaretz.co.il': 'הארץ',
    'www.israelhayom.co.il': 'ישראל היום',
    'israelhayom.co.il': 'ישראל היום',
    'www.calcalist.co.il': 'כלכליסט',
    'calcalist.co.il': 'כלכליסט',
    'www.walla.co.il': 'וואלה',
    'walla.co.il': 'וואלה',
    'www.kan.org.il': 'כאן',
    'kan.org.il': 'כאן',
    'www.timesofisrael.com': 'Times of Israel',
    'timesofisrael.com': 'Times of Israel',
    'www.jpost.com': 'Jerusalem Post',
    'jpost.com': 'Jerusalem Post',
    'www.npr.org': 'NPR',
    'www.nytimes.com': 'New York Times',
    'www.bbc.com': 'BBC',
    'www.bbc.co.uk': 'BBC',
};

export const getPublication = (url: string): string => {
    try {
        const { hostname } = new URL(url);
        return PUBLICATION_MAP[hostname] || hostname.replace(/^www\./, '');
    } catch {
        return '';
    }
};

export const parseDate = (raw: string): string => {
    if (!raw) return '';
    try {
        const d = new Date(raw);
        if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
    } catch { /* ignore */ }
    return '';
};

export const getMeta = (doc: Document, ...selectors: string[]): string => {
    for (const sel of selectors) {
        const el =
            doc.querySelector(`meta[property="${sel}"]`) ||
            doc.querySelector(`meta[name="${sel}"]`);
        const content = el?.getAttribute('content')?.trim();
        if (content) return content;
    }
    return '';
};

// ── Extract metadata from raw HTML string ────────────────────────────────────
export const extractFromHtml = (html: string, url: string): UrlMetadata => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const rawTitle =
        getMeta(doc, 'og:title', 'twitter:title') ||
        doc.querySelector('title')?.textContent?.trim() ||
        '';

    const title = rawTitle
        .replace(/\s*[-|–—]\s*(ynet|מאקו|הארץ|וואלה|ישראל היום|כלכליסט|כאן|mako|walla|haaretz).*$/i, '')
        .trim() || rawTitle;

    const description =
        getMeta(doc, 'og:description', 'twitter:description', 'description')
            .slice(0, 300);

    const imageUrl =
        getMeta(doc, 'og:image', 'twitter:image', 'twitter:image:src');

    const rawDate = getMeta(
        doc,
        'article:published_time', 'article:modified_time',
        'og:updated_time', 'datePublished', 'pubdate', 'date', 'DC.date',
    );

    return {
        title,
        description,
        imageUrl,
        publication: getPublication(url),
        datePublished: parseDate(rawDate),
    };
};

// ── Proxy strategies ─────────────────────────────────────────────────────────

export const tryAllOrigins = async (url: string): Promise<string> => {
    const res = await fetch(
        `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
        { signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) throw new Error(`allorigins ${res.status}`);
    const json = await res.json();
    if (!json.contents) throw new Error('allorigins empty');
    return json.contents;
};

export const tryCorsproxy = async (url: string): Promise<string> => {
    const res = await fetch(
        `https://corsproxy.io/?${encodeURIComponent(url)}`,
        { signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) throw new Error(`corsproxy.io ${res.status}`);
    return res.text();
};

export const tryThingProxy = async (url: string): Promise<string> => {
    const res = await fetch(
        `https://thingproxy.freeboard.io/fetch/${url}`,
        { signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) throw new Error(`thingproxy ${res.status}`);
    return res.text();
};

// ── URL-only fallback (extracts what we can from the URL itself) ─────────────
export const extractFromUrlOnly = (url: string): Partial<UrlMetadata> => {
    const publication = getPublication(url);
    let datePublished = '';
    const dateMatch = url.match(/(\d{4})[/-](\d{2})[/-](\d{2})/);
    if (dateMatch) {
        datePublished = `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
    }
    return { publication, datePublished };
};

// ── Main exported function ────────────────────────────────────────────────────
export const fetchUrlMetadata = async (url: string): Promise<UrlMetadata> => {
    try { new URL(url); } catch { throw new Error('כתובת URL לא תקינה'); }

    const proxies = [
        { name: 'allorigins', fn: tryAllOrigins },
        { name: 'corsproxy', fn: tryCorsproxy },
        { name: 'thingproxy', fn: tryThingProxy },
    ];

    for (const proxy of proxies) {
        try {
            console.log(`[fetchUrlMetadata] trying ${proxy.name}...`);
            const html = await proxy.fn(url);

            if (!html.includes('<') || html.length < 200) {
                throw new Error('response too short or not HTML');
            }

            const meta = extractFromHtml(html, url);

            if (meta.title) {
                console.log(`[fetchUrlMetadata] success via ${proxy.name}`);
                return meta;
            }

            throw new Error('no title found in response');
        } catch (err: any) {
            console.warn(`[fetchUrlMetadata] ${proxy.name} failed:`, err?.message);
        }
    }

    // All proxies failed — return partial data from URL itself
    const urlFallback = extractFromUrlOnly(url);
    if (urlFallback.publication) {
        return {
            title: '',
            description: '',
            imageUrl: '',
            publication: urlFallback.publication,
            datePublished: urlFallback.datePublished || '',
        };
    }

    throw new Error(
        'לא ניתן לטעון את פרטי הכתבה אוטומטית — האתר חוסם גישה חיצונית. אנא הזינו את הפרטים ידנית.'
    );
};