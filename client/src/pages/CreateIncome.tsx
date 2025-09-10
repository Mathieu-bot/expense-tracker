import { useNavigate } from "react-router-dom";
import { IncomeForm } from "../components/income/IncomeForm";
import { useToast } from "../ui";
import { IncomeService } from "../services/IncomeService";
import type { CreateIncomeRequest } from "../types/Income";

export const CreateIncome = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const handleSave = async (formData: CreateIncomeRequest) => {
    try {
      await IncomeService.createIncome(formData);
      toast.success("Income created successfully");
      navigate("/incomes");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create income";
      toast.error(message);
      throw error;
    }
  };

  const handleCancel = () => {
    navigate("/incomes");
  };

  return <IncomeForm onSave={handleSave} onCancel={handleCancel} open={true} />;
};
