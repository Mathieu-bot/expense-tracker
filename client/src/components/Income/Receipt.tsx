import { useTheme } from "../../contexts/ThemeContext";
import type { Income } from "../../types/Income";
import { formatCurrency, formatDate } from "../../utils/formatters";

interface ReceiptProps {
  items: Income[];
  onViewReceipt: (income: Income) => void;
  emptyMessage?: string;
}

const Receipt = ({ items, onViewReceipt }: ReceiptProps) => {
  const { isDark } = useTheme();

  return (
    <div className="flex gap-4">
      {items.map((item) => (
        <div
          key={item.income_id}
          onClick={() => onViewReceipt(item)}
          className="w-36 cursor-pointer group hover:scale-[1.02] transition-all duration-300"
        >
          <svg
            viewBox="0 0 100 120"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="
                M 10,0
                H 90
                Q 100,0 100,10
                V 110
                L 87.5,118
                L 75,110
                L 62.5,118
                L 50,110
                L 37.5,118
                L 25,110
                L 12.5,118
                L 0,110
                V 10
                Q 0,0 10,0
              "
              fill={isDark ? "rgba(255,255,255,0.04)" : "rgba(162, 126, 232, 0.2)"}
              stroke={isDark ? "rgba(255,255,255,0.12)" : "rgba(162, 126, 232, 0.4)"}
              strokeWidth="0.8"
            />

            <foreignObject x="8" y="8" width="84" height="104">
              <div className="flex flex-col justify-between h-full p-2">
                <div className="mb-2">
                  <h3
                    className={`font-semibold text-[10px] leading-tight tracking-wider mb-1 truncate ${
                      isDark ? "text-light/90" : "text-purple-900/80"
                    }`}
                  >
                    {item.source}
                  </h3>
                  <p
                    className={`text-[9px] leading-tight tracking-tight font-light ${
                      isDark ? "text-light/50" : "text-purple-900"
                    }`}
                  >
                    {formatDate(item.date)}
                  </p>
                </div>

                {item.description && (
                  <p
                    className={`text-[8px] leading-tight tracking-tight mb-2 line-clamp-2 ${
                      isDark ? "text-light/60" : "text-purple-900/80"
                    }`}
                  >
                    {item.description}
                  </p>
                )}

                <div
                  className={`flex justify-end items-end pt-2 border-t ${
                    isDark ? "border-light/10" : "text-purple-900/50"
                  }`}
                >
                  <span className="text-accent font-bold text-[11px] leading-none tracking-tight">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              </div>
            </foreignObject>
          </svg>
        </div>
      ))}
    </div>
  );
};

export default Receipt;
