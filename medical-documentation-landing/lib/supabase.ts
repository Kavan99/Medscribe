// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

import { API_CONFIG } from './config'

export const supabase = createClient(
  API_CONFIG.SUPABASE_URL,
  API_CONFIG.SUPABASE_ANON_KEY
)


if (!supabaseUrl) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
}

if (!supabaseKey) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY')
}


export const supabase = createClient(supabaseUrl, supabaseKey)
