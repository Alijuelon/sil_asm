import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wjggalafrmspwjbqqrqg.supabase.co'
const supabaseKey = 'sb_publishable_NCdBByY0-jlY2JtdXT-hoQ_JW5uc6v9'

export const supabase = createClient(supabaseUrl, supabaseKey)