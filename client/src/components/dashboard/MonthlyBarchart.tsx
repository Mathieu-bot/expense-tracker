import React, { useState, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "../../utils/formatters";
import { CustomTooltip } from "./Tooltip";

const COLORS = {
  spending: "rgba(244, 63, 94, 0.65)",
  income: "rgba(16, 185, 129, 0.65)",
};

interface MonthlyBarChartProps {
  data: { month: string; totalExpense: number; totalIncome: number }[];
}

const MonthlyBarChart: React.FC<MonthlyBarChartProps> = ({ data }) => {
  const [visibleBars, setVisibleBars] = useState({
    spending: true,
    income: true,
  });

  const toggleBar = (bar: "spending" | "income") => {
    setVisibleBars((prev) => ({ ...prev, [bar]: !prev[bar] }));
  };

  const totals = useMemo(
    () => ({
      spending: data.reduce((a, c) => a + c.totalExpense, 0),
      income: data.reduce((a, c) => a + c.totalIncome, 0),
    }),
    [data]
  );

  return (
    <div className="bg-white/80 dark:bg-gradient-to-br dark:bg-transparent dark:from-primary-light/10 dark:to-primary-dark/10 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 w-full h-[380px] flex flex-col">
      <div className="relative mt-3 ml-3 flex mb-6">
        <div className="flex border border-gray-400/30 dark:border-gray-700 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleBar("spending")}
            style={{
              backgroundColor: visibleBars.spending
                ? COLORS.spending
                : "transparent",
              color: visibleBars.spending ? "#fff" : "",
            }}
            className={`px-6 py-2 font-medium transition-all border-none duration-300 flex items-center gap-2 ${
              !visibleBars.spending && "text-gray-600 dark:text-gray-300"
            }`}
            onMouseEnter={(e) => {
              if (!visibleBars.spending) {
                (e.currentTarget as HTMLButtonElement).style.color =
                  COLORS.spending;
              }
            }}
            onMouseLeave={(e) => {
              if (!visibleBars.spending) {
                (e.currentTarget as HTMLButtonElement).style.color = "";
              }
            }}
          >
            <span>Expense</span>
            <span className="text-xs opacity-80">
              {formatCurrency(totals.spending)}
            </span>
          </button>

          <button
            onClick={() => toggleBar("income")}
            style={{
              backgroundColor: visibleBars.income
                ? COLORS.income
                : "transparent",
              color: visibleBars.income ? "#fff" : "",
            }}
            className={`px-6 py-2 font-medium transition-all border-none duration-300 flex items-center gap-2 ${
              !visibleBars.income && "text-gray-600 dark:text-gray-300"
            }`}
            onMouseEnter={(e) => {
              if (!visibleBars.income) {
                (e.currentTarget as HTMLButtonElement).style.color =
                  COLORS.income;
              }
            }}
            onMouseLeave={(e) => {
              if (!visibleBars.income) {
                (e.currentTarget as HTMLButtonElement).style.color = "";
              }
            }}
          >
            <span>Income</span>
            <span className="text-xs opacity-80">
              {formatCurrency(totals.income)}
            </span>
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30 }}
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-40" />
          <XAxis
            dataKey="month"
            tick={{ fill: "currentColor" }}
            className="text-gray-700 dark:text-gray-300"
          />
          <YAxis
            tick={{ fill: "currentColor" }}
            className="text-gray-700 dark:text-gray-300"
          />
          <Tooltip content={<CustomTooltip />} animationDuration={300} />
          {visibleBars.spending && (
            <Bar
              dataKey="totalExpense"
              name="Expense"
              fill={COLORS.spending}
              radius={[8, 8, 0, 0]}
              barSize={40}
            />
          )}
          {visibleBars.income && (
            <Bar
              dataKey="totalIncome"
              name="Income"
              fill={COLORS.income}
              radius={[8, 8, 0, 0]}
              barSize={40}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyBarChart;
