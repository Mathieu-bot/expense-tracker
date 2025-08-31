export const fmtShort = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `${(n / 1_000).toFixed(1)}k`
    : `${n}`;
export const fmtAr = (n: number) => `Ar ${n.toLocaleString("fr-MG")}`;
