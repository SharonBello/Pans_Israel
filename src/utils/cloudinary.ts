/**
 * Cloudinary image delivery: resize and compress images by adding settings to their URL.
 *   https://res.cloudinary.com/<cloud>/image/upload/v123/poster.png
 *   → https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto,c_limit,w_800/v123/poster.png
 * f_auto  = best format the browser supports (AVIF / WebP), q_auto = automatic quality,
 * c_limit = shrink only, never enlarge. Each variant is generated once by Cloudinary, then cached.
 * URLs that aren't Cloudinary uploads (external links, /images/...) are returned unchanged.
 */

const UPLOAD_SEGMENT = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)/;

export const isCloudinaryImage = (url: string): boolean => UPLOAD_SEGMENT.test(url);

/** Optimised version of an image URL; `width` (px) caps its size */
export const cloudinaryImage = (url: string, width?: number): string => {
    if (!isCloudinaryImage(url)) return url;
    const settings = width ? `f_auto,q_auto,c_limit,w_${width}` : 'f_auto,q_auto';
    return url.replace(UPLOAD_SEGMENT, `$1${settings}/`);
};

/**
 * `srcset` with several widths, so each device downloads the smallest image that looks sharp.
 * Returns undefined for non-Cloudinary URLs (the plain `src` is used instead).
 */
export const cloudinarySrcSet = (url: string, widths: number[]): string | undefined =>
    isCloudinaryImage(url) ? widths.map((w) => `${cloudinaryImage(url, w)} ${w}w`).join(', ') : undefined;