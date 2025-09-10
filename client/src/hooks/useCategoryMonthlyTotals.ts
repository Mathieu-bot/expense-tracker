import { useCallback, useEffect, useMemo, useState } from "react";
import { useExpenses } from "../hooks/useExpenses";
import type { Expense } from "../types/Expense";

export function useCategoryMonthlyTotals() {
  const fmtLocal = useCallback((d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }, []);

  const [range, setRange] = useState(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { start: fmtLocal(start), end: fmtLocal(end) };
  });

  // update at next month (local time)
  useEffect(() => {
    const now = new Date();
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
    const ms = nextMonthStart.getTime() - now.getTime();
    const id = setTimeout(() => {
      const start = fmtLocal(new Date(nextMonthStart));
      const end = fmtLocal(new Date(nextMonthStart.getFullYear(), nextMonthStart.getMonth() + 1, 0));
      setRange({ start, end });
    }, Math.max(ms, 0));
    return () => clearTimeout(id);
  }, [fmtLocal, range.start, range.end]);

  const { expenses, refetch } = useExpenses(range.start, range.end);

  useEffect(() => {
    const onChanged = () => { void refetch(); };
    window.addEventListener("expenses:changed", onChanged);
    return () => window.removeEventListener("expenses:changed", onChanged);
  }, [refetch]);

  const totalsThisMonth = useMemo(() => {
    const map: Record<number, number> = {};
    for (const e of expenses as Expense[]) {
      const cid = e.categoryId as number | undefined;
      if (cid == null) continue;
      const amt = Number(e.amount ?? 0);
      map[cid] = (map[cid] ?? 0) + (isFinite(amt) ? amt : 0);
    }
    return map;
  }, [expenses]);

  return { totalsThisMonth };
}
