import * as SupabaseSsr from '@supabase/ssr'

export const supabase = SupabaseSsr.createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)