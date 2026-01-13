import React, { useState, useEffect } from 'react';
import type { ProfessionalCategory, RecommendProfessionalFormData } from '../../../types/professionals';
import { MEDICAL_FIELDS, HOLISTIC_FIELDS, THERAPY_FIELDS, LOCATIONS } from '../../../data/professionalsData';
import './RecommendProfessionalModal.scss';

// Close Icon
const CloseIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

// Success Icon
const SuccessIcon: React.FC = () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

interface RecommendProfessionalModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialCategory?: ProfessionalCategory;
}

const RecommendProfessionalModal: React.FC<RecommendProfessionalModalProps> = ({
    isOpen,
    onClose,
    initialCategory = 'medical',
}) => {
    const [formData, setFormData] = useState<RecommendProfessionalFormData>({
        professionalName: '',
        field: '',
        location: '',
        phone: '',
        email: '',
        website: '',
        description: '',
        recommenderName: '',
        recommenderEmail: '',
        category: initialCategory,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof RecommendProfessionalFormData, string>>>({});

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({
                professionalName: '',
                field: '',
                location: '',
                phone: '',
                email: '',
                website: '',
                description: '',
                recommenderName: '',
                recommenderEmail: '',
                category: initialCategory,
            });
            setErrors({});
            setIsSubmitted(false);
        }
    }, [isOpen, initialCategory]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const getFieldsByCategory = () => {
        switch (formData.category) {
            case 'medical':
                return MEDICAL_FIELDS;
            case 'holistic':
                return HOLISTIC_FIELDS;
            case 'therapy':
                return THERAPY_FIELDS;
            default:
                return [];
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when field is edited
        if (errors[name as keyof RecommendProfessionalFormData]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof RecommendProfessionalFormData, string>> = {};

        if (!formData.professionalName.trim()) {
            newErrors.professionalName = 'נא להזין שם';
        }
        if (!formData.field) {
            newErrors.field = 'נא לבחור תחום';
        }
        if (!formData.location) {
            newErrors.location = 'נא לבחור מיקום';
        }
        if (!formData.recommenderName.trim()) {
            newErrors.recommenderName = 'נא להזין את שמך';
        }
        if (!formData.recommenderEmail.trim()) {
            newErrors.recommenderEmail = 'נא להזין אימייל';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.recommenderEmail)) {
            newErrors.recommenderEmail = 'נא להזין אימייל תקין';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        // Simulate API call - replace with actual submission logic
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            console.log('Form submitted:', formData);
            setIsSubmitted(true);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="recommend-modal__backdrop" onClick={handleBackdropClick}>
            <div className="recommend-modal" role="dialog" aria-modal="true">
                <button
                    className="recommend-modal__close"
                    onClick={onClose}
                    aria-label="סגור"
                >
                    <CloseIcon />
                </button>

                {isSubmitted ? (
                    <div className="recommend-modal__success">
                        <div className="recommend-modal__success-icon">
                            <SuccessIcon />
                        </div>
                        <h2>תודה רבה!</h2>
                        <p>ההמלצה שלך התקבלה בהצלחה. הצוות שלנו יבדוק את הפרטים ויוסיף את איש המקצוע לרשימה.</p>
                        <button className="recommend-modal__done-btn" onClick={onClose}>
                            סגור
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 className="recommend-modal__title">המלצה על איש מקצוע</h2>
                        <p className="recommend-modal__subtitle">
                            מכירים איש מקצוע טוב? שתפו אותנו כדי לעזור להורים אחרים
                        </p>

                        <form onSubmit={handleSubmit} className="recommend-modal__form">
                            {/* Category Selection */}
                            <div className="recommend-modal__field">
                                <label htmlFor="category">קטגוריה *</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="medical">רופאים ואנשי מקצוע רפואיים</option>
                                    <option value="holistic">רפואה משלימה</option>
                                    <option value="therapy">טיפולים</option>
                                </select>
                            </div>

                            {/* Professional Name */}
                            <div className="recommend-modal__field">
                                <label htmlFor="professionalName">שם איש המקצוע *</label>
                                <input
                                    type="text"
                                    id="professionalName"
                                    name="professionalName"
                                    value={formData.professionalName}
                                    onChange={handleChange}
                                    placeholder='לדוגמה: ד"ר ישראל ישראלי'
                                    className={errors.professionalName ? 'error' : ''}
                                />
                                {errors.professionalName && (
                                    <span className="recommend-modal__error">{errors.professionalName}</span>
                                )}
                            </div>

                            {/* Field */}
                            <div className="recommend-modal__field">
                                <label htmlFor="field">תחום התמחות *</label>
                                <select
                                    id="field"
                                    name="field"
                                    value={formData.field}
                                    onChange={handleChange}
                                    className={errors.field ? 'error' : ''}
                                >
                                    <option value="">בחירת תחום</option>
                                    {getFieldsByCategory().map((f) => (
                                        <option key={f.key} value={f.key}>
                                            {f.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.field && (
                                    <span className="recommend-modal__error">{errors.field}</span>
                                )}
                            </div>

                            {/* Location */}
                            <div className="recommend-modal__field">
                                <label htmlFor="location">מיקום *</label>
                                <select
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className={errors.location ? 'error' : ''}
                                >
                                    <option value="">בחירת מיקום</option>
                                    {LOCATIONS.map((loc) => (
                                        <option key={loc.key} value={loc.key}>
                                            {loc.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.location && (
                                    <span className="recommend-modal__error">{errors.location}</span>
                                )}
                            </div>

                            {/* Contact Info Row */}
                            <div className="recommend-modal__row">
                                <div className="recommend-modal__field">
                                    <label htmlFor="phone">טלפון</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="050-1234567"
                                        dir="ltr"
                                    />
                                </div>
                                <div className="recommend-modal__field">
                                    <label htmlFor="email">אימייל</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="example@email.com"
                                        dir="ltr"
                                    />
                                </div>
                            </div>

                            {/* Website */}
                            <div className="recommend-modal__field">
                                <label htmlFor="website">אתר אינטרנט</label>
                                <input
                                    type="url"
                                    id="website"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    placeholder="https://example.com"
                                    dir="ltr"
                                />
                            </div>

                            {/* Description */}
                            <div className="recommend-modal__field">
                                <label htmlFor="description">מילים על איש המקצוע</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="למה אתם ממליצים? מה הניסיון שלכם?"
                                    rows={3}
                                />
                            </div>

                            <hr className="recommend-modal__divider" />

                            <h3 className="recommend-modal__section-title">הפרטים שלך</h3>

                            {/* Recommender Info Row */}
                            <div className="recommend-modal__row">
                                <div className="recommend-modal__field">
                                    <label htmlFor="recommenderName">שם מלא *</label>
                                    <input
                                        type="text"
                                        id="recommenderName"
                                        name="recommenderName"
                                        value={formData.recommenderName}
                                        onChange={handleChange}
                                        placeholder="השם שלך"
                                        className={errors.recommenderName ? 'error' : ''}
                                    />
                                    {errors.recommenderName && (
                                        <span className="recommend-modal__error">{errors.recommenderName}</span>
                                    )}
                                </div>
                                <div className="recommend-modal__field">
                                    <label htmlFor="recommenderEmail">אימייל *</label>
                                    <input
                                        type="email"
                                        id="recommenderEmail"
                                        name="recommenderEmail"
                                        value={formData.recommenderEmail}
                                        onChange={handleChange}
                                        placeholder="email@example.com"
                                        dir="ltr"
                                        className={errors.recommenderEmail ? 'error' : ''}
                                    />
                                    {errors.recommenderEmail && (
                                        <span className="recommend-modal__error">{errors.recommenderEmail}</span>
                                    )}
                                </div>
                            </div>

                            <p className="recommend-modal__note">
                                * הפרטים שלך לא יפורסמו ומשמשים ליצירת קשר במידת הצורך
                            </p>

                            <button
                                type="submit"
                                className="recommend-modal__submit-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'שולח...' : 'שליחת המלצה'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default RecommendProfessionalModal;