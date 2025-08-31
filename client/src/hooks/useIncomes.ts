import { useState, useEffect, useCallback } from "react";
import type { Income } from "../types/Income";
import { IncomeService } from "../services/IncomeService";

export const useIncomes = (startDate?: string, endDate?: string) => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncomes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await IncomeService.getIncomes(startDate, endDate);
      setIncomes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch incomes");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchIncomes();
  }, [fetchIncomes]);

  const refetch = useCallback(async () => {
    await fetchIncomes();
  }, [fetchIncomes]);

  return { incomes, loading, error, refetch };
};
