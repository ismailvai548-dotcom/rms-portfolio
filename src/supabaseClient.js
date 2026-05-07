import { createClient } from '@supabase/supabase-js';

// আপনার সুপাবেস URL এবং Key
const supabaseUrl = 'https://dlxmzzvcpoysouuakadt.supabase.co';
const supabaseKey = 'sb_publishable_ws9Yr9RmAiPekGVDUwTu5Q_nr1ntfYZ';

export const supabase = createClient(supabaseUrl, supabaseKey);