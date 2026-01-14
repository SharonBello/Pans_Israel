import { SearchIcon } from "@/components/icons/Icons";
import type { FilterBarProps } from "@/types/professionals";

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

export default FilterBar;