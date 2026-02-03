import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
} from "firebase/auth";
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  register: (email: string, password: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  updateUserEmail: (email: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

const ensureUserDocument = async (currentUser: User) => {
  const userRef = doc(db, "users", currentUser.uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) {
    await setDoc(userRef, {
      email: currentUser.email ?? "",
      themePreference: "light",
      createdAt: serverTimestamp(),
    });
  }
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        void ensureUserDocument(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  const register = async (email: string, password: string) => {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await ensureUserDocument(credential.user);
    return credential.user;
  };

  const login = async (email: string, password: string) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    await ensureUserDocument(credential.user);
    return credential.user;
  };

  const logout = () => signOut(auth);

  const updateUserEmail = async (email: string) => {
    if (!auth.currentUser) {
      throw new Error("No authenticated user available.");
    }
    await updateEmail(auth.currentUser, email);
    await setDoc(
      doc(db, "users", auth.currentUser.uid),
      { email },
      { merge: true }
    );
  };

  const deleteAccount = async () => {
    if (!auth.currentUser) {
      throw new Error("No authenticated user available.");
    }
    await deleteDoc(doc(db, "users", auth.currentUser.uid));
    await deleteUser(auth.currentUser);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      register,
      login,
      logout,
      updateUserEmail,
      deleteAccount,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
