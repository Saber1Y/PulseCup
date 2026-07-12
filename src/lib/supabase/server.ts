import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _admin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (_admin) return _admin;

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!supabaseUrl || !serviceKey) {
    throw new Error("Supabase admin client: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  }

  _admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  return _admin;
}
