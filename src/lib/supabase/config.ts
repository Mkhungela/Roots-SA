export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * ROOTS SA runs in two modes.
 *
 *  - **Archive mode** (no keys): the bundled seed archive is served and anything a
 *    visitor creates is kept in their browser. Nothing to configure, works offline.
 *  - **Live mode** (keys present): posts, comments, likes, saves and uploads go to
 *    Supabase, with auth and row level security. See supabase/migrations/0001_init.sql.
 */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
