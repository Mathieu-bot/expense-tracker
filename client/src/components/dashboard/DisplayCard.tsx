import React, { useState, useEffect, useRef } from "react";
import { TrendingUp, TrendingDown, type LucideProps } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

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
};

export default function MiniStatCard({
  label,
  value,
  icon: Icon,
  deltaPct,
  valueSuffix,
  filterWasUsed,
  customBgColor = null,
}: MiniStatItem) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const isUp = typeof deltaPct === "number" ? deltaPct >= 0 : undefined;

  // Theme-aware colors
  const deltaColor =
    isUp === undefined
      ? "bg-slate-300 dark:bg-slate-500/20 text-slate-600 dark:text-slate-300"
      : isUp
      ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
      : "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400";

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

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && value !== 0) {
      const duration = 1500;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setAnimatedValue(Math.round(value * easeOutQuart));

        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    }
  }, [isVisible, value]);

  const valueStr = formatCurrency(animatedValue);

  return (
    <div
      ref={cardRef}
      className={`
        relative bg-white/80 dark:bg-transparent dark:bg-gradient-to-br dark:from-primary/20 dark:to-gray-800/20 
        backdrop-blur-xl rounded-2xl py-4 px-5 
        shadow-lg transition-all duration-500 flex flex-col gap-3 overflow-hidden
        transform-gpu hover:shadow-lg dark:hover:shadow-accent/10
        ${
          isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-6 scale-95"
        }
        ${customBgColor || ""}
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-2 relative z-10">
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

      {/* Value + Delta alignés */}
      <div className="flex items-center justify-between relative z-10">
        <div
          className={`text-2xl font-semibold tracking-tight transition-all duration-300 ${
            value < 0
              ? "text-rose-600 dark:text-rose-400"
              : "text-gray-800 dark:text-white"
          }`}
        >
          {valueStr}
          {valueSuffix ?? ""}
        </div>

        {typeof deltaPct === "number" && !filterWasUsed && (
          <div className="flex flex-col items-end">
            <span
              className={`
                text-sm font-semibold px-2.5 py-1 rounded-full 
                inline-flex items-center gap-1 transition-all duration-500
                ${deltaColor}
                ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"}
              `}
              style={{ transitionDelay: "200ms" }}
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
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-accent/80 to-transparent dark:from-accent/60 dark:to-transparent" />
    </div>
  );
}
