import type { ChangeEvent } from "react";

export const createChangeHandler = (setter: (value: string) => void) => {
  return (e: ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };
};

export const createFieldChangeHandler = <T extends Record<string, string>>(
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  field: keyof T
) => {
  return (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };
};
