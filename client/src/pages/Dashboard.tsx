import { useEffect, useState } from "react";
import { type PieItem } from "../components/dashboard/PieGraph";
import {
  MonthlyBarChart,
  type Row,
} from "../components/dashboard/MonthlyBarchart";
import { Percent, ReceiptCent, Wallet } from "lucide-react";
import PieGraph from "../components/dashboard/PieGraph";
import { useIncomes } from "../hooks/useIncomes";
import { computeValueTotal } from "../utils/computeValueTotal";
import MiniStatCard from "../components/dashboard/DisplayCard";

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
  const { incomes, loading, error } = useIncomes();

  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [sold, setSold] = useState<number>(0);

  const toDisplay = [
    { label: "Income", value: totalIncome, icon: Wallet, deltaPct: 6.4 },
    {
      label: "Expenses",
      value: totalExpense,
      icon: ReceiptCent,
      deltaPct: -0.11,
    },
    { label: "Sold", value: sold, icon: Percent, deltaPct: -0.8 },
  ];

  useEffect(() => {
    if (!loading && incomes) {
      const incomeTotal = computeValueTotal(incomes);
      setTotalIncome(incomeTotal);

      /*
        TODO: Fetch real expenses and compute real total expense  
      */

      const expenseTotal = 50000;
      setTotalExpense(expenseTotal);

      setSold(incomeTotal - expenseTotal);
    }
  }, [loading, incomes]);

  const currentPieData =
    activeGraph === "expenses" ? expensesByCat : incomeByCat;
  const currentTitle =
    activeGraph === "expenses"
      ? "Expenses — by category"
      : "Income — by category";

  return (
    <div className="min-w-screen h-screen pt-26 pl-22 py-5 pr-10 grid grid-cols-3 z-30 gap-5">
      <div className="col-span-2 flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {toDisplay.map((item, idx) => (
            <MiniStatCard key={idx} {...item} />
          ))}
        </div>
        <MonthlyBarChart data={monthlyData} />
      </div>

      <div className="col-span-1 flex flex-col items-center gap-4 w-full bg-primary/30 py-2 px-5 rounded-lg">
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
