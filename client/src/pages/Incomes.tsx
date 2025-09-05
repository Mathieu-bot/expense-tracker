import { useNavigate } from "react-router-dom";
import { useToast } from "../ui";
import { IncomeService } from "../services/IncomeService";
import { useIncomes } from "../hooks/useIncomes";
import { useIncomeFilters } from "../hooks/useIncomeFilters";
import { useIncomeCharts } from "../hooks/useIncomeCharts";
import { useIncomeModals } from "../hooks/useIncomeModals";
import {
  IncomeHeader,
  IncomeChart,
  IncomeFilters,
  DeleteConfirmationModal,
  ReceiptModal,
} from "../components/Income";
import { IncomeList } from "../components/Income/IncomeList";
import Receipt from "../components/Income/Receipt";
import { Plus, Wallet } from "lucide-react";
import { StatsCards } from "../components/Income/IncomeHeader/StatsCards";
import type { Income } from "../types/Income";
import { useState, useMemo } from "react";

export const Incomes = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const { incomes: fetchedIncomes, loading, refetch } = useIncomes();

  const localIncomes = useMemo(() => fetchedIncomes || [], [fetchedIncomes]);
  const {
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    dateRange,
    dateError,
    handleStartDateChange,
    handleEndDateChange,
    clearDateFilter,
    filteredAndSortedIncomes,
    totalIncome,
    totalIncomeThisMonth,
  } = useIncomeFilters({ incomes: localIncomes });

  const { lineChartData } = useIncomeCharts({
    incomes: localIncomes,
  });

  const {
    deleteConfirmOpen,
    incomeToDelete,
    viewReceiptDialog,
    selectedIncome,
    handleDeleteClick,
    handleViewReceipt,
    closeDeleteModal,
    closeReceiptModal,
  } = useIncomeModals();

  const handleEdit = (income: Income) => {
    navigate(`/incomes/${income.income_id}/edit`);
  };

  const handleDeleteConfirm = async () => {
    if (!incomeToDelete) return;

    try {
      await IncomeService.deleteIncome(incomeToDelete.income_id.toString());
      toast.success("Income deleted successfully");
      closeDeleteModal();

      refetch();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete income";
      toast.error(message);
    }
  };

  const handleNewIncome = () => {
    navigate("/incomes/new");
  };

  const [chartType, setChartType] = useState<"timeline" | "cumulative">(
    "timeline"
  );

  return (
    <>
      <div className="relative z-2 mb-10 mt-30 mx-auto text-light max-w-7xl px-6 xl:ml-29 lg:ml-20">
        <IncomeHeader totalIncome={totalIncome} onNewIncome={handleNewIncome} />

        <StatsCards
          totalIncomeThisMonth={totalIncomeThisMonth}
          totalIncome={totalIncome}
          incomeCount={localIncomes.length}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-br  bg-white/10 dark:from-primary-light/10 dark:to-primary-dark/10 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 dark:bg-accent/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-400/10 dark:bg-cyan-400/5 rounded-full translate-y-12 -translate-x-12"></div>

            <div className="flex justify-between items-center mb-6 relative z-10">
              <h2 className="text-xl font-semibold text-light/90 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-accent" />
                Recent Incomes
              </h2>
            </div>

            <div className="flex gap-4 h-52 relative z-10">
              {loading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="size-8 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
                </div>
              ) : localIncomes.length === 0 ? (
                <div
                  onClick={handleNewIncome}
                  className="bg-gradient-to-br w-36 from-accent/10 to-amber-400/10 dark:from-accent/8 dark:to-amber-400/8 backdrop-blur-md rounded-xl p-4 border border-dashed border-accent/20 hover:border-accent/30 transition-all duration-300 cursor-pointer flex items-center justify-center flex-col gap-2 group"
                >
                  <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Plus className="text-accent w-5 h-5 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-accent/80 text-xs font-medium">
                    Add Income
                  </span>
                </div>
              ) : (
                <>
                  <div
                    onClick={handleNewIncome}
                    className="bg-gradient-to-br w-36 from-accent/10 to-amber-400/10 dark:from-accent/8 dark:to-amber-400/8 backdrop-blur-md rounded-xl p-4 border border-dashed border-accent/20 hover:border-accent/30 transition-all duration-300 cursor-pointer flex items-center justify-center flex-col gap-2 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <Plus className="text-accent w-5 h-5 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-accent/80 text-xs font-medium">
                      Add Income
                    </span>
                  </div>
                  <Receipt
                    items={localIncomes.slice(0, 2)}
                    onViewReceipt={handleViewReceipt}
                  />
                </>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br bg-white/10 dark:from-primary-light/10 dark:to-primary-dark/10 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 dark:bg-accent/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-400/10 dark:bg-cyan-400/5 rounded-full translate-y-12 -translate-x-12"></div>

            <IncomeChart
              lineChartData={lineChartData}
              loading={loading}
              isEmpty={localIncomes.length === 0}
              chartType={chartType}
              onChartTypeChange={setChartType}
            />
          </div>
        </div>

        <IncomeFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          dateRange={dateRange}
          dateError={dateError}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          onClearDateFilter={clearDateFilter}
        />

        <div className="bg-gradient-to-br bg-white/10 dark:from-primary-light/10 dark:to-primary-dark/10 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32  rounded-full -translate-y-16 translate-x-16 bg-cyan-400/10 dark:bg-cyan-400/5"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 dark:bg-accent/5 rounded-full translate-y-12 -translate-x-12"></div>

          <IncomeList
            incomes={filteredAndSortedIncomes}
            loading={loading}
            error={null}
            searchQuery={searchQuery}
            sortOrder={sortOrder}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onViewReceipt={handleViewReceipt}
            onRefetch={refetch}
          />
        </div>
      </div>

      <DeleteConfirmationModal
        open={deleteConfirmOpen}
        income={incomeToDelete}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
      />

      <ReceiptModal
        open={viewReceiptDialog}
        income={selectedIncome}
        onClose={closeReceiptModal}
      />
    </>
  );
};
