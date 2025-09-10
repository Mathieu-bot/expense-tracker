import React from "react";
import { TrendingUp, TrendingDown, type LucideProps, Plus } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";
import { Link } from "react-router-dom";

export type MiniStatItem = {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string } & LucideProps>;
  deltaPct?: number;
  hint?: string;
  valueSuffix?: string;
  className?: string;
  filterWasUsed: boolean;
  customDeltaColor?: string | undefined | null;
  customBgColor?: string | undefined | null;
};

export default function MiniStatCard({
  label,
  value,
  icon: Icon,
  deltaPct,
  valueSuffix,
  filterWasUsed,
  customDeltaColor,
  customBgColor,
  href,
}: MiniStatItem & { href?: string }) {
  const isUp = typeof deltaPct === "number" ? deltaPct >= 0 : undefined;
  const deltaColor =
    isUp === undefined
      ? "bg-slate-500/20 text-slate-300"
      : isUp
      ? "bg-emerald-500/20 text-emerald-400"
      : "bg-rose-500/20 text-rose-400";

  const valueStr = formatCurrency(value);

  return (
    <div className="bg-gradient-to-br from-primary/20 to-gray-800/20 backdrop-blur-xl rounded-2xl overflow-hidden  border border-white/5 shadow-lg hover:shadow-accent/20 transition-shadow duration-300 flex justify-between gap-2">
      <div className="flex flex-col w-[90%] pl-5 py-4 gap-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center">
            <Icon className="w-5 h-5" />
          </span>
          <span className="text-base text-white/80 font-medium">{label}</span>
        </div>

        {/* Value + Delta alignés */}
        <div className="flex items-center justify-between gap-3 h-full">
          <div
            className={`text-2xl font-semibold tracking-tight ${
              value < 0 ? "text-red-500" : "text-white"
            }`}
          >
            {valueStr}
            {valueSuffix ? valueSuffix : ""}
          </div>

          {typeof deltaPct === "number" && !filterWasUsed ? (
            <div className="flex flex-col items-center gap-2">
              <span
                className={`ml-3 text-sm font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${deltaColor} ${customDeltaColor} ${customBgColor}`}
              >
                {isUp ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                {isUp ? "+" : ""}
                {deltaPct.toFixed(1)}%
              </span>
              <span className="text-xs text-gray-200 italic text-center w-full">
                From last month
              </span>
            </div>
          ) : null}
        </div>
      </div>
      {href && (
        <Link
          to={href!}
          className="w-[10%] h-[100%] flex flex-col items-center justify-center bg-gray-200/10  hover:shadow-accent/20 transition-all duration-300 hover:bg-gray-200/20"
          aria-label={`Create New ${label}`}
          title={`Create New ${label}`}
        >
          <Plus className="w-4 h-4 transition-transform" />
        </Link>
      )}
    </div>
  );
}
