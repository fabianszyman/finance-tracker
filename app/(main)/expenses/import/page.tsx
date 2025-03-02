'use client';

import { PageContainer, PageHeader } from '@/components/ui/page-layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import CSVImportForm from '@/components/CSVImportForm';
import Link from 'next/link';

export default function ImportExpensesPage() {
  return (
    <PageContainer>
      <PageHeader 
        heading="Import Expenses" 
        description="Import expenses from a CSV file"
      >
        <Button asChild variant="outline">
          <Link href="/expenses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Expenses
          </Link>
        </Button>
      </PageHeader>
      
      <div className="my-6">
        <CSVImportForm />
      </div>
    </PageContainer>
  );
} 