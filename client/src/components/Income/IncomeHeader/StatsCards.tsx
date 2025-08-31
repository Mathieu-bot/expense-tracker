import { Calendar, Wallet, Target, TrendingUp, Plus } from "lucide-react";
import { formatCurrency } from "../../../utils/formatters";

interface StatsCardsProps {
  totalIncome: number;
  incomeCount: number;
  totalIncomeThisMonth : number;
}

export const StatsCards = ({ totalIncome, incomeCount, totalIncomeThisMonth }: StatsCardsProps) => {
  const averageIncome = incomeCount > 0 ? totalIncome / incomeCount : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gradient-to-br from-primary-light/10 to-primary-dark/10 backdrop-blur-xl rounded-2xl p-5 border border-white/5 shadow-lg hover:shadow-accent/5 transition-shadow duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-light/60 text-sm">This Month</p>
            <p className="text-2xl font-bold text-light/90 mt-1">
              {formatCurrency(totalIncomeThisMonth)}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-accent" />
          </div>
        </div>
        <div className="flex items-center mt-3">
          <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
          <span className="text-green-400 text-sm">Current month's total earnings</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary-light/10 to-primary-dark/10 backdrop-blur-xl rounded-2xl p-5 border border-white/5 shadow-lg hover:shadow-cyan-400/5 transition-shadow duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-light/60 text-sm">Total Records</p>
            <p className="text-2xl font-bold text-light/90 mt-1">
              {incomeCount}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-cyan-400" />
          </div>
        </div>
        <div className="flex items-center mt-3">
          <Plus className="w-4 h-4 text-cyan-400 mr-1" />
          <span className="text-cyan-400 text-sm">All-time income entries</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary-light/10 to-primary-dark/10 backdrop-blur-xl rounded-2xl p-5 border border-white/5 shadow-lg hover:shadow-purple-400/5 transition-shadow duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-light/60 text-sm">Avg. Income</p>
            <p className="text-2xl font-bold text-light/90 mt-1">
              {formatCurrency(averageIncome)}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-400/10 flex items-center justify-center">
            <Target className="w-6 h-6 text-purple-400" />
          </div>
        </div>
        <div className="flex items-center mt-3">
          <TrendingUp className="w-4 h-4 text-purple-400 mr-1" />
          <span className="text-purple-400 text-sm">Per transaction average</span>
        </div>
      </div>
    </div>
  );
};
