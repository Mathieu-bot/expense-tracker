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
import { useToast } from "../ui";

const monthlyData: Row[] = [
  { month: "Avril", spending: 120000, income: 180000 },
  { month: "Mai", spending: 95000, income: 165000 },
  { month: "Juin", spending: 110000, income: 170000 },
  { month: "Juil", spending: 130000, income: 190000 },
];
const expensesByCat: PieItem[] = [
  { name: "Food", value: 45000 },
  { name: "Transport", value: 20000 },
  { name: "Shopping", value: 30000 },
  { name: "Bills", value: 25000 },
  { name: "Entertainment", value: 15000 },
];

function Dashboard() {
  const { incomes, loading, error } = useIncomes();
  const toast = useToast();

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

  if (error) {
    toast.error("Failed to load incomes: " + error);
  }
  return (
    <div className="min-w-screen h-screen pt-26 pl-22 py-5 pr-10 grid grid-cols-4 z-30 gap-5">
      <div className="col-span-3 flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {toDisplay.map((item, idx) => (
            <MiniStatCard key={idx} {...item} />
          ))}
        </div>
        <MonthlyBarChart data={monthlyData} />
      </div>

      <div className="col-span-1 flex flex-col items-center gap-4 w-full bg-primary/30 py-2 px-5 rounded-lg">
        <PieGraph title={"Expense Overview"} data={expensesByCat} />
      </div>
    </div>
  );
}

export default Dashboard;
