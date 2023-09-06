import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

if (!supabaseKey) throw new Error(`SupabaseKey is required`)
if (!supabaseUrl) throw new Error(`SupabaseURL is required`)

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
