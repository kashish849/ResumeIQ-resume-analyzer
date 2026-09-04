import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// When Supabase credentials are missing, the app runs in local/demo mode
// (see AuthContext) so the UI stays fully previewable without a backend
// auth provider configured. isSupabaseConfigured is checked everywhere
// auth calls happen.
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null;
