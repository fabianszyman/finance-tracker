'use client';

import { useEffect, useState } from 'react';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { LogOut, User as UserIcon } from 'lucide-react';
import { User } from '@/types/supabase';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientSupabaseClient();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };

    getUser();
  }, [supabase]);

  // Return null during SSR
  if (typeof window === 'undefined') {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      window.location.reload();
    } catch {
      toast.error('Error signing out');
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex items-center justify-center py-10">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
            <p className="text-sm text-muted-foreground">Loading profile...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <UserIcon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">Email</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">User ID</p>
          <p className="text-sm text-muted-foreground break-all">{user.id}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">Last Sign In</p>
          <p className="text-sm text-muted-foreground">
            {user.last_sign_in_at
              ? new Date(user.last_sign_in_at).toLocaleString()
              : 'First session'}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="destructive" className="w-full" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  );
} 