'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PageContainer, PageHeader } from '@/components/ui/page-layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import ExpenseForm from '@/components/ExpenseForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Expense } from '@/lib/types';

export default function EditExpensePage() {
  const router = useRouter();
  const params = useParams();
  const expenseId = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [expense, setExpense] = useState<Expense | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientSupabaseClient();
  
  // Fetch the expense data
  useEffect(() => {
    async function fetchExpense() {
      if (!expenseId) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .eq('id', expenseId)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (!data) {
          throw new Error('Expense not found');
        }
        
        setExpense(data);
      } catch (err: any) {
        console.error('Error fetching expense:', err);
        setError(err.message || 'Failed to load expense');
        toast.error('Failed to load expense details');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchExpense();
  }, [expenseId, supabase]);

  return (
    <PageContainer>

      
      <div className="max-w-4xl mx-auto">
              {/* Empty PageHeader with ONLY the back button */}
      <div className="flex justify-end mb-4">
        <Button asChild variant="outline">
          <Link href="/expenses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Expenses
          </Link>
        </Button>
      </div>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-800 rounded-md">
            <p className="font-medium">Error</p>
            <p>{error}</p>
            <Button 
              onClick={() => router.push('/expenses')}
              className="mt-4"
              variant="outline"
            >
              Return to Expenses
            </Button>
          </div>
        ) : expense ? (
          <ExpenseForm initialData={expense} />
        ) : (
          <div className="p-4 bg-amber-50 text-amber-800 rounded-md">
            <p>Expense not found. It may have been deleted.</p>
            <Button 
              onClick={() => router.push('/expenses')}
              className="mt-4"
              variant="outline"
            >
              Return to Expenses
            </Button>
          </div>
        )}
      </div>
    </PageContainer>
  );
} 