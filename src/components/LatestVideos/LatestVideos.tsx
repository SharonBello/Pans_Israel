import React, { useEffect, useState } from 'react';
import { FaYoutube } from 'react-icons/fa';
import { FiArrowLeft, FiExternalLink, FiPlay } from 'react-icons/fi';
import { getLatestVideos, formatDuration, YOUTUBE_CHANNEL_URL } from '@/services/youtubeService';
import type { YouTubeVideo } from '@/types/youtube';
import './LatestVideos.scss';

const VIDEO_COUNT = 2;

const formatDate = (iso: string): string =>
    new Date(iso).toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });

// ── one video: thumbnail first, the YouTube player loads only on click ──────

const VideoCard: React.FC<{ video: YouTubeVideo }> = ({ video }) => {
    const [playing, setPlaying] = useState(false);

    return (
        <article className="latest-videos__card">
            <div className="latest-videos__media">
                {playing ? (
                    <iframe
                        className="latest-videos__frame"
                        src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    />
                ) : (
                    <button
                        type="button"
                        className="latest-videos__poster"
                        onClick={() => setPlaying(true)}
                        aria-label={`הפעלת הסרטון: ${video.title}`}
                    >
                        <img src={video.thumbnailUrl} alt="" loading="lazy" decoding="async" />
                        <span className="latest-videos__play" aria-hidden="true"><FiPlay /></span>
                        {video.durationSeconds > 0 && (
                            <span className="latest-videos__duration" dir="ltr">
                                {formatDuration(video.durationSeconds)}
                            </span>
                        )}
                    </button>
                )}
            </div>

            <div className="latest-videos__body">
                <h3 className="latest-videos__title" dir="auto">{video.title}</h3>
                <div className="latest-videos__meta">
                    <time dateTime={video.publishedAt}>{formatDate(video.publishedAt)}</time>
                    <a
                        href={`https://www.youtube.com/watch?v=${video.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="latest-videos__watch"
                    >
                        ביוטיוב <FiExternalLink aria-hidden="true" />
                    </a>
                </div>
            </div>
        </article>
    );
};

// ── section ──────────────────────────────────────────────────────────────────

/** The channel's newest videos — used on the home page and the videos page */
const LatestVideos: React.FC = () => {
    const [videos, setVideos] = useState<YouTubeVideo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        getLatestVideos(VIDEO_COUNT)
            .then((data) => { if (!cancelled) setVideos(data); })
            .catch((err) => console.error('getLatestVideos failed:', err))
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    // No key, API error or no videos → no section at all
    if (!loading && videos.length === 0) return null;

    return (
        <section className="latest-videos" dir="rtl" aria-labelledby="latest-videos-title" aria-busy={loading}>
            <div className="latest-videos__header">
                <div className="latest-videos__heading">
                    <span className="latest-videos__icon" aria-hidden="true"><FaYoutube /></span>
                    <div>
                        <h2 id="latest-videos-title" className="latest-videos__section-title">הסרטונים האחרונים שלנו</h2>
                        <p className="latest-videos__subtitle">מערוץ היוטיוב של פאנס/פאנדס ישראל</p>
                    </div>
                </div>
                <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="latest-videos__channel">
                    לערוץ היוטיוב <FiArrowLeft aria-hidden="true" />
                </a>
            </div>

            <div className="latest-videos__grid">
                {loading
                    ? Array.from({ length: VIDEO_COUNT }, (_, i) => (
                        <div key={i} className="latest-videos__card latest-videos__card--skeleton" aria-hidden="true">
                            <div className="latest-videos__media" />
                            <div className="latest-videos__body">
                                <span className="latest-videos__bar" />
                                <span className="latest-videos__bar latest-videos__bar--short" />
                            </div>
                        </div>
                    ))
                    : videos.map((v) => <VideoCard key={v.id} video={v} />)}
            </div>
        </section>
    );
};

export default LatestVideos;