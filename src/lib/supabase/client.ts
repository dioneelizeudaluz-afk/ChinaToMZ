import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zsvkyluobwkjttqxnxnh.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzdmt5bHVvYndranR0cXhueG5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3Njc5MDMsImV4cCI6MjEwNjM0MzkwM30.yN0jMKfRia6Bx9F7qrm4DCFQHPFTsIpLEOtdgXtxm5k'
  );
}