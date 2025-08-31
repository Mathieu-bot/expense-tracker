import { useMascotStore } from "../stores/mascotStore";

export const useMascot = () => {
  const { setExpression, resetExpression } = useMascotStore();

  const showSuccess = () => setExpression("success");
  const showError = () => setExpression("error");
  const showIdle = () => setExpression("idle");

  return {
    showSuccess,
    showError,
    showIdle,
    resetExpression,
  };
};
