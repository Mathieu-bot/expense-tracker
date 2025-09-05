export const fmtShort = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `${(n / 1_000).toFixed(1)}k`
    : `${n}`;
export const fmtAr = (n: number) => `Ar ${n.toLocaleString("fr-MG")}`;

export function formatMonth(ym: string) {
  const [year, month] = ym.split("-");
  return new Date(Number(year), Number(month) - 1).toLocaleDateString("en-En", {
    month: "short",
    year: "numeric",
  });
}
