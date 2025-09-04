import { useState } from "react";
import StatCard, {
  type MiniStatItem,
} from "../components/dashboard/DisplayCard";
import { type PieItem } from "../components/dashboard/PieGraph";
import {
  MonthlyBarChart,
  type Row,
} from "../components/dashboard/MonthlyBarchart";
import { Percent, ReceiptCent, Wallet } from "lucide-react";
import PieGraph from "../components/dashboard/PieGraph";

const mockTotals: MiniStatItem[] = [
  { label: "Revenue", value: 82450, icon: Wallet, deltaPct: 6.4 },
  { label: "Expenses", value: 24780, icon: ReceiptCent, deltaPct: -0.11 },
  {
    label: "Sold",
    value: 65,
    icon: Percent,
    deltaPct: -0.8,
  },
];

const monthlyData: Row[] = [
  { month: "Avril", spending: 120000, income: 180000 },
  { month: "Mai", spending: 95000, income: 165000 },
  { month: "Juin", spending: 110000, income: 170000 },
  { month: "Juil", spending: 130000, income: 190000 },
];
const expensesByCat: PieItem[] = [
  { name: "Food", value: 45000, color: "#FF8042" },
  { name: "Transport", value: 20000, color: "#0088FE" },
  { name: "Shopping", value: 30000, color: "#00C49F" },
  { name: "Bills", value: 25000, color: "#FFBB28" },
  { name: "Entertainment", value: 15000, color: "#AF19FF" },
];

const incomeByCat: PieItem[] = [
  { name: "Salary", value: 120000, color: "#22c55e" },
  { name: "Freelance", value: 65000, color: "#06b6d4" },
  { name: "Investments", value: 30000, color: "#a78bfa" },
  { name: "Other", value: 15000, color: "#f472b6" },
];

function Dashboard() {
  const [activeGraph, setActiveGraph] = useState<"expenses" | "income">(
    "expenses"
  );

  const currentPieData =
    activeGraph === "expenses" ? expensesByCat : incomeByCat;
  const currentTitle =
    activeGraph === "expenses"
      ? "Expenses — by category"
      : "Income — by category";

  return (
    <div className="min-w-screen h-screen pt-26 py-5  md:pr-10 md:pl-22 flex flex-col items-center gap-10 md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 z-30 ">
      <div className="md:col-span-2 w-full flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-10">
          {mockTotals.map((item) => (
            <StatCard key={item.label} {...item} />
          ))}
        </div>
        <div className="mr-5">
          <MonthlyBarChart data={monthlyData} />
        </div>
      </div>

      <div className="lg:col-span-1 flex flex-col items-center gap-4 w-full md:bg-primary/30 py-2 px-5 rounded-lg">
        <div className="rounded-xl bg-white/5 p-1 w-full max-w-xs ">
          <div className="grid grid-cols-2 bg-white/5 rounded-lg p-1 gap-5">
            <button
              onClick={() => setActiveGraph("expenses")}
              className={`text-sm rounded-md py-1.5 transition outline-none
                ${
                  activeGraph === "expenses"
                    ? "bg-white text-slate-900"
                    : "text-white/80 hover:text-white"
                }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setActiveGraph("income")}
              className={`text-sm rounded-md py-1.5 transition outline-none
                ${
                  activeGraph === "income"
                    ? "bg-white text-slate-900"
                    : "text-white/80 hover:text-white"
                }`}
            >
              Income
            </button>
          </div>
        </div>
        <PieGraph title={currentTitle} data={currentPieData} />
      </div>
    </div>
  );
}

export default Dashboard;
