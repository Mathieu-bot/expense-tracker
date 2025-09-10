import { useEffect, useState } from "react";
import { DefaultService } from "../api";
import { type Expense } from "../types/Expense";

export const useExpenseById = (id: string) => {
  const [data, setData] = useState<Expense | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await DefaultService.getExpenses1(id);
        setData(res.data);
      } catch (error) {
        setError("Error:" + error);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return { data, loading, error };
};
