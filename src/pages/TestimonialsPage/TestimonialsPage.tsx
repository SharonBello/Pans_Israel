import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { PlusIcon, SearchIcon } from '@/components/icons/Icons';
import TestimonialCard from '@/components/testimonials/TestimonialCard/TestimonialCard';
import SubmitTestimonialModal from '@/components/testimonials/SubmitTestimonialModal/SubmitTestimonialModal';
import TestimonialReadModal from '@/components/testimonials/TestimonialReadModal/TestimonialReadModal';
import type { NewTestimonialPayload, Testimonial } from '@/types/testimonials';
import { subscribeToTestimonials, addTestimonial } from '@/services/testimonialsService';
import { RecordVoiceOver as TestimonialsIcon } from '@mui/icons-material';
import type { Unsubscribe } from 'firebase/firestore';
import './TestimonialsPage.scss';
import SupportTabs from '@/components/Support/SupportTabs/SupportTabs';

const TestimonialsPage: React.FC = (): React.JSX.Element => {
  const [isSubmitOpen, setIsSubmitOpen] = useState<boolean>(false);
  const [active, setActive] = useState<Testimonial | null>(null);
  const [search, setSearch] = useState<string>('');
  const [items, setItems] = useState<Testimonial[]>([]);
  const [error, setError] = useState<string>('');

  useEffect((): (() => void) => {
    setError('');
    const unsubscribe: Unsubscribe = subscribeToTestimonials(
      (next: Testimonial[]): void => setItems(next),
      (err: Error): void => setError(err.message)
    );

    return (): void => unsubscribe();
  }, []);

  const filtered: Testimonial[] = useMemo((): Testimonial[] => {
    const q: string = search.trim().toLowerCase();
    if (!q) return items;

    return items.filter((t: Testimonial) => {
      const haystack: string = [
        t.title,
        t.highlight,
        t.content,
        (t.tags || []).join(' '),
        t.displayName || '',
      ].join(' ').toLowerCase();

      return haystack.includes(q);
    });
  }, [items, search]);

  const handleOpen = useCallback((t: Testimonial): void => setActive(t), []);
  const handleCloseRead = useCallback((): void => setActive(null), []);

  const handleSubmit = useCallback(async (payload: NewTestimonialPayload): Promise<void> => {
    await addTestimonial(payload);
  }, []);

  return (
    <div className="testimonials-page">
      <div className="testimonials-container">
        <header className="testimonials-hero">
          <div className="testimonials-hero__text">

            {/* Icon box — matches SupportTabs tab 3 (RecordVoiceOver) */}
            <div className="testimonials-hero__icon-wrap">
              <TestimonialsIcon />
            </div>

            {/* Kicker — was commented out before, now active as label */}
            <div className="testimonials-hero__kicker">תמיכה וקהילה</div>

            {/* Title — unchanged */}
            <h1 className="testimonials-hero__title">עדויות מהקהילה</h1>

            {/* Subtitle — unchanged */}
            <p className="testimonials-hero__subtitle">
              עדויות אמיתיות מהקהילה. כל עדות נבדקת לפני פרסום כדי לשמור על פרטיות ולהסיר פרטים מזהים.
            </p>
          </div>
        </header>


        <SupportTabs />

        <div className="testimonials-disclaimer">
          <strong>הערה:</strong> העדויות הן אישיות ואינן מהוות ייעוץ רפואי. אם יש חשש לסיכון מיידי – פנו לעזרה מקצועית.
        </div>

        <section className="testimonials-controls">
          <div className="testimonials-search">
            <SearchIcon />
            <input
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              placeholder="חיפוש לפי מילים, תגיות, כותרת…"
            />
          </div>

          <div className="testimonials-count">
            {filtered.length === 0 ? 'אין תוצאות' : `${filtered.length} עדויות`}
          </div>
        </section>

        {error && (
          <div className="testimonials-error">
            שגיאה בטעינת העדויות: {error}
          </div>
        )}

        {filtered.length > 0 ? (
          <section className="testimonials-grid">
            {filtered.map((t: Testimonial) => (
              <TestimonialCard key={t.id} testimonial={t} onOpen={handleOpen} />
            ))}
          </section>
        ) : (
          <section className="testimonials-empty">
            <div className="testimonials-empty__icon">🫶</div>
            <h2>עדיין אין עדויות להצגה</h2>
            <p>אפשר להתחיל עם עדות אחת מאושרת — או לשלוח עדות חדשה.</p>
            <button
              type="button"
              className="testimonials-empty__btn"
              onClick={() => setIsSubmitOpen(true)}
            >
              <PlusIcon />
              <span>שליחת עדות</span>
            </button>
          </section>
        )}
      </div>

      <SubmitTestimonialModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onSubmit={handleSubmit}
      />

      <TestimonialReadModal
        isOpen={Boolean(active)}
        testimonial={active}
        onClose={handleCloseRead}
      />
    </div>
  );
};

export default TestimonialsPage;
