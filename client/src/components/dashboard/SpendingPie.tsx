import { useState } from "react";
import Layout from "./Layout";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const initialData = [
  { name: "Food", value: 45000 },
  { name: "Transport", value: 20000 },
  { name: "Shopping", value: 30000 },
  { name: "Bills", value: 25000 },
  { name: "Entertainment", value: 15000 },
];

const COLORS = ["#FF8042", "#0088FE", "#00C49F", "#FFBB28", "#AF19FF"];

const formatAr = (v: number) => `Ar ${v.toLocaleString("fr-MG")}`;

export default function SpendingPie() {
  const [activeCats, setActiveCats] = useState<string[]>(
    initialData.map((d) => d.name)
  );

  const toggleCategory = (name: string) => {
    setActiveCats((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const filteredData = initialData.filter((d) => activeCats.includes(d.name));
  const total = filteredData.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <div className="flex flex-row gap-6 items-start">
      {/* Chart */}
      <Layout title="Spending Pie - by category">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={filteredData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent = 0 }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {filteredData.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => formatAr(v)} />
          </PieChart>
        </ResponsiveContainer>
      </Layout>

      {/* Options */}
      <div className="flex flex-col gap-4 bg-white/5 rounded-xl p-4 w-fit ">
        <h3 className="text-white font-semibold text-lg">Options</h3>

        {/* Total */}
        <div className="flex flex-col justify-between text-white">
          <span>Total</span>
          <span className="font-bold text-purple-400">{formatAr(total)}</span>
        </div>

        {/* Filtrage */}
        <div className="flex flex-col gap-2 mt-2">
          {initialData.map((d, i) => (
            <label
              key={d.name}
              className="flex items-center justify-between text-white/90 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={activeCats.includes(d.name)}
                  onChange={() => toggleCategory(d.name)}
                  className="accent-purple-500"
                />
                <span
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                {d.name}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
