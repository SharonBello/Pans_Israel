// ==========================================================================
// AuthContext.tsx
// Firebase Authentication Context
// ==========================================================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    type User,
} from 'firebase/auth';
import app from '@/config/firebase'; // adjust path to your firebase config

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAdmin: boolean;
}

// --------------------------------------------------------------------------
// Context
// --------------------------------------------------------------------------

const AuthContext = createContext<AuthContextType | null>(null);

// --------------------------------------------------------------------------
// Provider
// --------------------------------------------------------------------------

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const auth = getAuth(app);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });
        return unsubscribe;
    }, [auth]);

    const login = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const logout = async () => {
        await signOut(auth);
    };

    // isAdmin: true if user is logged in (only admins can log in via this system)
    const isAdmin = !!user;

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

// --------------------------------------------------------------------------
// Hook
// --------------------------------------------------------------------------

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};