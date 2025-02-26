'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import { Session } from '@/types/supabase';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      
      // If no session exists, redirect to login page
      if (!data.session) {
        router.push('/login');
        return;
      }
      
      setSession(data.session);
      setLoading(false);
    }
    
    checkSession();
  }, [router, supabase]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Only render children if user is authenticated
  return session ? <>{children}</> : null;
} 