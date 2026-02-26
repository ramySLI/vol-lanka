"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    User as FirebaseUser,
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut
} from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { User as UserType } from "@/types/user";

interface AuthContextType {
    user: FirebaseUser | null;
    userData: UserType | null;
    isAdmin: boolean;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    userData: null,
    isAdmin: false,
    loading: true,
    signInWithGoogle: async () => { },
    signInWithEmail: async () => { },
    signUpWithEmail: async () => { },
    signOut: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [userData, setUserData] = useState<UserType | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                // In a real implementation we would fetch extended UserType from Firestore here.
                // using the firestore `doc(db, "users", firebaseUser.uid)` reference.
                // Keeping it strictly aligned to typing structure setup earlier:
                setUserData({
                    id: firebaseUser.uid,
                    email: firebaseUser.email || "",
                    displayName: firebaseUser.displayName || "",
                    preferences: {},
                    bookings: [],
                    favorites: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    lastLogin: new Date()
                });

                // Check Admin Status Dynamically
                try {
                    const adminDoc = await getDoc(doc(db, "admins", firebaseUser.uid));
                    setIsAdmin(adminDoc.exists());
                } catch {
                    setIsAdmin(false);
                }
            } else {
                setUserData(null);
                setIsAdmin(false);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in with Google", error);
            throw error;
        }
    };

    const signInWithEmail = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Error signing in with Email/Password", error);
            throw error;
        }
    };

    const signUpWithEmail = async (email: string, password: string) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Error signing up with Email/Password", error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, userData, isAdmin, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
