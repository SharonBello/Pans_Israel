export type ProfessionalCategory = 'medical' | 'holistic' | 'therapy';

export interface Professional {
    id: string;
    name: string;
    field: string;
    fieldKey: string;
    location: string;
    locationKey: string;
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
    description?: string;
    acceptingNewPatients?: boolean;
    category: ProfessionalCategory;
    imageUrl?: string;
}

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