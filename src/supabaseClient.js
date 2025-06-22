import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gcnkcqjnrnlcyzacvayd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjbmtjcWpucm5sY3l6YWN2YXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MTY3MTcsImV4cCI6MjA2NTk5MjcxN30.oKL6cl2LnRlTL5jeTdWNBfFDyVT4Jdskum-YYxU_Qx0';
 
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 