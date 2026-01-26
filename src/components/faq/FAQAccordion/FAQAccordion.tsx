import React, { useCallback, useMemo, useState } from 'react';
import './FAQAccordion.scss';
import type { FAQItem } from '@/data/faqData';

export type FAQAccordionProps = {
    items: FAQItem[];
    title?: string;
    subtitle?: string;
};

const FAQAccordion: React.FC<FAQAccordionProps> = ({
    items,
    title = 'שאלות נפוצות',
}): React.JSX.Element => {
    const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

    const toggle = useCallback((id: string): void => {
        setOpenId((prev: string | null) => (prev === id ? null : id));
    }, []);

    const rendered = useMemo((): React.JSX.Element[] => {
        return items.map((item: FAQItem): React.JSX.Element => {
            const isOpen: boolean = item.id === openId;
            const headerId: string = `faq-header-${item.id}`;
            const panelId: string = `faq-panel-${item.id}`;

            return (
                <div key={item.id} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
                    <button
                        type="button"
                        className="faq-item__btn"
                        onClick={() => toggle(item.id)}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        id={headerId}
                    >
                        <span className="faq-item__q">{item.question}</span>
                        <span className="faq-item__icon" aria-hidden="true">
                            {isOpen ? '−' : '+'}
                        </span>
                    </button>

                    <div
                        id={panelId}
                        role="region"
                        aria-labelledby={headerId}
                        className="faq-item__panel"
                        hidden={!isOpen}
                    >
                        <div className="faq-item__a">
                            {/* Support both string and JSX content */}
                            {typeof item.answer === 'string' ? (
                                <p>{item.answer}</p>
                            ) : (
                                item.answer
                            )}
                        </div>
                    </div>
                </div>
            );
        });
    }, [items, openId, toggle]);

    return (
        <section className="faq" dir="rtl" aria-label="שאלות נפוצות">
            <div className="faq__container">
                <div className="faq__header">
                    <h2 className="faq__title">{title}</h2>
                </div>

                <div className="faq__list">{rendered}</div>
            </div>
        </section>
    );
};

export default FAQAccordion;