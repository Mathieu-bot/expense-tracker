import { useState, useRef } from "react";
import type { Income } from "../types/Income";
import { IncomeList } from "../components/Income/IncomeList";
import { Button, Dialog, useToast, DatePicker } from "../ui";
import { IncomeService } from "../services/IncomeService";
import { useNavigate } from "react-router-dom";
import { validateDateRange } from "../utils/validators";

export const Incomes = () => {
  const [dateFilter, setDateFilter] = useState<{
    start?: string;
    end?: string;
  }>({});
  const [dateError, setDateError] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState<Income | null>(null);

  const toast = useToast();
  const incomeListRef = useRef<{ refetch: () => void }>(null);
  const navigate = useNavigate();

  const handleEdit = (income: Income) => {
    navigate(`/incomes/${income.income_id}/edit`);
  };

  const handleDeleteClick = (income: Income) => {
    setIncomeToDelete(income);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!incomeToDelete) return;

    try {
      await IncomeService.deleteIncome(incomeToDelete.income_id.toString());
      toast.success("Income deleted successfully");
      setDeleteConfirmOpen(false);
      setIncomeToDelete(null);
      incomeListRef.current?.refetch();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete income";
      toast.error(message);
    }
  };

  const handleNewIncome = () => {
    navigate("/incomes/new");
  };

  const handleStartDateChange = (date: Date | null) => {
    const newStart = date ? date.toISOString().split("T")[0] : undefined;
    const err = validateDateRange(newStart, dateFilter.end);
    setDateError(err);
    setDateFilter((prev) => ({ ...prev, start: newStart }));
  };

  const handleEndDateChange = (date: Date | null) => {
    const newEnd = date ? date.toISOString().split("T")[0] : undefined;
    const err = validateDateRange(dateFilter.start, newEnd);
    setDateError(err);
    setDateFilter((prev) => ({ ...prev, end: newEnd }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto relative z-2">
      <div className="flex pt-20 justify-between items-center mb-6">
        <Button
          className="text-white border-white border"
          onClick={handleNewIncome}
          size="large"
        >
          Add New Income
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6 relative">
        {dateError && (
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded-xl shadow-md animate-bounce">
            {dateError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <DatePicker
            value={dateFilter.start ? new Date(dateFilter.start) : null}
            onChange={handleStartDateChange}
            label="Start Date"
            size="medium"
          />
          <DatePicker
            value={dateFilter.end ? new Date(dateFilter.end) : null}
            onChange={handleEndDateChange}
            label="End Date"
            size="medium"
          />
        </div>

        <IncomeList
          ref={incomeListRef}
          startDate={dateFilter.start}
          endDate={dateFilter.end}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </div>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Confirm Delete"
        footer={
          <>
            <Button
              onClick={() => setDeleteConfirmOpen(false)}
              className="border border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </Button>
          </>
        }
      >
        <p>Are you sure you want to delete this income?</p>
        {incomeToDelete && (
          <div className="mt-3 p-3 bg-gray-50 rounded">
            <p>
              <strong>Amount: </strong>
              {incomeToDelete.amount.toFixed(2)} MGA
            </p>
            <p>
              <strong>Source:</strong>{" "}
              {incomeToDelete.source.length > 0 ? incomeToDelete.source : "-"}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(incomeToDelete.date).toLocaleDateString()}
            </p>
          </div>
        )}
      </Dialog>
    </div>
  );
};
