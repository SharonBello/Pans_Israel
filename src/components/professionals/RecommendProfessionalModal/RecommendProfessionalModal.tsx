import { CloseIcon } from "@/components/icons/Icons";
import { HOLISTIC_FIELDS, LOCATIONS, MEDICAL_FIELDS, THERAPY_FIELDS } from "@/data/professionalsData";
import type { NewProfessionalPayload, RecommendModalProps } from "@/types/professionals";
// import type { ProfessionalField, Location } from '../../types/professionals';
import { useState } from "react";


const RecommendModal: React.FC<RecommendModalProps> = ({ isOpen, onClose, category, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        field: '',
        location: '',
        phone: '',
        email: '',
        address: '',
        website: '',
        description: '',
        recommenderName: '',
        recommenderEmail: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const fields = category === 'medical' ? MEDICAL_FIELDS : category === 'holistic' ? HOLISTIC_FIELDS : THERAPY_FIELDS;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Find the field label from key
        const selectedField = fields.find(f => f.key === formData.field);
        const selectedLocation = LOCATIONS.find(l => l.key === formData.location);

        // Create new professional object
        const payload: NewProfessionalPayload = {
            name: formData.name,
            field: selectedField?.label || formData.field,
            fieldKey: formData.field,
            location: selectedLocation?.label || formData.location,
            locationKey: formData.location,
            category,
            acceptingNewPatients: true,

            ...(formData.phone ? { phone: formData.phone } : {}),
            ...(formData.email ? { email: formData.email } : {}),
            ...(formData.address ? { address: formData.address } : {}),
            ...(formData.website ? { website: formData.website } : {}),
            ...(formData.description ? { description: formData.description } : {}),
        };

        await onSubmit(payload);
        setSubmitted(true);
    };

    const handleClose = () => {
        setFormData({
            name: '',
            field: '',
            location: '',
            phone: '',
            email: '',
            address: '',
            website: '',
            description: '',
            recommenderName: '',
            recommenderEmail: '',
        });
        setSubmitted(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={handleClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal__close" onClick={handleClose}><CloseIcon /></button>

                {submitted ? (
                    <div className="modal__success">
                        <div className="modal__success-icon">✓</div>
                        <h2>תודה רבה!</h2>
                        <p>ההמלצה נוספה בהצלחה לרשימה</p>
                        <button onClick={handleClose} className="modal__btn">סגור</button>
                    </div>
                ) : (
                    <>
                        <h2 className="modal__title">המלצה על איש מקצוע</h2>
                        <p className="modal__subtitle">עזרו להורים אחרים למצוא אנשי מקצוע טובים</p>
                        <form onSubmit={handleSubmit} className="modal__form">
                            <div className="modal__field">
                                <label>שם איש המקצוע *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder='לדוגמה: ד"ר ישראל ישראלי'
                                />
                            </div>
                            <div className="modal__row">
                                <div className="modal__field">
                                    <label>תחום *</label>
                                    <select
                                        required
                                        value={formData.field}
                                        onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                                    >
                                        <option value="">בחירה</option>
                                        {fields.map((f) => (
                                            <option key={f.key} value={f.key}>{f.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="modal__field">
                                    <label>מיקום *</label>
                                    <select
                                        required
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    >
                                        <option value="">בחירה</option>
                                        {LOCATIONS.map((l) => (
                                            <option key={l.key} value={l.key}>{l.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="modal__field">
                                <label>כתובת מלאה</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder='לדוגמה: רח׳ הרצל 50, תל אביב'
                                />
                            </div>
                            <div className="modal__row">
                                <div className="modal__field">
                                    <label>טלפון</label>
                                    <input
                                        type="tel"
                                        dir="ltr"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="050-1234567"
                                    />
                                </div>
                                <div className="modal__field">
                                    <label>אימייל</label>
                                    <input
                                        type="email"
                                        dir="ltr"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>
                            <div className="modal__field">
                                <label>אתר אינטרנט</label>
                                <input
                                    type="url"
                                    dir="ltr"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    placeholder="https://example.com"
                                />
                            </div>
                            <div className="modal__field">
                                <label>למה ממליצים?</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="ספרו על הניסיון שלכם..."
                                    rows={3}
                                />
                            </div>
                            <hr />
                            <h3>הפרטים שלך</h3>
                            <div className="modal__row">
                                <div className="modal__field">
                                    <label>שם *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.recommenderName}
                                        onChange={(e) => setFormData({ ...formData, recommenderName: e.target.value })}
                                    />
                                </div>
                                <div className="modal__field">
                                    <label>אימייל *</label>
                                    <input
                                        type="email"
                                        required
                                        dir="ltr"
                                        value={formData.recommenderEmail}
                                        onChange={(e) => setFormData({ ...formData, recommenderEmail: e.target.value })}
                                    />
                                </div>
                            </div>
                            <p className="modal__note">* הפרטים שלך לא יפורסמו</p>
                            <button type="submit" className="modal__submit">שליחת המלצה</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default RecommendModal;