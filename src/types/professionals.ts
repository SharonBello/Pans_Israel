export type ProfessionalCategory = 'medical' | 'holistic' | 'therapy';

// export interface Professional {
//     id: string;
//     name: string;
//     field: string;
//     fieldKey: string;
//     location: string;
//     locationKey: string;
//     phone?: string;
//     email?: string;
//     website?: string;
//     address?: string;
//     description?: string;
//     acceptingNewPatients?: boolean;
//     category: ProfessionalCategory;
//     imageUrl?: string;
// }

export interface ProfessionalField {
    key: string;
    label: string;
    category: ProfessionalCategory;
}

export interface Location {
    key: string;
    label: string;
    region?: string;
}

export interface ProfessionalFilters {
    field: string;
    location: string;
    searchQuery: string;
}

export interface RecommendProfessionalFormData {
    professionalName: string;
    field: string;
    location: string;
    phone?: string;
    email?: string;
    website?: string;
    description?: string;
    recommenderName: string;
    recommenderEmail: string;
    category: ProfessionalCategory;
}

export interface FilterBarProps {
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

// export interface RecommendModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     category: ProfessionalCategory;
//     onSubmit: (professional: Professional) => Promise<void>;
// }


export interface Professional {
  id: string; // Firestore document id (recommended)
  name: string;
  field: string;
  fieldKey: string;
  location: string;
  locationKey: string;
  category: ProfessionalCategory;
  acceptingNewPatients?: boolean;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  description?: string;
  imageUrl?: string;
}

export interface ProfessionalCardProps {
  professional: Professional;
}

// Payload for addDoc (no id; also don’t include undefined fields)
export type NewProfessionalPayload = Omit<Professional, "id">;

export interface RecommendModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: ProfessionalCategory;
  onSubmit: (payload: NewProfessionalPayload) => Promise<void>;
}

export interface Tab {
  key: ProfessionalCategory;
  label: string;
  icon: React.FC;
  description: string;
}