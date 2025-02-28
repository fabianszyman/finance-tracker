'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PageContainer, PageHeader } from '@/components/ui/page-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  created_at: string;
  category_details: string[] | null;
}

export default function ExpenseDetailsPage() {
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const expenseId = params.id as string;
  const supabase = createClientSupabaseClient();

  useEffect(() => {
    async function fetchExpenseDetails() {
      try {
        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .eq('id', expenseId)
          .single();

        if (error) throw error;
        setExpense(data);
      } catch (error) {
        console.error('Error fetching expense details:', error);
        toast.error('Failed to load expense details');
      } finally {
        setLoading(false);
      }
    }

    if (expenseId) {
      fetchExpenseDetails();
    }
  }, [expenseId, supabase]);

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);

      if (error) throw error;
      
      toast.success('Expense deleted successfully');
      router.push('/expenses');
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleEdit = () => {
    router.push(`/expenses/edit/${expenseId}`);
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <PageContainer>
        <PageHeader heading="Expense Details">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </PageHeader>
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  if (!expense) {
    return (
      <PageContainer>
        <PageHeader heading="Expense Details">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </PageHeader>
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">Expense not found</p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => router.push('/expenses')}
            >
              Go back to all expenses
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader heading="Expense Details">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button variant="outline" onClick={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Expense</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this expense? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{formatCurrency(expense.amount)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Categories</h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {expense.category_details && expense.category_details.length > 0 ? (
                  expense.category_details.map((cat, index) => {
                    const [group, item] = cat.split(': ');
                    return (
                      <Badge key={index} variant="secondary">
                        <span className="font-medium mr-1">{group}:</span>
                        {item || group}
                      </Badge>
                    );
                  })
                ) : (
                  <p className="text-base font-medium">{expense.category}</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
              <p className="text-base font-medium">{formatDate(expense.date)}</p>
            </div>
          </div>
          
          {expense.description && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <p className="text-base">{expense.description}</p>
            </div>
          )}
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Added On</h3>
            <p className="text-sm">{formatDate(expense.created_at, true)}</p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
} 