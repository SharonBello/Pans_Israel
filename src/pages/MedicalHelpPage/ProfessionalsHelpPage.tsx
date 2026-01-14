// pages/ProfessionalsHelpPage/ProfessionalsHelpPage.tsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { ProfessionalCategory, ProfessionalFilters, Professional, ProfessionalField, Location } from '../../types/professionals';
import {
  MEDICAL_FIELDS,
  HOLISTIC_FIELDS,
  THERAPY_FIELDS,
  LOCATIONS,
  filterProfessionals,
} from '../../data/professionalsData';
import './ProfessionalsHelpPage.scss';
import { getAllProfessionals, addProfessional, subscribeToProfessionals } from '../../services/professionalsService';
import type { Unsubscribe } from 'firebase/firestore';

// ============ ICONS ============
const MedicalIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const HolisticIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a7 7 0 0 0 0 14 7 7 0 0 0 0-14" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
  </svg>
);

const TherapyIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const WebIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const NavigationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ============ HELPER FUNCTIONS ============
const generateGoogleMapsLink = (address: string, location: string): string => {
  const query = encodeURIComponent(`${address}, ${location}, Israel`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
};

const generateWazeLink = (address: string, location: string): string => {
  const query = encodeURIComponent(`${address}, ${location}, Israel`);
  return `https://waze.com/ul?q=${query}&navigate=yes`;
};

// ============ PROFESSIONAL CARD ============
interface ProfessionalCardProps {
  professional: Professional;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional }) => {
  const { name, field, location, phone, email, website, address, description, acceptingNewPatients } = professional;

  return (
    <article className="pro-card">
      <div className="pro-card__header">
        <div className="pro-card__avatar">{name.charAt(0)}</div>
        <div className="pro-card__info">
          <h3 className="pro-card__name">{name}</h3>
          <span className="pro-card__field">{field}</span>
        </div>
      </div>

      <div className="pro-card__location">
        <LocationIcon />
        <span>{location}</span>
        {address && (
          <>
            <span className="pro-card__address-separator">•</span>
            <span className="pro-card__address-text">{address}</span>
          </>
        )}
      </div>

      {/* Navigation Links for Address */}
      {address && (
        <div className="pro-card__navigation">
          <a
            href={generateGoogleMapsLink(address, location)}
            target="_blank"
            rel="noopener noreferrer"
            className="pro-card__nav-link pro-card__nav-link--google"
          >
            <NavigationIcon />
            <span>Google Maps</span>
          </a>
          <a
            href={generateWazeLink(address, location)}
            target="_blank"
            rel="noopener noreferrer"
            className="pro-card__nav-link pro-card__nav-link--waze"
          >
            <NavigationIcon />
            <span>Waze</span>
          </a>
        </div>
      )}

      {description && <p className="pro-card__description">{description}</p>}

      {acceptingNewPatients !== undefined && (
        <div className={`pro-card__status ${acceptingNewPatients ? 'available' : 'unavailable'}`}>
          {acceptingNewPatients ? <CheckIcon /> : <XIcon />}
          <span>{acceptingNewPatients ? 'מקבל/ת מטופלים חדשים' : 'לא מקבל/ת כרגע'}</span>
        </div>
      )}

      <div className="pro-card__actions">
        {phone && (
          <a href={`tel:${phone}`} className="pro-card__btn pro-card__btn--phone">
            <PhoneIcon />
            <span>{phone}</span>
          </a>
        )}
        {email && (
          <a href={`mailto:${email}`} className="pro-card__btn pro-card__btn--email">
            <EmailIcon />
            <span>אימייל</span>
          </a>
        )}
        {website && (
          <a href={website} target="_blank" rel="noopener noreferrer" className="pro-card__btn pro-card__btn--web">
            <WebIcon />
            <span>אתר</span>
          </a>
        )}
      </div>
    </article>
  );
};

