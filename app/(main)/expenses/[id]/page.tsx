'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { Expense } from '@/types/expense';
import { format } from 'date-fns';
import { PostgrestError } from '@supabase/supabase-js';

export default function ExpenseDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const expenseId = params.id;
  
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  useEffect(() => {
    async function fetchExpense() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .eq('id', expenseId)
          .single();

        if (error) throw error;
        setExpense(data);
      } catch (error) {
        const pgError = error as PostgrestError;
        toast.error(pgError.message || 'Failed to fetch expense details');
        router.push('/expenses');
      } finally {
        setLoading(false);
      }
    }

    fetchExpense();
  }, [expenseId, router, supabase]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    
    setDeleteLoading(true);
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);

      if (error) throw error;
      toast.success('Expense deleted successfully');
      router.push('/expenses');
    } catch (error) {
      const pgError = error as PostgrestError;
      toast.error(pgError.message || 'Failed to delete expense');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="flex justify-center items-center h-40">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="container max-w-4xl py-8">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Expense not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl text-primary">
                {formatCurrency(expense.amount)}
              </CardTitle>
              <CardDescription>
                {format(new Date(expense.date), 'MMMM d, yyyy')}
              </CardDescription>
            </div>
            <div className="px-4 py-2 bg-accent/50 rounded-full">
              {expense.category}
            </div>
          </div>
        </CardHeader>
        
        {expense.description && (
          <CardContent>
            <div className="space-y-2">
              <h3 className="font-medium">Description</h3>
              <p>{expense.description}</p>
            </div>
          </CardContent>
        )}
        
        <CardFooter className="flex justify-end gap-4 pt-6">
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={deleteLoading}
          >
            <Trash className="mr-2 h-4 w-4" />
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 