export type TestimonialStatus = 'pending' | 'approved' | 'rejected';

export interface Testimonial {
    id: string;

    title: string;
    highlight: string;
    excerpt?: string;
    content: string;
    tags: string[];
    isAnonymous: boolean;
    displayName?: string;

    authorName?: string;
    authorEmail?: string;

    status: TestimonialStatus;

    createdAt?: unknown;
    updatedAt?: unknown;
}

export type NewTestimonialPayload = Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>;

export interface SubmitTestimonialModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (payload: NewTestimonialPayload) => Promise<void>;
}
