'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer, PageHeader, DashboardSection, TableContainer } from '@/components/ui/page-layout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  created_at: string;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;
        setExpenses(data || []);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchExpenses();
  }, [supabase]);

  // Navigate to expense details page
  const handleExpenseClick = (id: string) => {
    router.push(`/expenses/${id}`);
  };

  // Navigate to add expense page
  const handleAddExpense = () => {
    router.push('/expenses/new');
  };

  return (
    <PageContainer>
      <PageHeader 
        heading="Expenses" 
        description="View and manage your expenses"
      >
        <Button onClick={handleAddExpense}>
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </PageHeader>

      <DashboardSection 
        title="All Expenses" 
        subtitle="Click on an expense to view details"
      >
        <TableContainer>
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="py-3 px-4 text-left font-medium">Date</th>
                <th className="py-3 px-4 text-left font-medium">Category</th>
                <th className="py-3 px-4 text-left font-medium">Description</th>
                <th className="py-3 px-4 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4"><Skeleton className="h-5 w-24" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-5 w-20" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-5 w-40" /></td>
                    <td className="py-3 px-4 text-right"><Skeleton className="h-5 w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : expenses.length > 0 ? (
                expenses.map((expense) => (
                  <tr 
                    key={expense.id} 
                    className="border-b cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleExpenseClick(expense.id)}
                  >
                    <td className="py-3 px-4">{formatDate(expense.date)}</td>
                    <td className="py-3 px-4">{expense.category}</td>
                    <td className="py-3 px-4">{expense.description || '-'}</td>
                    <td className="py-3 px-4 text-right font-medium">{formatCurrency(expense.amount)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-muted-foreground">
                    No expenses found. Add your first expense!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </TableContainer>
      </DashboardSection>
    </PageContainer>
  );
} 