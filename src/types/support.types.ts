// ==========================================================================
// Support Volunteer Types
// ==========================================================================

import { Timestamp } from 'firebase/firestore';

export interface SupportVolunteer {
  id?: string;
  firstName: string;           // שם
  lastName: string;            // שם משפחה
  age: number;                 // גיל
  gender: 'male' | 'female' | 'other';  // מגדר
  religiousAffiliation: string; // קרבה לדת
  religion: string;            // דת
  profession: string;          // משלוח יד
  education: string;           // השכלה
  location: string;            // מקום מגורים
  howToHelp: string;           // כיצד תרצי לעזור
  contactPreference: string[]; // באיזו דרך מתאים ליצור את הקשר
  phone?: string;              // טלפון (for WhatsApp)
  email?: string;              // אימייל
  isApproved: boolean;         // האם מאושר להצגה
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

export interface SupportVolunteerFormData {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  religiousAffiliation: string;
  religion: string;
  profession: string;
  education: string;
  location: string;
  howToHelp: string;
  contactPreference: string[];
  phone: string;
  email: string;
}

export const initialFormData: SupportVolunteerFormData = {
  firstName: '',
  lastName: '',
  age: '',
  gender: '',
  religiousAffiliation: '',
  religion: '',
  profession: '',
  education: '',
  location: '',
  howToHelp: '',
  contactPreference: [],
  phone: '',
  email: '',
};

// Options for form dropdowns
export const genderOptions = [
  { value: 'female', label: 'אישה' },
  { value: 'male', label: 'גבר' },
  { value: 'other', label: 'אחר' },
];

export const religiousOptions = [
  { value: 'secular', label: 'חילוני/ת' },
  { value: 'traditional', label: 'מסורתי/ת' },
  { value: 'religious', label: 'דתי/ה' },
  { value: 'ultra-orthodox', label: 'חרדי/ת' },
  { value: 'other', label: 'אחר' },
];

export const religionOptions = [
  { value: 'judaism', label: 'יהדות' },
  { value: 'islam', label: 'אסלאם' },
  { value: 'christianity', label: 'נצרות' },
  { value: 'druze', label: 'דרוזית' },
  { value: 'other', label: 'אחר' },
];

export const educationOptions = [
  { value: 'high-school', label: 'תיכונית' },
  { value: 'diploma', label: 'תעודה מקצועית' },
  { value: 'bachelors', label: 'תואר ראשון' },
  { value: 'masters', label: 'תואר שני' },
  { value: 'phd', label: 'דוקטורט' },
  { value: 'other', label: 'אחר' },
];

export const contactPreferenceOptions = [
  { value: 'phone', label: 'בטלפון' },
  { value: 'whatsapp', label: 'בווטסאפ' },
  { value: 'zoom', label: 'און ליין (בזום)' },
  { value: 'frontal', label: 'פגישות פרונטליות' },
  { value: 'email', label: 'באימייל' },
];
