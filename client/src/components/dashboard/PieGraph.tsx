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
    () => data.reduce((acc, item) => acc + item.value, 0),
    [data]
  );
  return (
    <Layout
      title={title}
      graphClassName={heightClass}
      titleClassName="text-center!"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            label={false}
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

          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            wrapperStyle={{ color: "rgba(255,255,255,0.9)" }}
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            content={({ payload }) => (
              <ul style={{ listStyle: "none", padding: 0, marginTop: 0 }}>
                {data.map((d, i) => (
                  <li
                    key={d.name}
                    style={{
                      color:
                        d.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length],
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: 10,
                        height: 10,
                        backgroundColor:
                          d.color ??
                          FALLBACK_COLORS[i % FALLBACK_COLORS.length],
                        borderRadius: "50%",
                        marginRight: 8,
                      }}
                    ></span>
                    {d.name}
                  </li>
                ))}
              </ul>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      <span className="text-white text-center">Total: {fmtAr(total)}</span>
    </Layout>
  );
}
