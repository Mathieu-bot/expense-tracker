import { Calendar, Wallet, Target, TrendingUp, Plus } from "lucide-react";
import { formatCurrency } from "../../../utils/formatters";
import { useState, useEffect, useRef } from "react";

interface StatsCardsProps {
  totalIncome: number;
  incomeCount: number;
  totalIncomeThisMonth: number;
}

export const StatsCards = ({
  totalIncome,
  incomeCount,
  totalIncomeThisMonth,
}: StatsCardsProps) => {
  const averageIncome = incomeCount > 0 ? totalIncome / incomeCount : 0;
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({
    totalIncomeThisMonth: 0,
    incomeCount: 0,
    averageIncome: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const duration = 1500;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);

        setAnimatedValues({
          totalIncomeThisMonth: Math.round(totalIncomeThisMonth * easeOutQuart),
          incomeCount: Math.round(incomeCount * easeOutQuart),
          averageIncome: Math.round(averageIncome * easeOutQuart),
        });

        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    }
  }, [isVisible, totalIncomeThisMonth, incomeCount, averageIncome]);

  return (
    <div
      ref={containerRef}
      className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 transition-all duration-500 ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-6 scale-95"
      }`}
    >
      <div className="bg-white/80 dark:bg-gradient-to-br dark:bg-transparent dark:from-primary-light/10 dark:to-primary-dark/10 backdrop-blur-xl rounded-2xl p-5 border border-gray-200/70 dark:border-white/5 shadow-lg hover:shadow-accent/5 transition-all duration-300 transform-gpu hover:scale-[1.02]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-dark/80 dark:text-light/60 text-sm">
              This Month
            </p>
            <p className="text-2xl font-bold text-primary-dark dark:text-light/90 mt-1 transition-all duration-300">
              {formatCurrency(animatedValues.totalIncomeThisMonth)}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center transition-all duration-500 group-hover:scale-110">
            <Calendar className="w-6 h-6 text-accent transition-transform duration-300" />
          </div>
        </div>
        <div className="flex items-center mt-3">
          <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400 mr-1 transition-transform duration-300" />
          <span className="text-green-700 dark:text-green-400 text-sm">
            Current month's total earnings
          </span>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-gradient-to-br dark:bg-transparent dark:from-primary-light/10 dark:to-primary-dark/10 backdrop-blur-xl rounded-2xl p-5 border border-gray-200/70 dark:border-white/5 shadow-lg hover:shadow-cyan-400/5 transition-all duration-300 transform-gpu hover:scale-[1.02]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-dark/80 dark:text-light/60 text-sm">
              Total Records
            </p>
            <p className="text-2xl font-bold text-primary-dark dark:text-light/90 mt-1 transition-all duration-300">
              {animatedValues.incomeCount}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center transition-all duration-500 group-hover:scale-110">
            <Wallet className="w-6 h-6 text-cyan-600 dark:text-cyan-400 transition-transform duration-300" />
          </div>
        </div>
        <div className="flex items-center mt-3">
          <Plus className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mr-1 transition-transform duration-300" />
          <span className="text-cyan-700 dark:text-cyan-400 text-sm">
            All-time income entries
          </span>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-gradient-to-br dark:bg-transparent dark:from-primary-light/10 dark:to-primary-dark/10 backdrop-blur-xl rounded-2xl p-5 border border-gray-200/70 dark:border-white/5 shadow-lg hover:shadow-purple-400/5 transition-all duration-300 transform-gpu hover:scale-[1.02]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-dark/80 dark:text-light/60 text-sm">
              Avg. Income
            </p>
            <p className="text-2xl font-bold text-primary-dark dark:text-light/90 mt-1 transition-all duration-300">
              {formatCurrency(animatedValues.averageIncome)}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-400/10 flex items-center justify-center transition-all duration-500 group-hover:scale-110">
            <Target className="w-6 h-6 text-purple-600 dark:text-purple-400 transition-transform duration-300" />
          </div>
        </div>
        <div className="flex items-center mt-3">
          <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400 mr-1 transition-transform duration-300" />
          <span className="text-purple-700 dark:text-purple-400 text-sm">
            Per transaction average
          </span>
        </div>
      </div>
    </div>
  );
};
