// MiniStatCard.tsx
import React from "react";
import {
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  type LucideProps,
} from "lucide-react";

export type MiniStatItem = {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string } & LucideProps>;
  /** Variation en % (ex: +6.4 / -0.8) */
  deltaPct?: number;
  /** Sous-texte (ex: "From last month") */
  hint?: string;
  /** Suffixe de valeur (ex: "%") */
  valueSuffix?: string;
  /** Format personnalisé de la valeur (sinon monnaie Ar abrégée) */
  formatValue?: (v: number) => string;
  className?: string;
};

const nfMG = new Intl.NumberFormat("fr-MG");
const fmtArShort = (n: number) =>
  n >= 1_000_000
    ? `Ar ${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `Ar ${(n / 1_000).toFixed(1)}k`
    : `Ar ${nfMG.format(n)}`;

export default function MiniStatCard({
  label,
  value,
  icon: Icon,
  deltaPct,
  hint = "From last month",
  valueSuffix,
  formatValue,
  className = "",
}: MiniStatItem) {
  const isUp = typeof deltaPct === "number" ? deltaPct >= 0 : undefined;
  const deltaColor =
    isUp === undefined
      ? "bg-slate-100 text-slate-600"
      : isUp
      ? "bg-emerald-50 text-emerald-600"
      : "bg-rose-50 text-rose-600";

  const valueStr = formatValue
    ? formatValue(value)
    : valueSuffix
    ? nfMG.format(value)
    : fmtArShort(value);

  return (
    <div
      className={[
        "rounded-xl bg-primary/50 shadow-sm min-w-[250px] border border-gray-700",
        "p-4 flex flex-col gap-3",
        className,
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-slate-100/20 text-white flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </span>
          <span className="text-lg text-white font-semibold">{label}</span>
        </div>
        <button
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          aria-label="More"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Value */}
      <div className="text-3xl font-normal tracking-tight text-white">
        {valueStr}
        {valueSuffix ? valueSuffix : ""}
      </div>

      {/* Delta */}
      <div className="flex items-center gap-2">
        {typeof deltaPct === "number" && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${deltaColor}`}
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
        <span className="text-xs text-slate-500">{hint}</span>
      </div>
    </div>
  );
}
