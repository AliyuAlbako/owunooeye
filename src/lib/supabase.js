import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.DBURL
const supabaseKey = import.meta.env.PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase environment variables are missing.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)