import { useState } from "react";
import type { Income } from "../types/Income";

export const useIncomeModals = () => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState<Income | null>(null);
  const [viewReceiptDialog, setViewReceiptDialog] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);

  const handleDeleteClick = (income: Income) => {
    setIncomeToDelete(income);
    setDeleteConfirmOpen(true);
  };

  const handleViewReceipt = (income: Income) => {
    setSelectedIncome(income);
    setViewReceiptDialog(true);
  };

  const closeDeleteModal = () => {
    setDeleteConfirmOpen(false);
    setIncomeToDelete(null);
  };

  const closeReceiptModal = () => {
    setViewReceiptDialog(false);
    setSelectedIncome(null);
  };

  return {
    deleteConfirmOpen,
    incomeToDelete,
    viewReceiptDialog,
    selectedIncome,
    handleDeleteClick,
    handleViewReceipt,
    closeDeleteModal,
    closeReceiptModal,
  };
};
