'use client';

import Link from "next/link";
import { PiggyBank, Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Toggle } from "@/components/ui/toggle";
import { useTheme } from "next-themes";

export default function NavBar({ variant = "marketing" }: { variant?: "marketing" | "auth" | "dashboard" }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // After mounting, we can safely access theme values
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 font-bold">
          <PiggyBank className="h-6 w-6" />
          <Link href="/" className="text-lg font-semibold">FinanceAI</Link>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link 
            href="/marketing#features" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link 
            href="/marketing#benefits" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Benefits
          </Link>
          <Link 
            href="/marketing#faq" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            FAQ
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          {/* Desktop auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button 
              variant={isLoginPage ? "default" : "outline"} 
              size="sm"
              asChild
              className={isLoginPage ? "pointer-events-none" : ""}
            >
              <Link href="/login">Log in</Link>
            </Button>
            <Button 
              variant={isRegisterPage ? "default" : "outline"} 
              size="sm"
              asChild
              className={isRegisterPage ? "pointer-events-none" : ""}
            >
              <Link href="/register">Sign up</Link>
            </Button>
          </div>
          
          {/* Theme toggle */}
          {mounted && (
            <Toggle 
              aria-label="Toggle dark mode" 
              className="rounded-full"
              pressed={theme === "dark"}
              onPressedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Toggle>
          )}
          
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 sm:w-80 md:hidden">
              <div className="flex flex-col gap-6 mt-6">
                <Link 
                  href="/marketing#features" 
                  className="text-foreground hover:text-primary text-sm"
                >
                  Features
                </Link>
                <Link 
                  href="/marketing#benefits" 
                  className="text-foreground hover:text-primary text-sm"
                >
                  Benefits
                </Link>
                <Link 
                  href="/marketing#faq" 
                  className="text-foreground hover:text-primary text-sm"
                >
                  FAQ
                </Link>
                
                <div className="h-px bg-border my-2" />
                
                <div className="flex flex-col gap-3 mt-2">
                  <Button asChild className={isLoginPage ? "pointer-events-none" : ""}>
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button asChild variant="outline" className={isRegisterPage ? "pointer-events-none" : ""}>
                    <Link href="/register">Sign up</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
} 