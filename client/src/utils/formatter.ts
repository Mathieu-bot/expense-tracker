export function formatMonth(ym: string) {
  const [year, month] = ym.split("-");
  return new Date(Number(year), Number(month) - 1).toLocaleDateString("en-En", {
    month: "short",
    year: "numeric",
  });
}
