import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';

const AuthContext = createContext(null);
const DEMO_USER_KEY = 'resumeiq-demo-user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data }) => {
        setUser(data.session?.user ?? null);
        setLoading(false);
      });
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      return () => listener.subscription.unsubscribe();
    }
    // Local/demo fallback — no Supabase project configured.
    const stored = localStorage.getItem(DEMO_USER_KEY);
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const signUp = useCallback(async ({ name, email, password }) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) throw error;
      return data.user;
    }
    const demoUser = { id: crypto.randomUUID(), email, user_metadata: { full_name: name } };
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
    return demoUser;
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data.user;
    }
    // Demo mode accepts any credentials so the product remains previewable.
    const demoUser = { id: crypto.randomUUID(), email, user_metadata: { full_name: email.split('@')[0] } };
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
    return demoUser;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
      return;
    }
    throw new Error('Google sign-in requires Supabase to be configured.');
  }, []);

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem(DEMO_USER_KEY);
    }
    setUser(null);
  }, []);

  const resetPassword = useCallback(async (email) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return;
    }
    throw new Error('Password reset requires Supabase to be configured.');
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, isSupabaseConfigured, signUp, signIn, signInWithGoogle, signOut, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
