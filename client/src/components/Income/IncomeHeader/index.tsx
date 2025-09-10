import { Plus } from "lucide-react";
import { Button } from "../../../ui";
import { MoreActionsDropdown } from "../IncomeFilters/MoreActionsDropdown";
import { TotalIncome } from "./TotalIncome";
import type { Income } from "../../../types/Income";

interface IncomeHeaderProps {
  totalIncome: number;
  onNewIncome: () => void;
  onExport: (startDate?: string, endDate?: string) => Promise<boolean>;
  onPreview: (startDate?: string, endDate?: string) => void; // add this
  incomes: Income[];
}

export const IncomeHeader = ({
  totalIncome,
  onNewIncome,
  onPreview,
  onExport,
  incomes,
}: IncomeHeaderProps) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
      <div className="flex-1">
        <div className="flex items-end gap-6">
          <div className="relative">
            <h1 className="text-4xl font-bold bg-white bg-clip-text text-transparent relative z-10">
              Income
            </h1>
          </div>
          <TotalIncome total={totalIncome} />
        </div>
        <p className="dark:text-light/60 text-white/90 text-sm mt-3 flex items-center gap-2">
          Track and manage your income streams
        </p>
      </div>

      <div className="flex items-center gap-3">
        <MoreActionsDropdown onPreview={onPreview} onExport={onExport} incomes={incomes} />
        <Button
          onClick={onNewIncome}
          size="large"
          className="border-none bg-gradient-to-br from-green-400/25 to-green-400/20 bg-white/80 text-green-700/80 dark:bg-none dark:bg-primary dark:text-white font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group"
          startIcon={<Plus className="w-4 h-4 transition-transform" />}
        >
          New Income
        </Button>
      </div>
    </div>
  );
};
