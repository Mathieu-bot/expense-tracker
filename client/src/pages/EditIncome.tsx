import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IncomeForm } from "../components/Income/IncomeForm";
import { Button, useToast, Skeleton } from "../ui";
import { IncomeService } from "../services/IncomeService";
import type { Income, UpdateIncomeRequest } from "../types/Income";

export const EditIncome = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [income, setIncome] = useState<Income | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncome = async () => {
      if (!id) return;
      try {
        const incomeData = await IncomeService.getIncomeById(id);
        setIncome(incomeData);
      } catch {
        toast.error("Failed to load income");
        navigate("/incomes");
      } finally {
        setLoading(false);
      }
    };

    fetchIncome();
  }, [id, navigate, toast]);

  const handleSave = async (formData: UpdateIncomeRequest) => {
    if (!id) return;
    try {
      await IncomeService.updateIncome(id, formData);
      toast.success("Income updated successfully");
      navigate("/incomes");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update income";
      toast.error(message);
      throw error;
    }
  };

  const handleCancel = () => {
    navigate("/incomes");
  };

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto pt-20">
        <Skeleton variant="rect" height={400} rounded="rounded-lg" />
      </div>
    );
  }

  if (!income) {
    return (
      <div className="p-6 max-w-2xl mx-auto pt-20">
        <div className="text-center text-red-600">Income not found</div>
      </div>
    );
  }

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
        <h1 className="text-2xl font-semibold">Edit Income</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <IncomeForm
          income={income}
          onSave={handleSave}
          onCancel={handleCancel}
          open={true}
        />
      </div>
    </div>
  );
};
