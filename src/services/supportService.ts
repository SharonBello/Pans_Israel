// ==========================================================================
// Support Volunteer Firebase Service
// ==========================================================================

import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { SupportVolunteer, SupportVolunteerFormData } from '../types/support.types';

const COLLECTION_NAME = 'support_volunteers';

// --------------------------------------------------------------------------
// Get All Approved Volunteers (for public display)
// --------------------------------------------------------------------------

export const getApprovedVolunteers = async (): Promise<SupportVolunteer[]> => {
  try {
    const volunteersRef = collection(db, COLLECTION_NAME);
    const q = query(
      volunteersRef,
      where('isApproved', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as SupportVolunteer));
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    return [];
  }
};

// --------------------------------------------------------------------------
// Get All Volunteers (for admin)
// --------------------------------------------------------------------------

export const getAllVolunteers = async (): Promise<SupportVolunteer[]> => {
  try {
    const volunteersRef = collection(db, COLLECTION_NAME);
    const q = query(volunteersRef, orderBy('createdAt', 'desc'));
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as SupportVolunteer));
  } catch (error) {
    console.error('Error fetching all volunteers:', error);
    return [];
  }
};

// --------------------------------------------------------------------------
// Add New Volunteer
// --------------------------------------------------------------------------

export const addVolunteer = async (
  formData: SupportVolunteerFormData
): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const volunteersRef = collection(db, COLLECTION_NAME);
    
    const volunteerData: Omit<SupportVolunteer, 'id'> = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      age: parseInt(formData.age, 10),
      gender: formData.gender as 'male' | 'female' | 'other',
      religiousAffiliation: formData.religiousAffiliation,
      religion: formData.religion,
      profession: formData.profession.trim(),
      education: formData.education,
      location: formData.location.trim(),
      howToHelp: formData.howToHelp.trim(),
      contactPreference: formData.contactPreference,
      phone: formData.phone.trim(),
      email: formData.email.trim().toLowerCase(),
      isApproved: false, // Requires admin approval
      createdAt: Timestamp.now(),
    };
    
    const docRef = await addDoc(volunteersRef, volunteerData);
    
    return {
      success: true,
      id: docRef.id,
    };
  } catch (error) {
    console.error('Error adding volunteer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'שגיאה בהוספת המתנדב',
    };
  }
};

// --------------------------------------------------------------------------
// Update Volunteer
// --------------------------------------------------------------------------

export const updateVolunteer = async (
  id: string,
  data: Partial<SupportVolunteer>
): Promise<{ success: boolean; error?: string }> => {
  try {
    const volunteerRef = doc(db, COLLECTION_NAME, id);
    
    await updateDoc(volunteerRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating volunteer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'שגיאה בעדכון המתנדב',
    };
  }
};

// --------------------------------------------------------------------------
// Approve/Reject Volunteer (Admin)
// --------------------------------------------------------------------------

export const setVolunteerApproval = async (
  id: string,
  isApproved: boolean
): Promise<{ success: boolean; error?: string }> => {
  return updateVolunteer(id, { isApproved });
};

// --------------------------------------------------------------------------
// Delete Volunteer (Admin)
// --------------------------------------------------------------------------

export const deleteVolunteer = async (
  id: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const volunteerRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(volunteerRef);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting volunteer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'שגיאה במחיקת המתנדב',
    };
  }
};

// --------------------------------------------------------------------------
// Get Volunteer by ID
// --------------------------------------------------------------------------

export const getVolunteerById = async (
  id: string
): Promise<SupportVolunteer | null> => {
  try {
    const volunteerRef = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(volunteerRef);
    
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data(),
      } as SupportVolunteer;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching volunteer:', error);
    return null;
  }
};

// --------------------------------------------------------------------------
// Generate WhatsApp Link
// --------------------------------------------------------------------------

export const generateWhatsAppLink = (phone: string, message?: string): string => {
  // Clean phone number - remove spaces, dashes, etc.
  let cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // If starts with 0, replace with Israel country code
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '972' + cleanPhone.substring(1);
  }
  
  // If doesn't have country code, add Israel
  if (!cleanPhone.startsWith('+') && !cleanPhone.startsWith('972')) {
    cleanPhone = '972' + cleanPhone;
  }
  
  // Remove + if present
  cleanPhone = cleanPhone.replace('+', '');
  
  const baseUrl = `https://wa.me/${cleanPhone}`;
  
  if (message) {
    return `${baseUrl}?text=${encodeURIComponent(message)}`;
  }
  
  return baseUrl;
};

// --------------------------------------------------------------------------
// Generate Email Link
// --------------------------------------------------------------------------

export const generateEmailLink = (
  email: string,
  subject?: string,
  body?: string
): string => {
  let link = `mailto:${email}`;
  const params: string[] = [];
  
  if (subject) {
    params.push(`subject=${encodeURIComponent(subject)}`);
  }
  
  if (body) {
    params.push(`body=${encodeURIComponent(body)}`);
  }
  
  if (params.length > 0) {
    link += '?' + params.join('&');
  }
  
  return link;
};
