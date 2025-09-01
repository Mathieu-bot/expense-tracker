export interface Income {
  income_id: number;
  amount: number;
  date: string;
  source: string;
  description?: string;
  creation_date: string;
  user_id: number;
}

export interface IncomeFormData {
  amount: number;
  date: string;
  source: string;
  description: string;
}

export interface CreateIncomeRequest {
  amount: number;
  date: string;
  source: string;
  description?: string;
}

export interface UpdateIncomeRequest {
  amount?: number;
  date?: string;
  source?: string;
  description?: string;
}
