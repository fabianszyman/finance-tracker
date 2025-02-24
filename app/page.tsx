'use client';

import { useEffect, useState } from 'react';
import Auth from '@/components/Auth';
import Profile from '@/components/Profile';
import { createClientSupabaseClient } from '@/lib/supabase/client';

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientSupabaseClient();

  useEffect(() => {
    async function getSession() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    }
    
    getSession();
  }, [supabase]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 lg:p-24">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Next.js + Supabase + ShadCN
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          A modern authentication system with beautifully designed components
        </p>
      </div>

      <div className="w-full max-w-md mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
          </div>
        ) : (
          session ? <Profile /> : <Auth />
        )}
      </div>
    </main>
  );
}