// ============ FILTER BAR ============
interface FilterBarProps {
  fields: ProfessionalField[];
  locations: Location[];
  selectedField: string;
  selectedLocation: string;
  searchQuery: string;
  onFieldChange: (field: string) => void;
  onLocationChange: (location: string) => void;
  onSearchChange: (query: string) => void;
  resultsCount: number;
}

const FilterBar: React.FC<FilterBarProps> = ({
  fields, locations, selectedField, selectedLocation, searchQuery,
  onFieldChange, onLocationChange, onSearchChange, resultsCount,
}) => {
  return (
    <div className="filter-bar">
      <div className="filter-bar__search">
        <SearchIcon />
        <input
          type="text"
          placeholder="חיפוש לפי שם..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="filter-bar__filters">
        <div className="filter-bar__group">
          <label>תחום</label>
          <select value={selectedField} onChange={(e) => onFieldChange(e.target.value)}>
            <option value="all">כל התחומים</option>
            {fields.map((f) => (
              <option key={f.key} value={f.key}>{f.label}</option>
            ))}
          </select>
        </div>
        <div className="filter-bar__group">
          <label>מיקום</label>
          <select value={selectedLocation} onChange={(e) => onLocationChange(e.target.value)}>
            <option value="all">כל המיקומים</option>
            {locations.map((l) => (
              <option key={l.key} value={l.key}>{l.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="filter-bar__count">
        {resultsCount === 0 ? 'לא נמצאו תוצאות' : `${resultsCount} תוצאות`}
      </div>
    </div>
  );
};

// ============ RECOMMEND MODAL ============
interface RecommendModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: ProfessionalCategory;
  onSubmit: (professional: Professional) => Promise<void>;
}

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
    const newProfessional: Professional = {
      id: `user-${Date.now()}`,
      name: formData.name,
      field: selectedField?.label || formData.field,
      fieldKey: formData.field,
      location: selectedLocation?.label || formData.location,
      locationKey: formData.location,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      address: formData.address || undefined,
      website: formData.website || undefined,
      description: formData.description || undefined,
      acceptingNewPatients: true,
      category: category,
    };

    await onSubmit(newProfessional);
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

// ============ MAIN PAGE ============
interface Tab {
  key: ProfessionalCategory;
  label: string;
  icon: React.FC;
  description: string;
}

const TABS: Tab[] = [
  { key: 'medical', label: 'רופאים', icon: MedicalIcon, description: 'רופאים ומומחים רפואיים עם ידע בתסמונות PANDAS/PANS' },
  { key: 'holistic', label: 'רפואה משלימה', icon: HolisticIcon, description: 'נטורופתים, תזונאים ומטפלים ברפואה משלימה' },
  { key: 'therapy', label: 'טיפולים', icon: TherapyIcon, description: 'מרפאים בעיסוק, פסיכולוגים ומטפלים' },
];

const ProfessionalsHelpPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProfessionalCategory>('medical');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for professionals data (combining mock data with user-added)
  const [professionals, setProfessionals] = useState<Professional[]>([]);

  const [filters, setFilters] = useState<Record<ProfessionalCategory, ProfessionalFilters>>({
    medical: { field: 'all', location: 'all', searchQuery: '' },
    holistic: { field: 'all', location: 'all', searchQuery: '' },
    therapy: { field: 'all', location: 'all', searchQuery: '' },
  });

  useEffect((): (() => void) => {
    const unsubscribe: Unsubscribe = subscribeToProfessionals(
      (items: Professional[]): void => {
        setProfessionals(items);
      },
      (error: Error): void => {
        console.error('Firestore subscribe failed:', error);
      }
    );

    return (): void => {
      unsubscribe();
    };
  }, []);


  const handleAddTestProfessional = useCallback(async (): Promise<void> => {
    try {
      const created: Professional = await addProfessional({
        name: 'ד"ר בדיקה',
        field: 'נוירולוגיה',
        fieldKey: 'neurology',
        location: 'תל אביב',
        locationKey: 'tel_aviv',
        phone: '050-0000000',
        email: 'test@example.com',
        address: 'רח׳ בדיקה 1',
        website: 'https://example.com',
        description: 'רשומת בדיקה לצורך פיתוח',
        acceptingNewPatients: true,
        category: 'medical',
      });

    } catch (error) {
      console.error('Failed to create test professional:', error);
    }
  }, []);


  const currentFilters = filters[activeTab];
  const currentFields = useMemo(() => {
    return activeTab === 'medical' ? MEDICAL_FIELDS : activeTab === 'holistic' ? HOLISTIC_FIELDS : THERAPY_FIELDS;
  }, [activeTab]);

  const filteredProfessionals = useMemo(() => {
    return filterProfessionals(professionals, activeTab, currentFilters);
  }, [activeTab, currentFilters, professionals]);

  const handleFieldChange = useCallback((field: string) => {
    setFilters((prev) => ({ ...prev, [activeTab]: { ...prev[activeTab], field } }));
  }, [activeTab]);

  const handleLocationChange = useCallback((location: string) => {
    setFilters((prev) => ({ ...prev, [activeTab]: { ...prev[activeTab], location } }));
  }, [activeTab]);

  const handleSearchChange = useCallback((searchQuery: string) => {
    setFilters((prev) => ({ ...prev, [activeTab]: { ...prev[activeTab], searchQuery } }));
  }, [activeTab]);

  // Handle new professional submission
  const handleAddProfessional = useCallback(async (newProfessional: Professional): Promise<void> => {
    try {
      const { id, ...payload } = newProfessional;
      await addProfessional(payload);
    } catch (error) {
      console.error('Failed to submit professional to Firestore:', error);
    }
  }, []);

  const currentTab = TABS.find((t) => t.key === activeTab)!;

  return (
    <div className="professionals-page">
      {/* Header */}
      <header className="page-header">
        <div className="page-header__content">
          <h1>אנשי מקצוע וגורמי תמיכה</h1>
          <p>מאגר אנשי מקצוע המכירים ומטפלים בתסמונות PANDAS/PANS</p>
          <button className="page-header__btn" onClick={() => setIsModalOpen(true)}>
            <PlusIcon />
            <span>המליצו על איש מקצוע</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="tabs-nav">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              className={`tabs-nav__btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <Icon />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Content */}
      <main className="page-content">
        <div className="section-header">
          <h2>{currentTab.label}</h2>
          <p>{currentTab.description}</p>
          <button className="page-header__btn" onClick={() => void handleAddTestProfessional()} style={{ width: '2rem' }}>
            הוסף רשומת בדיקה
          </button>
        </div>

        <FilterBar
          fields={currentFields}
          locations={LOCATIONS}
          selectedField={currentFilters.field}
          selectedLocation={currentFilters.location}
          searchQuery={currentFilters.searchQuery}
          onFieldChange={handleFieldChange}
          onLocationChange={handleLocationChange}
          onSearchChange={handleSearchChange}
          resultsCount={filteredProfessionals.length}
        />

        {filteredProfessionals.length > 0 ? (
          <div className="cards-grid">
            {filteredProfessionals.map((pro) => (
              <ProfessionalCard key={pro.id} professional={pro} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-state__icon">🔍</span>
            <h3>לא נמצאו תוצאות</h3>
            <p>נסו לשנות את הסינון</p>
          </div>
        )}

        <div className="disclaimer">
          <strong>⚠️ הערה:</strong> המידע נאסף מהקהילה ואינו מהווה המלצה רפואית. יש להתייעץ עם רופא מוסמך.
        </div>
      </main>

      <RecommendModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={activeTab}
        onSubmit={handleAddProfessional}
      />
    </div>
  );
};

export default ProfessionalsHelpPage;