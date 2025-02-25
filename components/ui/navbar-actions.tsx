'use client';

import { useRouter } from 'next/navigation';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function NavbarActions() {
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      router.push('/');
    } catch {
      toast.error('Error signing out');
    }
  };

  return (
    <Button
      onClick={handleSignOut}
      variant="ghost"
      size="sm"
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span className="hidden sm:inline">Logout</span>
    </Button>
  );
} 