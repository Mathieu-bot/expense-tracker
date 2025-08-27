import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Layout from "./Layout";

type Row = { month: string; spending: number; income: number };

const monthlyData: Row[] = [
  { month: "Avril", spending: 120000, income: 180000 },
  { month: "Mai", spending: 95000, income: 165000 },
  { month: "Juin", spending: 110000, income: 170000 },
  { month: "Juil", spending: 130000, income: 190000 },
];

const COLORS = {
  spending: "#FF8042",
  income: "#00C49F",
};

const fmtShort = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `${(n / 1_000).toFixed(1)}k`
    : `${n}`;
const fmtAr = (n: number) => `Ar ${n.toLocaleString("fr-MG")}`;

export function MonthlyBarChart() {
  const [show, setShow] = useState({ spending: true, income: true });

  const totals = useMemo(
    () => ({
      spending: monthlyData.reduce((a, c) => a + c.spending, 0),
      income: monthlyData.reduce((a, c) => a + c.income, 0),
    }),
    []
  );

  return (
    <Layout title="Monthly Spending vs Income" graphClassName="h-[300px]">
      {/* Toggles */}
      <div className="flex items-center justify-end gap-2 px-2 pb-2">
        <button
          onClick={() => setShow((s) => ({ ...s, spending: !s.spending }))}
          className={`text-xs px-2 py-1 rounded-md transition ${
            show.spending
              ? "bg-white text-slate-900"
              : "bg-white/10 text-white/80 hover:text-white"
          }`}
        >
          Spending • {fmtShort(totals.spending)}
        </button>
        <button
          onClick={() => setShow((s) => ({ ...s, income: !s.income }))}
          className={`text-xs px-2 py-1 rounded-md transition ${
            show.income
              ? "bg-white text-slate-900"
              : "bg-white/10 text-white/80 hover:text-white"
          }`}
        >
          Income • {fmtShort(totals.income)}
        </button>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData} barCategoryGap="22%" barGap={2}>
          {/* Gradients */}
          <defs>
            <linearGradient id="gradSpending" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.spending} stopOpacity={0.9} />
              <stop
                offset="100%"
                stopColor={COLORS.spending}
                stopOpacity={0.3}
              />
            </linearGradient>
            <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.income} stopOpacity={0.9} />
              <stop offset="100%" stopColor={COLORS.income} stopOpacity={0.3} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.12)"
          />
          <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.8)" }} />
          <YAxis
            tick={{ fill: "rgba(255,255,255,0.8)" }}
            tickFormatter={(v: number) => `Ar ${fmtShort(v)}`}
            allowDecimals={false}
            domain={["auto", "auto"]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0b0f1a",
              border: "none",
              borderRadius: 8,
              color: "#fff",
            }}
            formatter={(v: any, name: string) => [
              fmtAr(Number(v)),
              name === "spending" ? "Spending" : "Income",
            ]}
          />

          {show.spending && (
            <Bar
              dataKey="spending"
              name="Spending"
              fill="url(#gradSpending)"
              radius={[8, 8, 0, 0]}
            />
          )}
          {show.income && (
            <Bar
              dataKey="income"
              name="Income"
              fill="url(#gradIncome)"
              radius={[8, 8, 0, 0]}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </Layout>
  );
}
