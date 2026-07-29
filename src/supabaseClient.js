import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dlxmzzvcpoysoouakadt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRseG16enZjcG95c29vdWFrYWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMzA3NDEsImV4cCI6MjA5MzcwNjc0MX0.iXQRyqevSoRXvpUG291OFr4bzQq6yEoN6lXvikoJK5g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);