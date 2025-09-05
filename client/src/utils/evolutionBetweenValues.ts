export const computeEvolutionBetweenValues = (
  firstValue: number,
  secondValue: number
): number => {
  return ((secondValue - firstValue) / firstValue) * 100;
};
