'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { CalendarIcon, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PostgrestError } from '@supabase/supabase-js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageContainer, PageHeader } from '@/components/ui/page-layout';
import { Skeleton } from '@/components/ui/skeleton';

// Schema for form validation
const expenseFormSchema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(parseFloat(val)), 'Must be a valid number'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  date: z.date({
    required_error: 'Please select a date',
  }),
});

// Define the type based directly on the schema without transformations
type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

// Categories for the select dropdown
const categories = [
  'Food',
  'Transportation',
  'Entertainment',
  'Housing',
  'Utilities',
  'Healthcare',
  'Shopping',
  'Other'
];

export default function EditExpensePage() {
  const router = useRouter();
  const params = useParams();
  const expenseId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const supabase = createClientSupabaseClient();
  
  // Initialize form with resolver
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      amount: '',
      description: '',
      category: '',
      date: new Date(),
    },
  });

  // Fetch the expense data for editing
  useEffect(() => {
    async function fetchExpense() {
      setIsFetching(true);
      try {
        
        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .eq('id', expenseId)
          .single();

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        
        if (!data) {
          console.error("No data returned for ID:", expenseId);
          throw new Error("Expense not found");
        }
        
        
        // Convert numeric amount to string for form input
        form.setValue('amount', data.amount.toString());
        form.setValue('description', data.description || '');
        
        // Keep track of what category is being loaded
        const categoryFromDB = data.category;
        
        // Set the form value
        form.setValue('category', categoryFromDB);
        form.setValue('date', new Date(data.date));
        
        // Log an explicit check if category is in the allowed list
        if (!categories.includes(categoryFromDB)) {
          console.warn("⚠️ Category from DB is not in the allowed list:", categoryFromDB);
        }
      } catch (error) {
        console.error("Error fetching expense details:", error);
        toast.error('Failed to load expense details');
      } finally {
        setIsFetching(false);
      }
    }

    if (expenseId) {
      fetchExpense();
    }
  }, [expenseId, form, supabase]);

  // Debug: Watch form values
  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("👀 Form values changed:", value);
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  async function onSubmit(values: ExpenseFormValues) {
    console.log("📝 Submitting form with values:", values);
    setIsLoading(true);
    
    try {
      // Convert the amount string to a number for database storage
      const numericAmount = parseFloat(values.amount);
      
      const { error } = await supabase
        .from('expenses')
        .update({
          amount: numericAmount,
          description: values.description || null, // Handle empty string
          category: values.category,
          date: values.date.toISOString(),
        })
        .eq('id', expenseId);

      if (error) {
        throw error;
      }

      toast.success('Expense updated successfully');
      router.push(`/expenses/${expenseId}`);
    } catch (error) {
      const pgError = error as PostgrestError;
      toast.error(pgError.message || 'Failed to update expense');
    } finally {
      setIsLoading(false);
    }
  }

  const handleCancel = () => {
    router.back();
  };

  return (
    <PageContainer>
      <PageHeader
        heading="Edit Expense"
        description="Update expense details"
      >
        <Button
          variant="ghost"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </PageHeader>
      
      <Card>
        <CardHeader>
          <CardTitle>Edit Expense</CardTitle>
          <CardDescription>
            Update the details of your expense
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            $
                          </span>
                          <Input 
                            type="number" 
                            placeholder="0.00" 
                            {...field} 
                            step="0.01"
                            min="0"
                            className="pl-7"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <div className="relative border rounded-md">
                          <select
                            className="w-full h-9 px-3 py-2 bg-transparent appearance-none focus:outline-none"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            <option value="" disabled>Select a category</option>
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="opacity-50"
                            >
                              <path d="m6 9 6 6 6-6"/>
                            </svg>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add details about this expense..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-4">
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Updating...' : 'Update Expense'}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
} 