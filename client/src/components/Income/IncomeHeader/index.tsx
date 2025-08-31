import { Plus } from "lucide-react";
import { Button } from "../../../ui";
import { TotalIncome } from "./TotalIncome";
import { MoreActionsDropdown } from "../IncomeFilters/MoreActionsDropdown";
interface IncomeHeaderProps {
  totalIncome: number;
  onNewIncome: () => void;
}

export const IncomeHeader = ({
  totalIncome,
  onNewIncome,
}: IncomeHeaderProps) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
      <div className="flex-1">
        <div className="flex items-end gap-6">
          <div className="relative">
            <h1 className="text-4xl font-bold bg-white via-purple-400 to-cyan-400 bg-clip-text text-transparent relative z-10">
              Income
            </h1>
          </div>
          <TotalIncome total={totalIncome} />
        </div>
        <p className="text-light/60 text-sm mt-3 flex items-center gap-2">
          Track and manage your income streams
        </p>
      </div>

      <div className="flex items-center gap-3">
        <MoreActionsDropdown />
        <Button
          onClick={onNewIncome}
          size="large"
          className="bg-primary text-white font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group"
          startIcon={<Plus className="w-4 h-4 transition-transform" />}
        >
          New Income
        </Button>
      </div>
    </div>
  );
};
