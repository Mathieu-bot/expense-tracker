import { useEffect, useMemo, useState } from "react";
import { MonthlyBarChart } from "../components/dashboard/MonthlyBarchart";
import { Percent, ReceiptCent, Wallet, X } from "lucide-react";
import PieGraph from "../components/dashboard/PieGraph";
import { useIncomes } from "../hooks/useIncomes";
import { computeValueTotal } from "../utils/computeValueTotal";
import MiniStatCard from "../components/dashboard/DisplayCard";
import { useToast } from "../ui";
import {
  useLastSixthMonthSummary,
  useMonthlySummary,
  useSummaryAlert,
} from "../hooks/useSummary";
import SummaryAlert from "../components/dashboard/SummaryAlert";
import { useExpenses } from "../hooks/useExpenses";
import { GlassDatePicker } from "../components/Income";
import { computeEvolutionBetweenValues } from "../utils/evolutionBetweenValues";

function Dashboard() {
  const { data: summaryAlert } = useSummaryAlert();
  const [alertOpen, setAlertOpen] = useState<boolean>(true);
  const { data: lastSixthMonthSummary } = useLastSixthMonthSummary();
  const now = new Date();

  const [startDate, setStartDate] = useState<string>(
    new Date(now.getFullYear(), now.getMonth(), 1).toLocaleDateString("fr-CA", {
      year: "numeric",
      day: "numeric",
      month: "numeric",
    })
  );
  const [endDate, setEndDate] = useState<string>(
    new Date(now.getFullYear(), now.getMonth() + 1, 0).toLocaleDateString(
      "fr-CA",
      {
        year: "numeric",
        day: "numeric",
        month: "numeric",
      }
    )
  );
  const [filterWasUsed, setFilterWasUsed] = useState<boolean>(false);

  /* Expense and incomes */
  const { incomes, loading, error } = useIncomes(startDate, endDate);
  const { expenses, loading: expensesLoading } = useExpenses(
    startDate,
    endDate
  );

  /* Last month stat for the comparison */
  const { data: lastMonthSummary } = useMonthlySummary(
    new Date(new Date().getFullYear(), new Date().getMonth())
      .toISOString()
      .slice(0, 7)
  );
  const { data: thisMonthSummary } = useMonthlySummary(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1)
      .toISOString()
      .slice(0, 7)
  );

  const toast = useToast();

  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [sold, setSold] = useState<number>(0);

  const toDisplay = useMemo(
    () => [
      {
        label: "Income",
        value: totalIncome,
        icon: Wallet,
        deltaPct:
          computeEvolutionBetweenValues(
            lastMonthSummary?.totalIncome ?? 0,
            thisMonthSummary?.totalIncome ?? 0
          ) ?? 0,
      },
      {
        label: "Expenses",
        value: totalExpense,
        icon: ReceiptCent,
        deltaPct:
          computeEvolutionBetweenValues(
            lastMonthSummary?.totalExpense ?? 0,
            thisMonthSummary?.totalExpense ?? 0
          ) ?? 0,
        customDeltaColor:
          computeEvolutionBetweenValues(
            lastMonthSummary?.totalExpense ?? 0,
            thisMonthSummary?.totalExpense ?? 0
          )! >= 0
            ? "text-rose-400"
            : null,
        customBgColor:
          computeEvolutionBetweenValues(
            lastMonthSummary?.totalExpense ?? 0,
            thisMonthSummary?.totalExpense ?? 0
          )! >= 0
            ? "bg-rose-500/20"
            : null,
      },

      {
        label: "Sold",
        value: sold,
        icon: Percent,
        deltaPct:
          computeEvolutionBetweenValues(
            lastMonthSummary?.netBalance ?? 0,
            thisMonthSummary?.netBalance ?? 0
          ) ?? 0,
      },
    ],
    [
      lastMonthSummary?.netBalance,
      lastMonthSummary?.totalExpense,
      lastMonthSummary?.totalIncome,
      sold,
      thisMonthSummary?.netBalance,
      thisMonthSummary?.totalExpense,
      thisMonthSummary?.totalIncome,
      totalExpense,
      totalIncome,
    ]
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

  if (error) {
    toast.error("Failed to load incomes: " + error, {
      autoHideDuration: 2,
    });
  }

  /* Event Handler */
  const handleDateChange = (e: Date, field: string) => {
    setFilterWasUsed(true);
    switch (field) {
      case "start": {
        const date = new Date(e as Date).toLocaleDateString("fr-CA", {
          year: "numeric",
          day: "numeric",
          month: "numeric",
        });
        const newStart = new Date(date).toISOString().split("T")[0];
        if (new Date(newStart) > new Date(endDate)) {
          toast.error("Start date should be before end date");
          return;
        }
        setStartDate(date);
        break;
      }
      case "end": {
        const date = new Date(e as Date).toLocaleDateString("fr-CA", {
          year: "numeric",
          day: "numeric",
          month: "numeric",
        });

        const newEnd = new Date(date).toISOString().split("T")[0];
        if (new Date(newEnd) < new Date(startDate)) {
          toast.error("End date should be after start date");
          return;
        }
        setEndDate(date);
        break;
      }
    }
  };

  const resetFilter = () => {
    setStartDate(
      new Date(now.getFullYear(), now.getMonth(), 1).toLocaleDateString(
        "fr-CA",
        {
          year: "numeric",
          day: "numeric",
          month: "numeric",
        }
      )
    );
    setEndDate(
      new Date(now.getFullYear(), now.getMonth() + 1, 0).toLocaleDateString(
        "fr-CA",
        {
          year: "numeric",
          day: "numeric",
          month: "numeric",
        }
      )
    );
    setFilterWasUsed(false);
  };

  return (
    <div className="min-w-screen max-h-screen pt-22 md:pl-30 md:pr-22 flex flex-col items-center gap-10 md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 z-30">
      {summaryAlert.alert && (
        <SummaryAlert
          alert={summaryAlert.alert}
          message={summaryAlert.message}
          open={alertOpen}
          setIsOpen={setAlertOpen}
        />
      )}
      <div className="col-span-3 flex flex-col gap-5">
        {/* FILTER */}
        <div className="flex items-center text-white justify-between">
          <h1 className="text-4xl pl-10 font-semibold">Filters</h1>
          <div className="flex gap-5 items-center">
            <GlassDatePicker
              value={new Date(startDate)}
              onChange={(e) => handleDateChange(e!, "start")}
              label="Start Date"
              size="small"
            />
            <GlassDatePicker
              value={new Date(endDate)}
              onChange={(e) => handleDateChange(e!, "end")}
              label="End Date"
              size="small"
            />
            <button
              className="flex items-center gap-2 px-4 py-2 h-fit rounded-sm bg-red-700 outline-none"
              onClick={resetFilter}
            >
              <X /> Reset
            </button>
          </div>
        </div>
        {/* CARD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {toDisplay.map((item, idx) => (
            <MiniStatCard key={idx} {...item} filterWasUsed={filterWasUsed} />
          ))}
        </div>

        {/* BARCHART */}
        <MonthlyBarChart data={lastSixthMonthSummary} />
      </div>
      {/* PIE */}
      <div className="lg:col-span-1 flex flex-col md:h-full items-center gap-4 w-full md:bg-white/5 backdrop-blur-2xl py-2 px-5 rounded-lg">
        <PieGraph title={"Expense Overview"} data={expenses} />
      </div>
    </div>
  );
}

export default Dashboard;
