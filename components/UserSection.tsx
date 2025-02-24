'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Auth from '@/components/Auth';

// Import Profile with SSR disabled
const Profile = dynamic(() => import('@/components/Profile'), { ssr: false });

export default function UserSection({ initialSession }: { initialSession: any }) {
  const [session, setSession] = useState(initialSession);

  return (
    <div className="mt-10">
      {session ? <Profile /> : <Auth />}
    </div>
  );
} 