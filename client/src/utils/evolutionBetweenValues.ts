export const computeEvolutionBetweenValues = (
  prev: number,
  curr: number
): number | null => {
  if (prev === 0) return null;
  return ((curr - prev) / prev) * 100;
};

export const computeSoldRatio = (prev: number, curr: number): number | null => {
  const denom = Math.abs(curr) + Math.abs(prev);
  if (denom === 0) return 0;
  const ratio = (2 * (curr - prev)) / denom;
  return Math.max(-2, Math.min(2, ratio)) * 100;
};
