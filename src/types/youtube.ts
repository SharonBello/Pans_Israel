/** A video from the NGO's YouTube channel, as shown on the site */
export interface YouTubeVideo {
    id: string;
    title: string;
    publishedAt: string;     // ISO date-time
    thumbnailUrl: string;
    durationSeconds: number;
}