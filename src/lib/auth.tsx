import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import type { AuthUser } from './types';

const STORAGE_KEY = 'promptvault_user';

function getInitials(email: string): string {
  const namePart = email.split('@')[0];
  const parts = namePart.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return namePart.slice(0, 2).toUpperCase();
}

function loadUserFromStorage(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (parsed && parsed.email && parsed.id) return parsed;
    return null;
  } catch {
    return null;
  }
}

function saveUserToStorage(user: AuthUser | null) {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (email: string, _password: string) => Promise<void>;
  signUp: (email: string, _password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = loadUserFromStorage();
    if (stored) setUser(stored);
    setIsLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 600));
    const newUser: AuthUser = {
      id: crypto.randomUUID(),
      email,
      displayName: email.split('@')[0],
      initials: getInitials(email),
      provider: 'email',
    };
    saveUserToStorage(newUser);
    setUser(newUser);
  }, []);

  const signUp = useCallback(async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 600));
    const newUser: AuthUser = {
      id: crypto.randomUUID(),
      email,
      displayName: email.split('@')[0],
      initials: getInitials(email),
      provider: 'email',
    };
    saveUserToStorage(newUser);
    setUser(newUser);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 600));
    const fakeEmail = 'you.google@gmail.com';
    const newUser: AuthUser = {
      id: crypto.randomUUID(),
      email: fakeEmail,
      displayName: 'Google User',
      initials: 'GU',
      provider: 'google',
    };
    saveUserToStorage(newUser);
    setUser(newUser);
  }, []);

  const signOut = useCallback(() => {
    saveUserToStorage(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
