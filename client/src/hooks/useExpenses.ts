import { useState, useEffect, useCallback } from "react";
import type { Expense } from "../types/Expense";
import { ExpenseService } from "../services/ExpenseService";

export const useExpenses = (
  startDate?: string,
  endDate?: string,
  category?: string,
  type?: "recurring" | "one-time"
) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ExpenseService.getExpenses(
        startDate,
        endDate,
        category,
        type
      );
      setExpenses(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch expenses"
      );
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, category, type]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const refetch = useCallback(async () => {
    await fetchExpenses();
  }, [fetchExpenses]);

  return { expenses, loading, error, refetch };
};
