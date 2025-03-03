'use client';

import { AppSidebar } from '@/components/app-sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { SidebarInset, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Menu } from "lucide-react";

// Mobile/Desktop header component with consistent styling
function SiteHeader() {
  const { isMobile, setOpenMobile } = useSidebar();
  
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-4 border-b bg-background px-4 lg:px-8">
      {isMobile && (
        <button 
          onClick={() => setOpenMobile(true)}
          className="inline-flex items-center justify-center size-10 rounded-md text-muted-foreground hover:text-foreground lg:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </button>
      )}
      
      <div className="flex items-center gap-2">
        {isMobile && <Separator orientation="vertical" className="h-6" />}
        <span className="font-bold text-xl">FinanceAI</span>
      </div>
    </header>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="[--header-height:theme(spacing.14)]">
        <SidebarProvider className="flex min-h-screen flex-col bg-background">
          <SiteHeader />
          <div className="flex flex-1 overflow-hidden">
            <AppSidebar />
            <SidebarInset className="flex-1 overflow-auto">
              <main className="flex-1">
                <div className="mx-auto w-full p-4 md:p-6 lg:p-8">
                  <div className="mx-auto max-w-6xl">
                    {children}
                  </div>
                </div>
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </ProtectedRoute>
  );
} 