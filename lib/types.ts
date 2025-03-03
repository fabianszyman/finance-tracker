export interface Expense {
  id: string;
  amount: number;
  description: string | null | undefined;
  category: string;
  category_details: string[] | null;
  date: string;
  created_at?: string;
  user_id?: string;
} 