import { TrendingUp } from "lucide-react";
import { formatCurrency } from "../../../utils/formatters";

interface TotalIncomeProps {
  total: number;
}

export const TotalIncome = ({ total }: TotalIncomeProps) => {
  return (
    <div className="flex rounded-full items-center gap-3 bg-gradient-to-r from-primary-light/15 to-primary-dark/15 backdrop-blur-lg px-6 py-3 border border-white/10 group hover:border-accent/30 transition-all duration-500 shadow-lg hover:shadow-accent/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center relative z-10">
        <TrendingUp className="w-5 h-5 text-accent" />
      </div>
      <div className="relative z-10">
        <p className="text-light/60 text-xs uppercase tracking-wider">
          Total Income
        </p>
        <p className="text-xl font-bold text-white">{formatCurrency(total)}</p>
      </div>
      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-2 relative z-10"></div>
    </div>
  );
};
