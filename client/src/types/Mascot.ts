export type MascotExpression = 'idle' | 'success' | 'error';
export type MascotState = {
  expression: MascotExpression;
  isAnimating: boolean;
};

export interface MascotStore {
  expression: MascotExpression;
  setExpression: (expression: MascotExpression) => void;
  resetExpression: () => void;
}