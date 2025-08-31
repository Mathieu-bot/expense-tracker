import type { Income } from "../../types/Income";
import { Eye } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

interface ReceiptProps {
  items: Income[];
  onViewReceipt: (income: Income) => void;
  emptyMessage?: string;
}

const Receipt = ({
  items,
  onViewReceipt,
  emptyMessage = "No receipts to display",
}: ReceiptProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "2-digit",
      month: "short",
      day: "numeric",
    });
  };

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-light/50">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
          <Eye className="w-6 h-6" />
        </div>
        <p className="text-sm">{emptyMessage}</p>
        <p className="text-xs mt-1">Add incomes to see receipts</p>
      </div>
    );
  }

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
              fill="rgba(255,255,255,0.04)"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="0.8"
            />

            <foreignObject x="8" y="8" width="84" height="104">
              <div className="flex flex-col justify-between h-full p-2">
                <div className="mb-2">
                  <h3 className="font-semibold text-light/90 text-[10px] leading-tight tracking-wider mb-1 truncate">
                    {item.source}
                  </h3>
                  <p className="text-light/50 text-[8px] leading-tight tracking-tight font-light">
                    {formatDate(item.date)}
                  </p>
                </div>

                {item.description && (
                  <p className="text-light/60 text-[8px] leading-tight tracking-tight mb-2 line-clamp-2">
                    {item.description}
                  </p>
                )}

                <div className="flex justify-end items-end pt-2 border-t border-light/10">
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
