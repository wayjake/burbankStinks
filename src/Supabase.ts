import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY

if (!supabaseKey) throw new Error(`SupabaseKey is required`)
if (!supabaseUrl) throw new Error(`SupabaseURL is required`)
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
