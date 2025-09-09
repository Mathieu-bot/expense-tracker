import { TrendingUp } from "lucide-react";
import { formatCurrency } from "../../../utils/formatters";
import { useState, useEffect, useRef } from "react";

interface TotalIncomeProps {
  total: number;
}

export const TotalIncome = ({ total }: TotalIncomeProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedTotal, setAnimatedTotal] = useState(0);
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
    if (isVisible && total !== 0) {
      const duration = 1500;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setAnimatedTotal(Math.round(total * easeOutQuart));

        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    }
  }, [isVisible, total]);

  return (
    <div
      ref={containerRef}
      className={`flex rounded-full items-center gap-3 bg-white/80 dark:bg-transparent dark:bg-gradient-to-r dark:from-primary-light/15 dark:to-primary-dark/15 backdrop-blur-lg px-6 py-3 border border-gray-200/70 dark:border-white/10 group hover:border-accent/30 transition-all duration-500 shadow-lg hover:shadow-accent/10 relative overflow-hidden transform-gpu ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-6 scale-95"
      }`}
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
          {formatCurrency(animatedTotal)}
        </p>
      </div>
      <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse ml-2 relative z-10"></div>
    </div>
  );
};
