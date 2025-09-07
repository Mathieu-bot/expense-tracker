import { useState, useMemo, useCallback } from "react";
import type { Income } from "../types/Income";
import { validateDateRange } from "../utils/validators";

interface UseIncomeFiltersProps {
  incomes: Income[];
}

export const useIncomeFilters = ({ incomes }: UseIncomeFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });
  const [dateError, setDateError] = useState<string | null>(null);

  const handleStartDateChange = useCallback(
    (date: Date | null) => {
      const newStart = date ? date.toISOString().split("T")[0] : undefined;
      const err = validateDateRange(
        newStart,
        dateRange.end?.toISOString().split("T")[0]
      );
      setDateError(err);
      setDateRange((prev) => ({ ...prev, start: date }));
    },
    [dateRange.end]
  );

  const handleEndDateChange = useCallback(
    (date: Date | null) => {
      const newEnd = date ? date.toISOString().split("T")[0] : undefined;
      const err = validateDateRange(
        dateRange.start?.toISOString().split("T")[0],
        newEnd
      );
      setDateError(err);
      setDateRange((prev) => ({ ...prev, end: date }));
    },
    [dateRange.start]
  );

  const clearDateFilter = useCallback(() => {
    setDateRange({ start: null, end: null });
    setDateError(null);
  }, []);

  const toISODateString = (date: Date | string): string => {
    const d = new Date(date);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const filteredAndSortedIncomes = useMemo(() => {
    const filtered = incomes.filter((income) => {
      const matchesSearch =
        income.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (income.description &&
          income.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const incomeDateStr = toISODateString(income.date);

      const startDateStr = dateRange.start
        ? toISODateString(dateRange.start)
        : null;
      const endDateStr = dateRange.end ? toISODateString(dateRange.end) : null;

      const matchesDateRange =
        (!startDateStr || incomeDateStr >= startDateStr) &&
        (!endDateStr || incomeDateStr <= endDateStr);

      return matchesSearch && matchesDateRange;
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "recent" ? dateB - dateA : dateA - dateB;
    });
  }, [incomes, searchQuery, sortOrder, dateRange.start, dateRange.end]);

  const totalIncome = useMemo(
    () => filteredAndSortedIncomes.reduce((sum, item) => sum + item.amount, 0),
    [filteredAndSortedIncomes]
  );

  const totalIncomeThisMonth = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return filteredAndSortedIncomes.reduce((sum, income) => {
      const incomeDate = new Date(income.date);
      if (
        incomeDate.getMonth() === currentMonth &&
        incomeDate.getFullYear() === currentYear
      ) {
        return sum + income.amount;
      }
      return sum;
    }, 0);
  }, [filteredAndSortedIncomes]);

  return {
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    dateRange,
    dateError,
    handleStartDateChange,
    handleEndDateChange,
    clearDateFilter,
    filteredAndSortedIncomes,
    totalIncome,
    totalIncomeThisMonth,
    formatDate,
  };
};
