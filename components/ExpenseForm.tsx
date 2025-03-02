'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { CalendarIcon, Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PostgrestError } from '@supabase/supabase-js';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Command as CommandPrimitive } from "cmdk";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Add this interface near the top of your file
interface Expense {
  id: string;
  amount: number;
  description?: string;
  category: string;
  category_details?: string[];
  date: string;
  created_at?: string;
}

// Define categories
const categories = {
  Food: [
    'Groceries',
    'Restaurants',
    'Fast Food',
    'Coffee Shops',
    'Food Delivery',
    'Snacks'
  ],
  Transportation: [
    'Public Transit',
    'Ride Sharing',
    'Fuel',
    'Parking',
    'Vehicle Maintenance',
    'Car Payment',
    'Car Insurance'
  ],
  Housing: [
    'Rent/Mortgage',
    'Utilities',
    'Maintenance',
    'Furniture',
    'Home Supplies',
    'Insurance'
  ],
  Healthcare: [
    'Doctor Visits',
    'Medication',
    'Insurance',
    'Fitness',
    'Mental Health'
  ],
  Personal: [
    'Clothing',
    'Beauty',
    'Electronics',
    'Gifts',
    'Subscriptions'
  ],
  Entertainment: [
    'Movies',
    'Games',
    'Books',
    'Concerts',
    'Streaming Services',
    'Hobbies'
  ],
  Education: [
    'Tuition',
    'Books',
    'Courses',
    'School Supplies'
  ],
  Financial: [
    'Investments',
    'Debt Payments',
    'Banking Fees',
    'Taxes'
  ],
  Other: [
    'Miscellaneous',
    'Charity',
    'Gifts'
  ]
};

// Flatten categories for search functionality
const flattenedCategories = Object.entries(categories).flatMap(
  ([group, items]) => items.map(item => ({ 
    value: `${group}: ${item}`, 
    label: item, 
    group 
  }))
);

// Synonym mapping for search terms
const categorySearchSynonyms: Record<string, string[]> = {
  // Food related
  "cafe": ["Coffee Shops"],
  "coffee": ["Coffee Shops"],
  "restaurant": ["Restaurants"],
  "dining": ["Restaurants"],
  "takeout": ["Food Delivery", "Fast Food"],
  "delivery": ["Food Delivery"],
  "grocery": ["Groceries"],
  "supermarket": ["Groceries"],
  
  // Transportation related
  "gas": ["Fuel"],
  "petrol": ["Fuel"],
  "uber": ["Ride Sharing"],
  "lyft": ["Ride Sharing"],
  "taxi": ["Ride Sharing"],
  "bus": ["Public Transit"],
  "train": ["Public Transit"],
  "subway": ["Public Transit"],
  "metro": ["Public Transit"],
  "car": ["Vehicle Maintenance", "Car Payment", "Car Insurance"],
  
  // Housing related
  "rent": ["Rent/Mortgage"],
  "mortgage": ["Rent/Mortgage"],
  "electricity": ["Utilities"],
  "water": ["Utilities"],
  "internet": ["Utilities"],
  "repair": ["Maintenance"],
  "decor": ["Furniture", "Home Supplies"],
  
  // Healthcare related
  "doctor": ["Doctor Visits"],
  "hospital": ["Doctor Visits"],
  "medicine": ["Medication"],
  "prescription": ["Medication"],
  "gym": ["Fitness"],
  "therapist": ["Mental Health"],
  "counseling": ["Mental Health"],
  
  // Entertainment related
  "netflix": ["Streaming Services"],
  "hulu": ["Streaming Services"],
  "spotify": ["Streaming Services"],
  "movie": ["Movies"],
  "concert": ["Concerts"],
  "show": ["Concerts", "Movies"],
  "game": ["Games"],
  "hobby": ["Hobbies"],
  
  // General
  "bill": ["Utilities", "Debt Payments"],
  "subscription": ["Subscriptions", "Streaming Services"],
  "gift": ["Gifts"],
  "donation": ["Charity"]
};

