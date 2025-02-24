'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Auth from '@/components/Auth';
import Profile from '@/components/Profile';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import { Session } from '@/types/supabase';

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  useEffect(() => {
    async function getSession() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
      
      // Redirect to dashboard if logged in
      if (data.session) {
        router.push('/dashboard');
      }
    }
    
    getSession();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If not logged in, show the auth page
  if (!session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 lg:p-24">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Finance Tracker
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Track your expenses and manage your finances with ease
          </p>
        </div>

        <div className="w-full max-w-md mx-auto">
          <Auth />
        </div>
      </main>
    );
  }

  // This won't render as we redirect in the useEffect
  return null;
}
