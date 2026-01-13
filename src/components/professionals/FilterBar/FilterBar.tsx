import React from 'react';
import type { ProfessionalField, Location } from '../../../types/professionals';
import './FilterBar.scss';

// Search Icon
const SearchIcon: React.FC = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

// Clear Icon
const ClearIcon: React.FC = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

interface FilterBarProps {
    fields: ProfessionalField[];
    locations: Location[];
    selectedField: string;
    selectedLocation: string;
    searchQuery: string;
    onFieldChange: (field: string) => void;
    onLocationChange: (location: string) => void;
    onSearchChange: (query: string) => void;
    onClearFilters: () => void;
    resultsCount: number;
}

const FilterBar: React.FC<FilterBarProps> = ({
    fields,
    locations,
    selectedField,
    selectedLocation,
    searchQuery,
    onFieldChange,
    onLocationChange,
    onSearchChange,
    onClearFilters,
    resultsCount,
}) => {
    const hasActiveFilters = selectedField !== 'all' || selectedLocation !== 'all' || searchQuery !== '';

    return (
        <div className="filter-bar">
            <div className="filter-bar__search">
                <SearchIcon />
                <input
                    type="text"
                    placeholder="חיפוש לפי שם או מילות מפתח..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="filter-bar__search-input"
                />
                {searchQuery && (
                    <button
                        className="filter-bar__clear-search"
                        onClick={() => onSearchChange('')}
                        aria-label="נקה חיפוש"
                    >
                        <ClearIcon />
                    </button>
                )}
            </div>

            <div className="filter-bar__selects">
                <div className="filter-bar__select-group">
                    <label htmlFor="field-select" className="filter-bar__label">
                        תחום התמחות
                    </label>
                    <select
                        id="field-select"
                        value={selectedField}
                        onChange={(e) => onFieldChange(e.target.value)}
                        className="filter-bar__select"
                    >
                        <option value="all">כל התחומים</option>
                        {fields.map((field) => (
                            <option key={field.key} value={field.key}>
                                {field.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-bar__select-group">
                    <label htmlFor="location-select" className="filter-bar__label">
                        מיקום
                    </label>
                    <select
                        id="location-select"
                        value={selectedLocation}
                        onChange={(e) => onLocationChange(e.target.value)}
                        className="filter-bar__select"
                    >
                        <option value="all">כל המיקומים</option>
                        {locations.map((loc) => (
                            <option key={loc.key} value={loc.key}>
                                {loc.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="filter-bar__footer">
                <span className="filter-bar__results-count">
                    {resultsCount === 0
                        ? 'לא נמצאו תוצאות'
                        : resultsCount === 1
                            ? 'נמצאה תוצאה אחת'
                            : `נמצאו ${resultsCount} תוצאות`}
                </span>

                {hasActiveFilters && (
                    <button
                        className="filter-bar__clear-all"
                        onClick={onClearFilters}
                    >
                        <ClearIcon />
                        נקה סינון
                    </button>
                )}
            </div>
        </div>
    );
};

export default FilterBar;