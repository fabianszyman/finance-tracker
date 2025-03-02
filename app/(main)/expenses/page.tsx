'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer, PageHeader, DashboardSection, TableContainer } from '@/components/ui/page-layout';
import { Button } from '@/components/ui/button';
import { Plus, Upload, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Expense {
  id: string;
  amount: number;
  category: string;
  category_details: string[] | null;
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
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('User not authenticated');
        }

        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .eq('user_id', user.id)
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
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/expenses/import">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Link>
          </Button>
          <Button asChild>
            <Link href="/expenses/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Link>
          </Button>
        </div>
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
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4"><Skeleton className="h-5 w-24" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-5 w-20" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-5 w-36" /></td>
                    <td className="py-3 px-4 text-right"><Skeleton className="h-5 w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-muted-foreground">
                    No expenses found. Add your first expense to get started.
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr 
                    key={expense.id} 
                    className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleExpenseClick(expense.id)}
                  >
                    <td className="py-3 px-4">{formatDate(expense.date)}</td>
                    <td className="py-3 px-4">
                      {expense.category_details && expense.category_details.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {/* Show first category in full */}
                          {(() => {
                            const [group, item] = expense.category_details[0].split(': ');
                            return (
                              <Badge key="primary" variant="secondary" className="whitespace-nowrap">
                                <span className="font-medium mr-1">{group}:</span>
                                {item || group}
                              </Badge>
                            );
                          })()}
                          
                          {/* Show count if more than one category */}
                          {expense.category_details.length > 1 && (
                            <Badge variant="outline" className="bg-background">
                              +{expense.category_details.length - 1}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span>{expense.category}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-ellipsis overflow-hidden max-w-[200px]">
                      {expense.description || "-"}
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      <div className={`flex items-center gap-1 ${
                        expense.amount > 0 
                          ? "text-green-600 font-medium" 
                          : ""
                      }`}>
                        {expense.amount > 0 
                          ? <ArrowUpRight className="h-3 w-3" /> 
                          : <ArrowDownRight className="h-3 w-3" />
                        }
                        {formatCurrency(expense.amount)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableContainer>
      </DashboardSection>
    </PageContainer>
  );
} 