// Update the form schema to handle multiple categories
const expenseFormSchema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(parseFloat(val)), 'Must be a valid number'),
  description: z.string().optional(),
  // Change to array of strings
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  date: z.date({
    required_error: 'Please select a date',
  }),
});

// Define the type based directly on the schema without transformations
type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

// Default values with empty array for categories
const defaultValues: Partial<ExpenseFormValues> = {
  amount: '',
  description: '',
  categories: [],
  date: new Date(),
};

// Define type for category object
type CategoryItem = {
  value: string;
  label: string;
  group: string;
};

// Create flattened category list
const CATEGORY_ITEMS: CategoryItem[] = Object.entries(categories).flatMap(
  ([group, items]) => items.map(item => ({ 
    value: `${group}: ${item}`, 
    label: item, 
    group
  }))
);

// Enhance the filtering logic in your component
// This function can be used to search with synonym support
function searchWithSynonyms(query: string, categoryItems: CategoryItem[]): CategoryItem[] {
  if (!query.trim()) return categoryItems;
  
  const normalizedQuery = query.toLowerCase().trim();
  console.log("Normalized query:", normalizedQuery);
  
  // Direct matches in categories
  const directMatches = categoryItems.filter(item => 
    item.label.toLowerCase().includes(normalizedQuery) || 
    item.group.toLowerCase().includes(normalizedQuery) ||
    item.value.toLowerCase().includes(normalizedQuery)
  );
  
  // If we have direct matches, return them
  if (directMatches.length > 0) {
    console.log("Direct matches found:", directMatches.length);
    return directMatches;
  }
  
  // Check for synonym matches
  const synonymMatches = new Set<CategoryItem>();
  
  // Log for debugging
  console.log("Checking synonyms for:", normalizedQuery);
  console.log("Synonym keys:", Object.keys(categorySearchSynonyms));
  
  // Check if the query is a key in our synonym map
  if (categorySearchSynonyms[normalizedQuery]) {
    console.log(`Found synonym entry for "${normalizedQuery}":`, categorySearchSynonyms[normalizedQuery]);
    categorySearchSynonyms[normalizedQuery].forEach(synonym => {
      categoryItems.forEach(item => {
        // Broaden matching to ensure it catches relevant categories
        if (item.label.toLowerCase() === synonym.toLowerCase() || 
            item.value.toLowerCase().includes(synonym.toLowerCase()) ||
            synonym.toLowerCase().includes(item.label.toLowerCase())) {
          synonymMatches.add(item);
        }
      });
    });
  }
  
  // Also check partial matches in the synonym keys
  Object.entries(categorySearchSynonyms).forEach(([key, synonyms]) => {
    if (key.includes(normalizedQuery) || normalizedQuery.includes(key)) {
      console.log(`Found partial match in synonym key "${key}":`, synonyms);
      synonyms.forEach(synonym => {
        categoryItems.forEach(item => {
          if (item.label.toLowerCase() === synonym.toLowerCase() || 
              item.value.toLowerCase().includes(synonym.toLowerCase()) ||
              synonym.toLowerCase().includes(item.label.toLowerCase())) {
            synonymMatches.add(item);
          }
        });
      });
    }
  });
  
  // Special case handling for 'cafe'
  if (normalizedQuery === 'cafe' || normalizedQuery.includes('cafe')) {
    console.log("SPECIAL CASE: Searching for cafe");
    
    const coffeeShopItems = categoryItems.filter(item => 
      item.label.toLowerCase() === 'coffee shops' || 
      item.value.toLowerCase().includes('coffee shops')
    );
    
    console.log("Direct coffee shop matches:", coffeeShopItems);
    
    if (coffeeShopItems.length > 0) {
      return coffeeShopItems;
    }
  }
  
  const results = Array.from(synonymMatches);
  console.log("Synonym matches found:", results.length);
  return results;
}

