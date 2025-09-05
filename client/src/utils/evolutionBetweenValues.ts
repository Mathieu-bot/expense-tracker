export const computeEvolutionBetweenValues = (
  prev: number,
  curr: number
): number | null => {
  if (prev === 0 && curr === 0) return 0;
  if (prev === 0) return null;
  if (!prev || !curr) return null;
  const diff = ((curr - prev) / prev) * 100;
  return isNaN(diff) ? null : diff;
};
