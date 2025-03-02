import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';

export function createClientSupabaseClient() {
  const supabase = createClientComponentClient<Database>();
  
  // Set up a refresh interval that runs while the user is active
  // This keeps the session alive as long as the app is open
  if (typeof window !== 'undefined') {
    // Check if we already have an interval set
    if (!(window as any).__supabaseRefreshInterval) {
      // Refresh session every 30 minutes (adjust as needed)
      (window as any).__supabaseRefreshInterval = setInterval(async () => {
        const { error } = await supabase.auth.refreshSession();
        if (error) {
          console.error('Failed to refresh session:', error);
        }
      }, 30 * 60 * 1000); // 30 minutes
    }
  }
  
  return supabase;
} 