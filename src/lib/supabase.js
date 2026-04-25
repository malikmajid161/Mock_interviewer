import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://safdbuyuzvgughhvsbfj.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_lEYyzSYhJfI_xkm1upcLgQ_j9BmyZ6a'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
