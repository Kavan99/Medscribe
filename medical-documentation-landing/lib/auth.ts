// lib/auth.ts
import { cookies } from 'next/headers'
import { supabase } from './supabase'

export async function getSession() {
  const cookieStore = cookies()
  const token = cookieStore.get('sb-access-token')?.value // Supabase's default cookie

  if (!token) return null

  // Fetch user from Supabase
  const { data: { user }, error } = await supabase.auth.getUser(token)
  
  if (error || !user) return null
  return user
}

export async function isAuthenticated() {
  const session = await getSession()
  return !!session
}