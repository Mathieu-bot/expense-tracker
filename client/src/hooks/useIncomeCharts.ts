import { useMemo } from "react";
import type { Income } from "../types/Income";
import { formatDate } from "../utils/formatters";

interface UseIncomeChartsProps {
  incomes: Income[];
}

export const useIncomeCharts = ({ incomes }: UseIncomeChartsProps) => {

  const lineChartData = useMemo(() => {

    //newest incomes show first
    const sortedIncomes = [...incomes].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    //shows only last 10 incomes
    const lastTenIncomes = sortedIncomes.slice(0, 10);

    const chronologicalIncomes = [...lastTenIncomes].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let cumulative = 0;
    return chronologicalIncomes.map((income, index) => {
      cumulative += income.amount;
      return {
        date: `${formatDate(income.date)}-${index}`,
        fullDate: income.date,
        amount: income.amount,
        source: income.source,
        cumulativeAmount: cumulative,
        id: `${income.date}-${income.source}-${income.amount}-${index}`, 
      };
    });
  }, [incomes]);


  return {
    lineChartData
  };
};
