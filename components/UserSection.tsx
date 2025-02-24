'use client';

import dynamic from 'next/dynamic';
import Auth from '@/components/Auth';
import { Session } from '@/types/supabase';

// Import Profile with SSR disabled
const Profile = dynamic(() => import('@/components/Profile'), { ssr: false });

export default function UserSection({ initialSession }: { initialSession: Session | null }) {
  return (
    <div className="mt-10">
      {initialSession ? <Profile /> : <Auth />}
    </div>
  );
} 