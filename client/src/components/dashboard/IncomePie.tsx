
// import { useMemo, useState } from "react";
// import Layout from "./Layout";



// const initialData = [
//   { name: "Food", value: 45000 },
//   { name: "Transport", value: 20000 },
//   { name: "Shopping", value: 30000 },
//   { name: "Bills", value: 25000 },
//   { name: "Entertainment", value: 15000 },
// ];

// const formatAr = (v: number) => `Ar ${v.toLocaleString("fr-MG")}`;

// export default function IncomePie() {
//   const [activeCats, setActiveCats] = useState<string[]>(
//     initialData.map((d) => d.name)
//   );

//   const chartData = useMemo(
//     () =>
//       initialData
//         .filter((d) => activeCats.includes(d.name))
//         .map((d) => ({ id: d.name, label: d.name, value: d.value })),
//     [activeCats]
//   );

//   const total = useMemo(
//     () => chartData.reduce((a, c) => a + Number(c.value), 0),
//     [chartData]
//   );

//   const CenterTotal = ({ centerX, centerY }: any) => (
//     <text
//       x={centerX}
//       y={centerY}
//       textAnchor="middle"
//       dominantBaseline="central"
//       style={{ fill: "#e5e7eb", fontWeight: 700, fontSize: 16 }}
//     >
//       {formatAr(total)}
//     </text>
//   );

//   return (
//     <div className="grid grid-cols-3 gap-4 w-full">
//       {/* Graph 2/3 */}
//       <div className="col-span-2">
//         <Layout title="Expenditure">
//           {/* ⬇️ Hauteur explicite sur le parent direct */}
//           <div className="h-[260px] w-full">
//             {chartData.length === 0 ? (
//               <div className="h-full w-full flex items-center justify-center text-white/70">
//                 Aucune catégorie sélectionnée
//               </div>
//             ) : (
//               <ResponsivePie
//                 data={chartData}
//                 margin={{ top: 10, right: 48, bottom: 10, left: 48 }}
//                 innerRadius={0.6}
//                 padAngle={1.5}
//                 cornerRadius={3}
//                 activeOuterRadiusOffset={8}
//                 colors={{ scheme: "dark2" }}
//                 valueFormat={(v: number) => formatAr(v)}
//                 theme={{
//                   background: "transparent",
//                   text: { fill: "#e5e7eb" },
//                   tooltip: { container: { background: "#0b0f1a" } },
//                 }}
//                 // labels externes uniquement
//                 enableArcLabels={false}
//                 enableArcLinkLabels
//                 arcLinkLabel={(d) =>
//                   `${d.id} ${
//                     total ? Math.round((Number(d.value) / total) * 100) : 0
//                   }%`
//                 }
//                 arcLinkLabelsSkipAngle={8}
//                 arcLinkLabelsTextColor="#e5e7eb"
//                 arcLinkLabelsColor={{ from: "color" }}
//                 arcLinkLabelsThickness={1}
//                 arcLinkLabelsOffset={6}
//                 arcLinkLabelsDiagonalLength={14}
//                 arcLinkLabelsStraightLength={12}
//                 tooltip={({ datum }) => (
//                   <div
//                     style={{
//                       background: "#0b0f1a",
//                       color: "#fff",
//                       padding: "6px 8px",
//                       borderRadius: 8,
//                       fontSize: 12,
//                     }}
//                   >
//                     <strong>{datum.id}</strong> :{" "}
//                     {formatAr(Number(datum.value))}
//                   </div>
//                 )}
//                 layers={["arcs", "legends", CenterTotal]}
//               />
//             )}
//           </div>
//         </Layout>
//       </div>

//       {/* Options 1/3 */}
//       <div className="col-span-1 flex flex-col gap-4 rounded-xl p-4 bg-white/5">
//         <h3 className="text-white font-semibold text-lg">Options</h3>

//         <div className="flex flex-col text-white">
//           <span>Total</span>
//           <span className="font-bold text-purple-300">{formatAr(total)}</span>
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => setActiveCats(initialData.map((d) => d.name))}
//             className="px-2 py-1 text-xs rounded-md bg-white/10 text-white hover:bg-white/15"
//           >
//             Tout
//           </button>
//           <button
//             onClick={() => setActiveCats([])}
//             className="px-2 py-1 text-xs rounded-md bg-white/10 text-white hover:bg-white/15"
//           >
//             Aucun
//           </button>
//         </div>

//         <div className="flex flex-col gap-2 mt-1">
//           {initialData.map((d) => (
//             <label
//               key={d.name}
//               className="flex items-center justify-between text-white/90 cursor-pointer"
//             >
//               <span className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={activeCats.includes(d.name)}
//                   onChange={() =>
//                     setActiveCats((prev) =>
//                       prev.includes(d.name)
//                         ? prev.filter((c) => c !== d.name)
//                         : [...prev, d.name]
//                     )
//                   }
//                   className="accent-purple-500"
//                 />
//                 {d.name}
//               </span>
//             </label>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
