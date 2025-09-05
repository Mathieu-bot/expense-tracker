import { useMemo } from "react";
import Layout from "./Layout";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { fmtAr } from "../../utils/formatter";
import type { Expense } from "../../types/Expense";

const FALLBACK_COLORS = ["#93C5FD", "#A7F3D0", "#FDE68A", "#FCA5A5", "#FDBA74"];
const formatAr = (v: number) => `Ar ${v.toLocaleString("fr-MG")}`;

export default function PieGraph({
  title,
  data,
  heightClass = "h-44 sm:h-56 md:h-64",
}: {
  title?: string;
  data: Expense[];
  heightClass?: string;
}) {
  const total = useMemo(
    () => data.reduce((acc, item) => acc + item.amount, 0),
    [data]
  );
  const chartData = useMemo(() => {
    const map = new Map<string, number>();
    for (const exp of data) {
      const label = exp.category?.category_name ?? "Autres";
      map.set(label, (map.get(label) ?? 0) + exp.amount);
    }
    return Array.from(map.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [data]);

  return (
    <Layout
      title={title}
      graphClassName={heightClass}
      titleClassName="text-center!"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 20, right: 10, bottom: 10, left: 10 }}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            label={false}
            dataKey="value"
            paddingAngle={2}
            cornerRadius={3}
          >
            {chartData.map((d, i) => (
              <Cell
                key={d.name}
                stroke="none"
                fill={FALLBACK_COLORS[i % FALLBACK_COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip formatter={(v: number) => formatAr(v)} />

          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ color: "rgba(255,255,255,0.9)", marginTop: 20 }}
            content={({ payload }) => (
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 m-0 p-0 list-none mt-10">
                {(payload ?? []).map((p) => (
                  <li key={p.value} className="flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ background: p.color }}
                    />
                    <span className="text-white/90">{p.value}</span>
                  </li>
                ))}
              </ul>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      <span className="text-white text-center block mt-4">
        Total: {fmtAr(total)}
      </span>
    </Layout>
  );
}
