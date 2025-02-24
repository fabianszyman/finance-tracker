export type Database = {
  public: {
    Tables: {
      expenses: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          description: string;
          category: string;
          date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          amount: number;
          description?: string;
          category?: string;
          date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          description?: string;
          category?: string;
          date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}; 