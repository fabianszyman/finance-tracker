'use client'

import { ThemeProvider } from '@/components/ThemeProvider';
import SessionManager from '@/components/SessionManager';
import { Toaster } from 'sonner';
import { ExpenseFAB } from '@/components/ExpenseFAB';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <SessionManager />
      <div className="min-h-screen">
        {children}
        <ExpenseFAB />
        <Toaster position="top-right" richColors />
      </div>
    </ThemeProvider>
  );
} 