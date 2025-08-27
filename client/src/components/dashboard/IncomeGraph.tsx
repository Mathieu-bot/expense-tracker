import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Layout from "./Layout";
const incomeData = [
  { day: "01/08", amount: 12000 },
  { day: "02/08", amount: 15000 },
  { day: "03/08", amount: 8000 },
  { day: "04/08", amount: 18000 },
  { day: "05/08", amount: 10000 },
];
export function IncomeGraph() {
  return (
    <Layout title="Income Graph">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={incomeData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#666" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip
            formatter={(v: number) => `Ar ${v.toLocaleString("fr-MG")}`}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#82ca9d"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Layout>
  );
}
