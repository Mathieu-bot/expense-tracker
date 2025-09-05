import React from "react";
import { TrendingUp, TrendingDown, type LucideProps } from "lucide-react";

export type MiniStatItem = {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string } & LucideProps>;
  deltaPct?: number;
  hint?: string;
  valueSuffix?: string;
  formatValue?: (v: number) => string;
  className?: string;
};

const nfMG = new Intl.NumberFormat("fr-MG");
const fmtArShort = (n: number) =>
  n >= 1_000_000
    ? `Ar ${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000 || n <= -1_000
    ? `Ar ${(n / 1_000).toFixed(1)}k`
    : `Ar ${nfMG.format(n)}`;

export default function MiniStatCard({
  label,
  value,
  icon: Icon,
  deltaPct,
  valueSuffix,
  formatValue,
}: MiniStatItem) {
  const isUp = typeof deltaPct === "number" ? deltaPct >= 0 : undefined;
  const deltaColor =
    isUp === undefined
      ? "bg-slate-500/20 text-slate-300"
      : isUp
      ? "bg-emerald-500/20 text-emerald-400"
      : "bg-rose-500/20 text-rose-400";

  const valueStr = formatValue
    ? formatValue(value)
    : valueSuffix
    ? nfMG.format(value)
    : fmtArShort(value);


  return (
    <div className="bg-gradient-to-br from-primary/20 to-gray-800/20 backdrop-blur-xl rounded-2xl py-4 px-5 border border-white/5 shadow-lg hover:shadow-accent/20 transition-shadow duration-300 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </span>
        <span className="text-base text-white/80 font-medium">{label}</span>
      </div>

      {/* Value + Delta alignés */}
      <div className="flex items-center justify-between">
        <div
          className={`text-3xl font-semibold tracking-tight ${
            value < 0 ? "text-red-400" : "text-white"
          }`}
        >
          {valueStr}
          {valueSuffix ? valueSuffix : ""}
        </div>

        {typeof deltaPct === "number" && (
          <span
            className={`ml-3 text-sm font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${deltaColor}`}
          >
            {isUp ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {isUp ? "+" : ""}
            {deltaPct.toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}
