'use client';

import React, { useState } from 'react';
import { Plus, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function ExpenseFAB() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="fixed bottom-6 right-6 flex flex-col-reverse items-end gap-2 z-50">
      {isOpen && (
        <>
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="rounded-full shadow-lg"
          >
            <Link href="/expenses/import">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Link>
          </Button>
          
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="rounded-full shadow-lg"
          >
            <Link href="/expenses/new">
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Link>
          </Button>
        </>
      )}
      
      <Button
        variant="default"
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </Button>
    </div>
  );
} 