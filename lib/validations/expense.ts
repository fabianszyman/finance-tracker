import { z } from "zod";

// Define the expense form schema
export const expenseFormSchema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(parseFloat(val)), 'Must be a valid number'),
  description: z.string().optional(),
  // For multiple categories
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  date: z.date({
    required_error: 'Please select a date',
  }),
});

// For single category selection (used in edit form)
export const singleCategoryExpenseFormSchema = z.object({
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

// Type definition based on the schema
export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;
export type SingleCategoryExpenseFormValues = z.infer<typeof singleCategoryExpenseFormSchema>;

// Column mapping type for CSV import
export type ColumnMapping = {
  amount: string;
  description: string;
  category: string;
  date: string;
}; 