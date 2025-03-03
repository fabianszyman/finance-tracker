'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { LogOut, Home, Receipt, User } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Session } from '@/types/supabase';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    async function getSession() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      
      // If no valid session, redirect to home/login
      if (!data.session) {
        router.push('/');
      }
    }
    
    getSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        router.push('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      router.push('/');
    } catch {
      toast.error('Error signing out');
    }
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/expenses', label: 'Expenses', icon: Receipt },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  if (!session) {
    return null; // Don't render navbar if not authenticated
  }

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8 mx-auto w-full max-w-7xl">
        <Link href="/dashboard" className="font-bold text-xl mr-4 sm:mr-6">
          FinanceAI
        </Link>
        
        <nav className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6 mx-2 sm:mx-6 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
                             (item.href !== '/dashboard' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors flex items-center whitespace-nowrap py-2",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="ml-auto flex items-center">
          <Button
            onClick={handleSignOut}
            variant="ghost"
            size="sm"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
} 