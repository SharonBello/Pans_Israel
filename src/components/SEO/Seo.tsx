import type { JSX } from 'react';
import { Helmet } from 'react-helmet-async';

type SeoProps = {
    title: string;
    description: string;
    path: string;
    noIndex?: boolean;
    imageUrl?: string;
};

const SITE_URL: string = 'https://panspandasil.org';
const SITE_NAME: string = 'פאנס/פאנדס ישראל';

export function Seo({
    title,
    description,
    path,
    noIndex = false,
    imageUrl = `${SITE_URL}/og-image.jpg`,
}: SeoProps): JSX.Element {
    const canonicalUrl: string = `${SITE_URL}${path}`;

    return (
        <Helmet>
            <title>{title}</title>

            <meta name="description" content={description} />

            {noIndex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta
                    name="robots"
                    content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
                />
            )}

            <link rel="canonical" href={canonicalUrl} />

            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:locale" content="he_IL" />
            <meta property="og:image" content={imageUrl} />

            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:url" content={canonicalUrl} />
            <meta property="twitter:image" content={imageUrl} />
        </Helmet>
    );
}