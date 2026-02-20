import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { ProfessionalCategory, ProfessionalFilters, Professional, NewProfessionalPayload, Tab } from '../../types/professionals';
import { MEDICAL_FIELDS, HOLISTIC_FIELDS, THERAPY_FIELDS, LOCATIONS, filterProfessionals } from '../../data/professionalsData';
import './ProfessionalsHelpPage.scss';
import { addProfessional, subscribeToProfessionals } from '../../services/professionalsService';
import type { Unsubscribe } from 'firebase/firestore';
import { HolisticIcon, MedicalIcon, PlusIcon, TherapyIcon } from '../../components/icons';
import FilterBar from '@/components/professionals/FilterBar/FilterBar';
import RecommendModal from '@/components/professionals/RecommendProfessionalModal/RecommendProfessionalModal';
import ProfessionalCard from '@/components/professionals/ProfessionalCard/ProfessionalCard';
import TreatmentTabs from '@/components/Treatment/TreatmentTabs/TreatmentTabs';

const TABS: Tab[] = [
  { key: 'medical', label: 'רופאים', icon: MedicalIcon, description: 'רופאים ומומחים רפואיים עם ידע בתסמונות פאנס/פאנדס' },
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
  const handleAddProfessional = useCallback(async (payload: NewProfessionalPayload): Promise<void> => {
    try {
      await addProfessional(payload);
    } catch (error) {
      console.error("Failed to submit professional to Firestore:", error);
    }
  }, []);

  const currentTab = TABS.find((t) => t.key === activeTab)!;

  return (
    <div className="professionals-page">
      <TreatmentTabs />
      {/* Header */}
      <header className="page-header">
        <div className="page-header__content">
          <h1>אנשי מקצוע וגורמי תמיכה</h1>
          <p>מאגר אנשי מקצוע המכירים ומטפלים בתסמונות פאנס/פאנדס</p>
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
      <div className="disclaimer">
        <strong>⚠️ הערה:</strong> המידע נאסף מהקהילה ואינו מהווה המלצה רפואית. יש להתייעץ עם רופא מוסמך.
      </div>

      {/* Content */}
      <main className="page-content">
        <div className="section-header">
          <h2>{currentTab.label}</h2>
          <p>{currentTab.description}</p>
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