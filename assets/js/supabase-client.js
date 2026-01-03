// assets/js/supabase-client.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Prefer environment variables (Netlify / Vercel)
const supabaseUrl =
  window?.ENV?.SUPABASE_URL ||
  'https://ziwlrarebpqhfyurmnpa.supabase.co';

const supabaseAnonKey =
  window?.ENV?.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppd2xyYXJlYnBxaGZ5dXJtbnBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MzI1ODQsImV4cCI6MjA4MjEwODU4NH0.QYST23OHVQ2KwzGM2jBvjHuCB7Fs5F48CDtvsgNtfOY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
