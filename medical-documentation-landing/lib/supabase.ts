// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { API_CONFIG } from './config'

// Create client using values from config
export const supabase = createClient(
  API_CONFIG.NEXT_PUBLIC_SUPABASE_URL,
  API_CONFIG.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Optional: validate the values exist
if (!API_CONFIG.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
}

if (!API_CONFIG.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY')
}
