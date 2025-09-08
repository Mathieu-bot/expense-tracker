import { useState, useEffect, useCallback } from "react";
import { DefaultService } from "../api";
import type { Category } from "../types/Auth";

type Scope = 'user' | 'all' | 'global';

export const useCategories = (options?: { scope?: Scope }) => {
  const scope: Scope = options?.scope ?? 'user';
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = (await DefaultService.getCategories()) as Category[];
      const list = Array.isArray(data) ? data : [];
      let next: Category[] = list;
      if (scope === 'user') {
        next = list.filter((c) => c.user_id != null);
      } else if (scope === 'global') {
        next = list.filter((c) => c.user_id == null);
      }
      setCategories(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't load your categories. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [scope]);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const refetch = useCallback(async () => {
    await fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch };
};
