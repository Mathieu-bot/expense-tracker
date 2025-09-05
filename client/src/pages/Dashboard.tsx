import { useEffect, useMemo, useState } from "react";
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
import { useSummaryAlert } from "../hooks/useSummaryAlert";
import SummaryAlert from "../components/dashboard/SummaryAlert";
import { useExpenses } from "../hooks/useExpenses";

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
  const { data: summaryAlert } = useSummaryAlert();
  const [alertOpen, setAlertOpen] = useState<boolean>(true);

  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const { incomes, loading, error } = useIncomes(startDate, endDate);
  const {
    expenses,
    loading: expensesLoading,
    error: expensesError,
  } = useExpenses();

  const toast = useToast();

  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [sold, setSold] = useState<number>(0);

  const toDisplay = useMemo(
    () => [
      { label: "Income", value: totalIncome, icon: Wallet },
      { label: "Expenses", value: totalExpense, icon: ReceiptCent },
      { label: "Sold", value: sold, icon: Percent },
    ],
    [totalIncome, totalExpense, sold]
  );

  /* Totals */
  useEffect(() => {
    if (!loading && incomes && !expensesLoading && expenses) {
      const incomeTotal = computeValueTotal(incomes);
      const expenseTotal =
        expensesLoading || !expenses ? 0 : computeValueTotal(expenses);
      setTotalIncome(incomeTotal);
      setTotalExpense(expenseTotal);
      setSold(incomeTotal - expenseTotal);
    }
  }, [loading, incomes, expenses, expensesLoading]);

  if (error || expensesError) {
    toast.error("Failed to load incomes: " + error);
  }
  if (loading || expensesLoading) return <div>Loading...</div>;
  return (
    <div className="min-w-screen h-screen pt-24 pl-22 py-5 pr-10 grid grid-cols-4 z-30 gap-5">
      {summaryAlert.alert && (
        <SummaryAlert
          alert={summaryAlert.alert}
          message={summaryAlert.message}
          open={alertOpen}
          setIsOpen={setAlertOpen}
        />
      )}
      <div className="col-span-3 flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {toDisplay.map((item, idx) => (
            <MiniStatCard key={idx} {...item} />
          ))}
        </div>
        <div className="flex flex-col">
          <div className="flex justify-end text-white">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value.split(" ")[0])}
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value.split(" ")[0])}
            />
          </div>

          <MonthlyBarChart data={monthlyData} />
        </div>
      </div>

      <div className="col-span-1 flex flex-col items-center gap-4 w-full bg-primary/30 py-2 px-5 rounded-lg">
        <PieGraph title={"Expense Overview"} data={expensesByCat} />
      </div>
    </div>
  );
}

export default Dashboard;
