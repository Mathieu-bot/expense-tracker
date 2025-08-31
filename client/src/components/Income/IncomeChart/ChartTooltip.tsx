import { formatCurrency, formatDate } from "../../../utils/formatters";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: number;
    dataKey?: string;
    payload?: {
      fullDate?: string;
      date?: string;
      source?: string;
      cumulativeAmount?: number;
      amount?: number;
      id?: string;
    };
  }>;
  label?: string | number; 
  chartType?: "timeline" | "cumulative";
}

export const ChartTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div className="bg-primary-dark/95 backdrop-blur-xl rounded-lg p-3 border border-white/10 shadow-xl min-w-48">
        <p className="text-light/60 text-sm mb-2">
          {data?.fullDate ? formatDate(data.fullDate) : label}
        </p>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-light/90">Amount:</span>
            <span className="text-accent font-medium">
              {formatCurrency(payload[0].value ?? 0)}
            </span>
          </div>

          {data?.source && (
            <div className="flex justify-between items-center">
              <span className="text-light/90">Source:</span>
              <span className="text-light/80">{data.source}</span>
            </div>
          )}

          {data?.cumulativeAmount && (
            <div className="flex justify-between items-center pt-2 border-t border-white/10 mt-2">
              <span className="text-light/90">Cumulative:</span>
              <span className="text-green-400 font-medium">
                {formatCurrency(data.cumulativeAmount)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};
