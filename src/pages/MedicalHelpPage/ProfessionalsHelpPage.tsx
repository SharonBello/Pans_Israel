// pages/ProfessionalsHelpPage.tsx
// Main page for professional help with tabs for Medical, Holistic, and Therapy

import React, { useState, useMemo, useCallback } from 'react';
import type { ProfessionalCategory, ProfessionalFilters } from '../../types/professionals';
import {
  MOCK_PROFESSIONALS,
  MEDICAL_FIELDS,
  HOLISTIC_FIELDS,
  THERAPY_FIELDS,
  LOCATIONS,
  filterProfessionals,
} from '../../data/professionalsData';
import ProfessionalCard from '../../components/professionals/ProfessionalCard/ProfessionalCard';
import FilterBar from '../../components/professionals/FilterBar/FilterBar';
import RecommendProfessionalModal from '../../components/professionals/RecommendProfessionalModal/RecommendProfessionalModal';
import './ProfessionalsHelpPage.scss';

// Icons for tabs
const MedicalIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const HolisticIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a10 10 0 1 0 10 10" />
    <path d="M12 2v10l6.5-3.5" />
    <path d="M12 12l6.5 3.5" />
  </svg>
);

const TherapyIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const PlusIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// Tab configuration
interface Tab {
  key: ProfessionalCategory;
  label: string;
  icon: React.FC;
  description: string;
}

const TABS: Tab[] = [
  {
    key: 'medical',
    label: 'רופאים',
    icon: MedicalIcon,
    description: 'רופאים ומומחים רפואיים עם ידע בתסמונות PANDAS/PANS',
  },
  {
    key: 'holistic',
    label: 'רפואה משלימה',
    icon: HolisticIcon,
    description: 'נטורופתים, הומאופתים, תזונאים ומטפלים ברפואה משלימה',
  },
  {
    key: 'therapy',
    label: 'טיפולים',
    icon: TherapyIcon,
    description: 'מרפאים בעיסוק, פסיכולוגים, מטפלים ועוד',
  },
];

const ProfessionalsHelpPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProfessionalCategory>('medical');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Separate filter states for each category
  const [filters, setFilters] = useState<Record<ProfessionalCategory, ProfessionalFilters>>({
    medical: { field: 'all', location: 'all', searchQuery: '' },
    holistic: { field: 'all', location: 'all', searchQuery: '' },
    therapy: { field: 'all', location: 'all', searchQuery: '' },
  });

  // Get current filters for active tab
  const currentFilters = filters[activeTab];

  // Get fields for current tab
  const currentFields = useMemo(() => {
    switch (activeTab) {
      case 'medical':
        return MEDICAL_FIELDS;
      case 'holistic':
        return HOLISTIC_FIELDS;
      case 'therapy':
        return THERAPY_FIELDS;
      default:
        return [];
    }
  }, [activeTab]);

  // Filter professionals for current tab
  const filteredProfessionals = useMemo(() => {
    return filterProfessionals(MOCK_PROFESSIONALS, activeTab, currentFilters);
  }, [activeTab, currentFilters]);

  // Handlers for filter changes
  const handleFieldChange = useCallback((field: string) => {
    setFilters((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], field },
    }));
  }, [activeTab]);

  const handleLocationChange = useCallback((location: string) => {
    setFilters((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], location },
    }));
  }, [activeTab]);

  const handleSearchChange = useCallback((searchQuery: string) => {
    setFilters((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], searchQuery },
    }));
  }, [activeTab]);

  const handleClearFilters = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      [activeTab]: { field: 'all', location: 'all', searchQuery: '' },
    }));
  }, [activeTab]);

  // Get current tab info
  const currentTab = TABS.find((tab) => tab.key === activeTab)!;

  return (
    <div className="professionals-page">
      {/* Page Header */}
      <header className="professionals-page__header">
        <div className="professionals-page__header-content">
          <h1>אנשי מקצוע וגורמי תמיכה</h1>
          <p>
            מאגר אנשי מקצוע שמכירים ומטפלים בתסמונות PANDAS/PANS.
            <br />
            המידע נאסף מהקהילה ואינו מהווה המלצה רפואית.
          </p>
          <button
            className="professionals-page__recommend-btn"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusIcon />
            המליצו על איש מקצוע
          </button>
        </div>
      </header>

      {/* Tabs Navigation */}
      <nav className="professionals-page__tabs" role="tablist">
        {TABS.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              className={`professionals-page__tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <TabIcon />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Tab Content */}
      <main className="professionals-page__content">
        {/* Section Description */}
        <div className="professionals-page__section-header">
          <h2>{currentTab.label}</h2>
          <p>{currentTab.description}</p>
        </div>

        {/* Filter Bar */}
        <FilterBar
          fields={currentFields}
          locations={LOCATIONS}
          selectedField={currentFilters.field}
          selectedLocation={currentFilters.location}
          searchQuery={currentFilters.searchQuery}
          onFieldChange={handleFieldChange}
          onLocationChange={handleLocationChange}
          onSearchChange={handleSearchChange}
          onClearFilters={handleClearFilters}
          resultsCount={filteredProfessionals.length}
        />

        {/* Professionals Grid */}
        {filteredProfessionals.length > 0 ? (
          <div className="professionals-page__grid">
            {filteredProfessionals.map((professional) => (
              <ProfessionalCard key={professional.id} professional={professional} />
            ))}
          </div>
        ) : (
          <div className="professionals-page__empty">
            <div className="professionals-page__empty-icon">🔍</div>
            <h3>לא נמצאו תוצאות</h3>
            <p>נסו לשנות את הסינון או לחפש מילים אחרות</p>
            <button
              className="professionals-page__empty-btn"
              onClick={handleClearFilters}
            >
              נקה סינון
            </button>
          </div>
        )}

        {/* Disclaimer */}
        <div className="professionals-page__disclaimer">
          <strong>הערה חשובה:</strong> המידע באתר זה נאסף מהקהילה ומהווה מקור מידע בלבד.
          אין לראות במידע זה המלצה רפואית. יש להתייעץ עם רופא מוסמך לפני קבלת החלטות טיפוליות.
        </div>
      </main>

      {/* Recommend Professional Modal */}
      <RecommendProfessionalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialCategory={activeTab}
      />
    </div>
  );
};

export default ProfessionalsHelpPage;