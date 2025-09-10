import React from "react";
import { TrendingUp, TrendingDown, type LucideProps, Plus } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { motion } from "framer-motion";

export type MiniStatItem = {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string } & LucideProps>;
  deltaPct?: number;
  hint?: string;
  valueSuffix?: string;
  className?: string;
  filterWasUsed: boolean;
  customDeltaColor?: string | null;
  customBgColor?: string | null;
  href?: string;
};

export default function MiniStatCard({
  label,
  value,
  icon: Icon,
  deltaPct,
  valueSuffix,
  filterWasUsed,
  customBgColor = null,
  href,
}: MiniStatItem) {
  const isUp = typeof deltaPct === "number" ? deltaPct >= 0 : undefined;

  const deltaColor =
    isUp === undefined
      ? "bg-slate-300 dark:bg-slate-500/20 text-slate-600 dark:text-slate-300"
      : isUp
      ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
      : "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`dark:border dark:border-white/5
        relative bg-white/80 dark:bg-transparent dark:bg-gradient-to-br dark:from-primary/20 dark:to-primary-dark/10 
        backdrop-blur-xl rounded-2xl py-4 px-5 
        shadow-lg transition-all duration-500 flex flex-col gap-3 overflow-hidden
        transform-gpu hover:shadow-lg dark:hover:shadow-accent/10
        ${customBgColor || ""}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <span
            className={`
              w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center
              transition-all duration-500 group-hover:scale-110
            `}
          >
            <Icon className="w-6 h-6 text-accent dark:text-accent transition-transform duration-300" />
          </span>
          <span className="text-base text-gray-700 dark:text-white/80 font-medium transition-all duration-300">
            {label}
          </span>
        </div>

        {href && (
          <Link
            to={href}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors duration-300"
            aria-label={`Create New ${label}`}
            title={`Create New ${label}`}
          >
            <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </Link>
        )}
      </div>

      {/* Value + Delta aligned */}
      <div className="flex items-center justify-between relative z-10">
        <div
          className={`text-2xl font-semibold tracking-tight transition-all duration-300 ${
            value < 0
              ? "text-rose-600 dark:text-rose-400"
              : "text-gray-800 dark:text-light/90"
          }`}
        >
          <CountUp
            end={value}
            duration={1.5}
            formattingFn={formatCurrency}
            decimals={value % 1 !== 0 ? 2 : 0}
          />
          {valueSuffix ?? ""}
        </div>

        {typeof deltaPct === "number" && !filterWasUsed && (
          <motion.div
            className="flex flex-col items-end"
            initial={{ opacity: 0, scale: 0.75 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span
              className={`
                text-sm font-semibold px-2.5 py-1 rounded-full 
                inline-flex items-center gap-1 transition-all duration-500
                ${deltaColor}
              `}
            >
              {isUp ? (
                <TrendingUp className="w-3.5 h-3.5 transition-transform duration-300" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 transition-transform duration-300" />
              )}
              {isUp ? "+" : ""}
              {deltaPct.toFixed(1)}%
            </span>

            <div className="text-xs mt-2 font-light text-gray-900 dark:text-white/60 flex items-center gap-1">
              <div className="w-2 h-px bg-gray-400 dark:bg-white/30"></div>
              <span className="tracking-wide">vs previous month</span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-accent/80 to-transparent dark:from-accent/60 dark:to-transparent" />
    </motion.div>
  );
}
