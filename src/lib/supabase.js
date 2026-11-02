// src/lib/supabase.js
// Backwards-compatible alias for GitHub Repository Database (Supabase completely removed)
import { db, supabase as dbSupabase } from './db';

export { db };
export const supabase = dbSupabase;
export default db;
