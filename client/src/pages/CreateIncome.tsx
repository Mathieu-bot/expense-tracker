import { useNavigate } from "react-router-dom";
import { IncomeForm } from "../components/Income/IncomeForm";
import { Button, useToast } from "../ui";
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

  return (
    <div className="p-6 max-w-2xl mx-auto pt-20">
      <div className="flex items-center mb-6">
        <Button
          onClick={handleCancel}
          className="mr-4 border border-gray-300"
          size="small"
        >
          ← Back
        </Button>
        <h1 className="text-2xl font-semibold">Create New Income</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <IncomeForm onSave={handleSave} onCancel={handleCancel} open={true} />
      </div>
    </div>
  );
};
