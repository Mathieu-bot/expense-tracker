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

const FALLBACK_COLORS = ["#93C5FD", "#A7F3D0", "#FDE68A", "#FCA5A5", "#FDBA74"];
const formatAr = (v: number) => `Ar ${v.toLocaleString("fr-MG")}`;

export default function PieGraph({
  title,
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
            paddingAngle={2} // espace entre chaque cellule
            cornerRadius={1} // arrondi des coins
          >
            {data.map((d, i) => (
              <Cell
                key={d.name}
                stroke="none"
                fill={d.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip formatter={(v: number) => formatAr(v)} />

          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ color: "rgba(255,255,255,0.9)", marginTop: 20 }}
            content={({ payload }) => {
              // on lit la couleur/nom depuis le payload de Recharts pour rester synchro
              const items =
                payload?.map((p: any) => ({
                  name: p.value as string,
                  color: p.color as string,
                })) ??
                data.map((d, i) => ({
                  name: d.name,
                  color: d.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length],
                }));

              return (
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))", // ✅ 2 colonnes
                    columnGap: "16px",
                    rowGap: "8px",
                    justifyItems: "start",
                  }}
                >
                  {items.map((it) => (
                    <li
                      key={it.name}
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          background: it.color,
                          display: "inline-block",
                        }}
                      />
                      <span style={{ color: "rgba(255,255,255,0.9)" }}>
                        {it.name}
                      </span>
                    </li>
                  ))}
                </ul>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <span className="text-white text-center block mt-4">
        Total: {fmtAr(total)}
      </span>
    </Layout>
  );
}
