import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot,
} from "recharts";
import { ChartTooltip } from "./ChartTooltip";
import { useTheme } from "../../../contexts/ThemeContext";

export interface LineChartData {
  date: string;
  amount: number;
  cumulativeAmount?: number;
  id: string;
}

interface LineChartProps {
  data: LineChartData[];
  height?: number;
  dataKey?: keyof LineChartData;
  strokeColor?: string;
  chartType?: "timeline" | "cumulative";
}

export const LineChart = ({
  data,
  height = 250,
  dataKey = "amount",
  strokeColor = "#FF6B6B",
  chartType = "timeline",
}: LineChartProps) => {
  const { isDark } = useTheme();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={`${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.3)"}`}
        />
        <XAxis
          dataKey="date"
          stroke={`${isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)"}`}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: string) => {
            if (!value) return "";
            try {
              const date = new Date(value);
              return isNaN(date.getTime())
                ? value
                : `${date.getMonth() + 1}/${date.getDate()}`;
            } catch {
              return value;
            }
          }}
        />
        <YAxis
          stroke={`${isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)"}`}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: number) => `$${value / 1000}k`}
        />
        <Tooltip
          content={(props) => <ChartTooltip {...props} chartType={chartType} />}
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={strokeColor}
          strokeWidth={2}
          dot={({
            cx,
            cy,
            payload,
          }: {
            cx: number;
            cy: number;
            payload: LineChartData;
          }) => (
            <Dot
              key={`dot-${payload.id}`}
              cx={cx}
              cy={cy}
              r={4}
              fill={strokeColor}
              stroke="#fff"
              strokeWidth={2}
              className="opacity-80 hover:opacity-100 transition-opacity"
            />
          )}
          activeDot={{
            r: 6,
            fill: strokeColor,
            stroke: "#fff",
            strokeWidth: 2,
          }}
          animationDuration={1500}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};
