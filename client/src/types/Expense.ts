export type ExpenseType = "one-time" | "recurring";

export type Category = {
  category_id: number;
  category_name: string;
};

export type Expense = {
  expense_id: number;
  amount: number;
  description: string | null;
  type: ExpenseType;
  date: string | null; // for one-time
  startDate: string | null; // for recurring
  endDate: string | null; // for recurring
  last_processed: string | null;
  user_id: number;
  categoryId: number;
  category?: Category;
  receipt_url: string | null;
  receipt_mime: string | null;
  receipt_size: number | null;
};

export type CreateExpenseRequest = {
  amount: number | string;
  date?: string; // required if one-time
  categoryId: string; // API expects string
  description?: string;
  type?: ExpenseType;
  startDate?: string; // required if recurring
  endDate?: string;
  receipt: File;
  receipt_url? : string | null
};

export type UpdateExpenseRequest = Partial<
  Omit<CreateExpenseRequest, "categoryId">
> & {
  categoryId?: string;
};
