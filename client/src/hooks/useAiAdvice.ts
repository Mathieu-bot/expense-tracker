// hooks/useAIAdvice.ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useExpenses } from "./useExpenses";
import { useIncomes } from "./useIncomes";
import ai from "../lib/GenAI";
import monthBounds from "../utils/getMonthBounds";

type AdviceState = {
  data: string | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export const useAIAdvice = (): AdviceState => {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { start, end } = useMemo(() => monthBounds(), []);

  const { expenses, loading: expensesLoading } = useExpenses(start, end);
  const { incomes, loading: incomesLoading } = useIncomes(start, end);

  const hasFetchedRef = useRef(false);

  const prompt = useMemo(
    () => `
You are a budgeting coach. Using the JSON below, return ONE short message (max 60 words) with 2–3 concrete tips to improve cash flow THIS MONTH. Currency: Dollar ($).Also format correctly the number(ex: $10000 -> $10K).You can especially point out any areas that need improvement or an unnecessary expense but it's not obligatory. Give also advice about income and saving money

Constraints:
- Plain text only (no lists, no headings)
- Do NOT show totals, percentages, or category lists
- Friendly, direct, imperative tone

If data is missing, reply exactly:
Add at least one income and one expense to generate useful advice.

Data:
incomes: ${JSON.stringify(incomes ?? [])}
expenses: ${JSON.stringify(expenses ?? [])}
`,
    [incomes, expenses]
  );

  const fetchAdvice = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { text } = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
      if (!text) throw new Error("AI returned an empty response");
      setData(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown AI error");
      setData(null);
      console.error("[useAIAdvice]", err);
    } finally {
      setLoading(false);
    }
  }, [prompt]);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    if (!expensesLoading && !incomesLoading) {
      hasFetchedRef.current = true;
      fetchAdvice();
    }
  }, [expensesLoading, incomesLoading, fetchAdvice]);

  return { data, loading, error, refetch: fetchAdvice };
};
