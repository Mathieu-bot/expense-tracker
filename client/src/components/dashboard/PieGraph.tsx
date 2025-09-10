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
import type { Expense } from "../../types/Expense";
import { formatCurrency } from "../../utils/formatters";
import CountUp from "react-countup";
import { motion } from "framer-motion";

const FALLBACK_COLORS = ["#93C5FD", "#A7F3D0", "#FDE68A", "#FCA5A5", "#FDBA74"];

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Layout
        title={title}
        graphClassName={heightClass}
        titleClassName="text-center! mt-5"
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

            <Tooltip formatter={(v: number) => formatCurrency(v)} />

            <Legend
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ color: "rgba(255,255,255,0.9)", marginTop: 20 }}
              content={({ payload }) => (
                <motion.ul
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="grid grid-cols-2 gap-x-4 gap-y-2 m-0 p-0 list-none mt-10"
                >
                  {(payload ?? []).map(
                    (p, index) =>
                      p.value != "value" && (
                        <motion.li
                          key={p.value}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="flex items-center gap-2"
                        >
                          <span
                            className="inline-block w-3 h-3 rounded-full"
                            style={{ background: p.color }}
                          />
                          <span className="dark:text-light/90 text-gray-800">
                            {p.value}
                          </span>
                        </motion.li>
                      )
                  )}
                </motion.ul>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="dark:text-light/90 text-gray-800 text-2xl font-semibold text-center block mt-4"
        >
          Total: <br />
          <CountUp
            end={total}
            duration={1.5}
            formattingFn={formatCurrency}
            decimals={total % 1 !== 0 ? 2 : 0}
          />
        </motion.span>
      </Layout>
    </motion.div>
  );
}
