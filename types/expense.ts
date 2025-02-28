export type Expense = {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  category: string;
  category_details: string[] | null;
  date: string;
  created_at: string;
  updated_at: string;
};

export type NewExpense = Omit<Expense, 'id' | 'user_id' | 'created_at' | 'updated_at'>; 