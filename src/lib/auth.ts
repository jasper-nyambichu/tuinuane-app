import { createServerSupabaseClient } from './supabase-server'
import { redirect } from 'next/navigation'

export async function requireAdmin() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/admin/login')
  }

  return { supabase, user }
}