import React, { useEffect } from 'react';
import { CloseIcon } from '@/components/icons/Icons';
import type { Testimonial } from '@/types/testimonials';
import './TestimonialReadModal.scss';

export interface TestimonialReadModalProps {
    isOpen: boolean;
    testimonial: Testimonial | null;
    onClose: () => void;
}

const TestimonialReadModal: React.FC<TestimonialReadModalProps> = ({
    isOpen,
    testimonial,
    onClose,
}): React.JSX.Element | null => {
    useEffect((): (() => void) => {
        const onKeyDown = (e: KeyboardEvent): void => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) window.addEventListener('keydown', onKeyDown);

        return (): void => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !testimonial) return null;

    const displayName: string =
        testimonial.displayName ||
        (testimonial.isAnonymous ? 'עדות אנונימית' : testimonial.authorName || 'עדות');

    const tags: string[] = Array.isArray(testimonial.tags) ? testimonial.tags : [];

    return (
        <div className="trm-backdrop" onClick={onClose} role="presentation">
            <div
                className="trm"
                onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Testimonial"
            >
                <button className="trm__close" type="button" onClick={onClose} aria-label="Close">
                    <CloseIcon />
                </button>

                <div className="trm__header">
                    <div className="trm__meta">
                        <div className="trm__name">{displayName}</div>
                        {tags.length > 0 && (
                            <div className="trm__tags">
                                {tags.slice(0, 8).map((tag: string) => (
                                    <span key={tag} className="trm__tag">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <h2 className="trm__title">{testimonial.title}</h2>

                    {testimonial.highlight && (
                        <blockquote className="trm__highlight">“{testimonial.highlight}”</blockquote>
                    )}
                </div>

                <div className="trm__content">
                    {testimonial.content
                        .split('\n')
                        .map((line: string) => line.trim())
                        .filter((line: string) => line.length > 0)
                        .map((line: string, idx: number) => (
                            <p key={`${idx}-${line.slice(0, 12)}`} className="trm__p">
                                {line}
                            </p>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default TestimonialReadModal;
