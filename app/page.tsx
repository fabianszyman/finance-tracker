import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
  // Create a server client
  const supabase = createServerComponentClient({ cookies });
  
  // Get the session on the server
  const { data: { session } } = await supabase.auth.getSession();
  
  // If logged in, redirect to dashboard
  if (session) {
    redirect('/dashboard');
  }
  
  // If not logged in, redirect to the marketing page
  redirect('/marketing');
}
