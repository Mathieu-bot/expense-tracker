import { useState, useEffect } from "react";
import type { Income } from "../types/Income";
import { IncomeService } from "../services/IncomeService";

export const useIncomes = (startDate?: string, endDate?: string) => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await IncomeService.getIncomes(startDate, endDate);
        setIncomes(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch incomes"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIncomes();
  }, [startDate, endDate]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await IncomeService.getIncomes(startDate, endDate);
      setIncomes(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to refetch incomes"
      );
    } finally {
      setLoading(false);
    }
  };

  return { incomes, loading, error, refetch };
};


