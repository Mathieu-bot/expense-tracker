import { formatCurrency } from "../../utils/formatters";

interface TooltipPayloadItem {
  value?: number;
  name?: string;
  dataKey?: string;
  color?: string;
  payload?: Record<string, unknown>;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

export const CustomTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 dark:bg-gray-900/95 backdrop-blur-md rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-lg min-w-48">
        <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">
          {label}
        </p>

        <div className="space-y-2">
          {payload.map((entry, index) => (
            <div
              key={`item-${index}`}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-700 dark:text-gray-200 text-sm">
                  {entry.name}:
                </span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(Number(entry.value ?? 0))}
              </span>
            </div>
          ))}

          {payload.length > 1 && (
            <div className="pt-2 border-t border-gray-500/30 dark:border-gray-700 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-200 text-sm">
                  Net:
                </span>
                <span
                  className={`font-medium ${
                    Number(
                      (payload[1]?.value ?? 0) - (payload[0]?.value ?? 0)
                    ) >= 0
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {formatCurrency(
                    Number((payload[1]?.value ?? 0) - (payload[0]?.value ?? 0))
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};
