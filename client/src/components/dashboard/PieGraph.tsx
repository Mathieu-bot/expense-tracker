import { useMemo } from "react";
import Layout from "./Layout";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export type PieItem = { name: string; value: number; color?: string };

const FALLBACK_COLORS = ["#FF8042", "#0088FE", "#00C49F", "#FFBB28", "#AF19FF"];
const formatAr = (v: number) => `Ar ${v.toLocaleString("fr-MG")}`;

export default function PieGraph({
  title = "By category",
  data,
  heightClass = "h-44 sm:h-56 md:h-64",
}: {
  title?: string;
  data: PieItem[];
  heightClass?: string;
}) {
  const total = useMemo(
    () => data.reduce((acc, cur) => acc + (cur.value ?? 0), 0),
    [data]
  );

  return (
    <Layout
      title={title}
      graphClassName={heightClass}
      titleClassName="text-center!"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent = 0 }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((d, i) => (
              <Cell
                key={d.name}
                fill={d.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(v: number) => formatAr(v)} />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-2 text-right text-xs text-white/70">
        Total:{" "}
        <span className="font-semibold text-white">{formatAr(total)}</span>
      </div>
    </Layout>
  );
}
