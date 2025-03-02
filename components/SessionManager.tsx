'use client'

import { useEffect } from 'react';
import { createClientSupabaseClient } from '@/lib/supabase/client';

export default function SessionManager() {
  useEffect(() => {
    const supabase = createClientSupabaseClient();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          // Handle session updates
        }
        
        if (event === 'USER_UPDATED') {
          // User data updated
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return null; // This component doesn't render anything
} 