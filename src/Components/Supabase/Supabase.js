import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pvdvrhyfdylpefddjssp.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2ZHZyaHlmZHlscGVmZGRqc3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2NzY0MTMsImV4cCI6MjA1MjI1MjQxM30.TGMd1YCSBslg4r4di3vca7Ts38p5xBAcsJr8EcQ8hVI";
export const supabase = createClient(supabaseUrl, supabaseKey);
