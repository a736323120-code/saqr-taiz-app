import { createClient } from "@supabase/supabase-js";

// Supabase credentials:
const rawUrl = "https://pklkszabmffojsgkmlgs.supabase.co/rest/v1/";
const SUPABASE_URL = rawUrl.replace(/\/rest\/v1\/?$/, '');
const SUPABASE_PUBLIC_KEY = "sb_publishable_9PeOMVnNGTL-ikdiOlDtLA_PkCoub3I";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

