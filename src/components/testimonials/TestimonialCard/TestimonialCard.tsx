import React, { useCallback } from 'react';
import type { Testimonial } from '@/types/testimonials';
import './TestimonialCard.scss';

export interface TestimonialCardProps {
    testimonial: Testimonial;
    onOpen: (testimonial: Testimonial) => void;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, onOpen }): React.JSX.Element => {
    const handleOpen = useCallback((): void => {
        onOpen(testimonial);
    }, [onOpen, testimonial]);

    const name: string =
        testimonial.displayName?.trim() ||
        (testimonial.isAnonymous ? 'עדות אנונימית' : 'עדות');

    const initials: string = name.trim().length > 0 ? name.trim().charAt(0) : 'ע';

    const tags: string[] = Array.isArray(testimonial.tags) ? testimonial.tags : [];

    return (
        <article
            className="testimonial-card"
            role="button"
            tabIndex={0}
            onClick={handleOpen}
            onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
                if (e.key === 'Enter' || e.key === ' ') handleOpen();
            }}
        >
            <div className="testimonial-card__header">
                <div className="testimonial-card__avatar" aria-hidden="true">{initials}</div>
                <div className="testimonial-card__meta">
                    <div className="testimonial-card__name">{name}</div>
                    {tags.length > 0 && (
                        <div className="testimonial-card__tags">
                            {tags.slice(0, 3).map((tag: string) => (
                                <span key={tag} className="testimonial-card__tag">{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <h3 className="testimonial-card__title">{testimonial.title}</h3>

            <blockquote className="testimonial-card__highlight">
                “{testimonial.highlight}”
            </blockquote>

            <div className="testimonial-card__cta">קראו עוד</div>
        </article>
    );
};

export default TestimonialCard;
