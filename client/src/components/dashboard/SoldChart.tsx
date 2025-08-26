import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type Tx = {
  amount: number;
  createdAt: string;
};

function getLastNDays(n = 10) {
  const days: { key: string; label: string }[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
    });
    days.push({ key, label });
  }
  return days;
}

const formatAr = (v: number) => `Ar ${Math.round(v).toLocaleString("fr-MG")}`;

type Props = {
  transactions: Tx[];
  title?: string;
};

export default function SoldChart({
  transactions,
  title = "Sold variation over the last 10 days",
}: Props) {
  const days = getLastNDays(10);
  const sumByDay = new Map<string, number>();
  for (const tx of transactions ?? []) {
    const d = new Date(tx.createdAt);
    const key = isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
    if (!key) continue;
    sumByDay.set(key, (sumByDay.get(key) ?? 0) + (tx.amount || 0));
  }
  const data = days.map(({ key, label }) => ({
    name: label,
    amount: sumByDay.get(key) ?? 0,
  }));

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-5">
      <h2 className="text-white font-semibold text-2xl text-center">{title}</h2>

      <div className="w-[400px] h-[250px] rounded-xl bg-white/5 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 8, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity={0.9} />
                <stop
                  offset="100%"
                  stopColor="currentColor"
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#999" strokeDasharray="4 4" opacity={0.25} />
            <XAxis dataKey="name" tickMargin={8} />
            <YAxis width={72} tickFormatter={formatAr} tickMargin={8} />
            <Tooltip
              formatter={(value: number) => [formatAr(value), "Income"]}
              labelClassName="font-semibold"
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="purple"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name="Income"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
