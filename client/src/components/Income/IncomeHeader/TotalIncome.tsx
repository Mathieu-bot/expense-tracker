import { TrendingUp } from "lucide-react";
import { formatCurrency } from "../../../utils/formatters";
import CountUp from "react-countup";
import { motion } from "framer-motion";

interface TotalIncomeProps {
  total: number;
}

export const TotalIncome = ({ total }: TotalIncomeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20}}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex rounded-full items-center gap-3 bg-white/80 dark:bg-transparent dark:bg-gradient-to-r dark:from-primary-light/15 dark:to-primary-dark/15 backdrop-blur-lg px-6 py-3 border border-gray-200/70 dark:border-white/10 group hover:border-accent/30 transition-all duration-500 shadow-lg hover:shadow-accent/10 relative overflow-hidden transform-gpu"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center relative z-10 transition-all duration-500 group-hover:scale-110">
        <TrendingUp className="w-5 h-5 text-accent transition-transform duration-300" />
      </div>
      <div className="relative z-10">
        <p className="text-primary-dark/70 dark:text-light/60 text-xs uppercase tracking-wider">
          Total Income
        </p>
        <p className="text-xl font-bold text-primary-dark dark:text-white transition-all duration-300">
          <CountUp
            end={total}
            duration={1.5}
            formattingFn={formatCurrency}
            decimals={total % 1 !== 0 ? 2 : 0}
          />
        </p>
      </div>
      <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse ml-2 relative z-10"></div>
    </motion.div>
  );
};