export default function ExpenseForm({ initialData }: { initialData?: Expense }) {
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<CategoryItem[]>(CATEGORY_ITEMS);
  // Add state for tracking expense type
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  const [openCategory, setOpenCategory] = useState(false);
  
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues,
  });

  // Get selected categories from form
  const selectedCategoryItems = React.useMemo(() => 
    selectedCategories
      .filter(value => value !== undefined && value !== null) // Filter out any undefined/null values
      .map(value => {
        // Safely handle the split operation
        if (typeof value !== 'string') {
          console.warn('Invalid category value:', value);
          return { value: String(value), label: String(value), group: 'Unknown' };
        }
        
        const parts = value.split(':');
        const group = parts[0]?.trim() || '';
        const label = parts[1]?.trim() || group;
        
        return { value, label, group };
      }),
    [selectedCategories]
  );

  // Category input state
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Group categories by their group - also memoize this
  const groupedCategories = React.useMemo(() => {
    const grouped: Record<string, CategoryItem[]> = {};
    
    filteredCategories.forEach(item => {
      if (!grouped[item.group]) {
        grouped[item.group] = [];
      }
      grouped[item.group].push(item);
    });
    
    return grouped;
  }, [filteredCategories]);

  // Handle unselect (remove) a category
  const handleUnselect = React.useCallback((value: string) => {
    form.setValue(
      'categories',
      selectedCategories.filter(cat => cat !== value),
      { shouldValidate: true }
    );
  }, [form, selectedCategories]);

  // Handle selection of a category item
  const handleSelect = React.useCallback((value: string) => {
    if (!selectedCategories.includes(value)) {
      form.setValue(
        'categories',
        [...selectedCategories, value],
        { shouldValidate: true }
      );
    }
    setInputValue("");
  }, [form, selectedCategories]);

  // Handle keyboard navigation for removing items
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "" && selectedCategories.length > 0) {
            // Remove the last item when backspace is pressed with empty input
            handleUnselect(selectedCategories[selectedCategories.length - 1]);
          }
        }
        // Close on escape
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [handleUnselect, selectedCategories]
  );

  // Update the useEffect with correct dependencies and fix the synonym search logic
  useEffect(() => {
    // Log for debugging
    console.log("Searching for:", inputValue);
    
    if (inputValue.trim() === '') {
      // Show all categories except selected ones
      setFilteredCategories(
        CATEGORY_ITEMS.filter(item => 
          !selectedCategories.includes(item.value)
        )
      );
      return;
    }

    // Use our synonym-aware search function
    const searchResults = searchWithSynonyms(
      inputValue, 
      CATEGORY_ITEMS.filter(item => 
        !selectedCategories.includes(item.value)
      )
    );
    
    console.log("Search results:", searchResults);
    setFilteredCategories(searchResults);
  }, [inputValue, selectedCategories, CATEGORY_ITEMS]);

  useEffect(() => {
    if (initialData) {
      // Set transaction type based on amount sign
      setTransactionType(initialData.amount >= 0 ? 'income' : 'expense');
      
      // Initialize form values
      form.reset({
        amount: String(Math.abs(initialData.amount)), // Remove minus sign for display
        description: initialData.description || '',
        categories: initialData.category_details || [initialData.category],
        date: new Date(initialData.date),
      });
    }
  }, [initialData, form]);

  async function onSubmit(values: ExpenseFormValues) {
    setIsLoading(true);
    
    try {
      // Convert the amount string to a number for database storage
      let numericAmount = parseFloat(values.amount);
      
      // Apply negative sign for expenses (if not already negative)
      if (transactionType === 'expense' && numericAmount > 0) {
        numericAmount = -numericAmount;
      }
      
      // Ensure income is positive
      if (transactionType === 'income' && numericAmount < 0) {
        numericAmount = Math.abs(numericAmount);
      }
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to add an expense');
      }
      
      // Primary category is the first in the array
      const primaryCategory = values.categories.length > 0 
        ? values.categories[0].split(': ')[0] 
        : 'Other';
      
      const { error } = await supabase.from('expenses').insert({
        amount: numericAmount,
        description: values.description || null,
        category: primaryCategory,
        category_details: values.categories.length > 0 ? values.categories : null,
        date: values.date.toISOString(),
        user_id: user.id,
      });

      if (error) {
        throw error;
      }

      toast.success(`${transactionType === 'income' ? 'Income' : 'Expense'} added successfully`);
      router.push('/expenses');
      router.refresh();
    } catch (error) {
      const pgError = error as PostgrestError;
      toast.error(pgError.message || 'Failed to add transaction');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{initialData ? 'Edit' : 'Add New'} {transactionType === 'expense' ? 'Expense' : 'Income'}</h1>
      <p className="text-muted-foreground">
        Record a {initialData ? 'change to your' : 'new'} {transactionType === 'expense' ? 'expense' : 'income'} in your finance tracker
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs 
            defaultValue="expense" 
            className="w-full mb-6" 
            value={transactionType}
            onValueChange={(value) => setTransactionType(value as 'expense' | 'income')}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="expense" className="flex items-center gap-1">
                <ArrowDownRight className="h-3.5 w-3.5" />
                Expense
              </TabsTrigger>
              <TabsTrigger value="income" className="flex items-center gap-1">
                <ArrowUpRight className="h-3.5 w-3.5" />
                Income
              </TabsTrigger>
            </TabsList>
            
            {/* Set a fixed min-height for the content to prevent layout shifts */}
            <div className="min-h-[70px]">
              <TabsContent value="expense" className="mt-2 w-full">
                <p className="text-sm text-muted-foreground">
                  Record a payment or purchase. Expenses will be shown as negative values.
                </p>
              </TabsContent>
              
              <TabsContent value="income" className="mt-2 w-full">
                <p className="text-sm text-muted-foreground">
                  Record money received such as salary, gifts, or refunds. Income will be shown as positive values.
                </p>
              </TabsContent>
            </div>
          </Tabs>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                      <Input 
                        {...field} 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        placeholder="0.00"
                        className="pl-8" 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Categories</FormLabel>
                  <FormControl>
                    <div>
                      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                        <div className="flex flex-wrap gap-1">
                          {selectedCategoryItems.map((item) => (
                            <Badge key={item.value} variant="secondary">
                              <span className="font-medium mr-1">{item.group}:</span>
                              {item.label}
                              <button
                                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleUnselect(item.value);
                                  }
                                }}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                onClick={() => handleUnselect(item.value)}
                                type="button"
                              >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                              </button>
                            </Badge>
                          ))}
                          <input
                            type="text"
                            ref={inputRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onBlur={() => setTimeout(() => setOpenCategory(false), 200)}
                            onFocus={() => setOpenCategory(true)}
                            placeholder={selectedCategories.length > 0 ? "Add more categories..." : "Select categories..."}
                            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground border-none"
                          />
                        </div>
                      </div>
                      
                      {openCategory && inputValue.trim().length > 0 && (
                        <div className="relative mt-2">
                          <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                            {filteredCategories.length === 0 ? (
                              <div className="py-6 text-center text-sm text-muted-foreground">
                                No matching categories found
                              </div>
                            ) : (
                              <div className="py-2">
                                {filteredCategories.map(item => (
                                  <div
                                    key={item.value}
                                    onClick={() => {
                                      handleSelect(item.value);
                                      setInputValue("");
                                    }}
                                    className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-muted"
                                  >
                                    <span className="font-medium mr-1 opacity-70">{item.group}:</span> {item.label}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
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
                      {...field}
                      placeholder="Add details about this expense"
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : initialData 
              ? `Update ${transactionType === 'expense' ? 'Expense' : 'Income'}` 
              : `Add ${transactionType === 'expense' ? 'Expense' : 'Income'}`
            }
          </Button>
        </form>
      </Form>
    </div>
  );
} 