import { DefaultService } from "../api/services/DefaultService";
import { useMascotStore } from "../stores/mascotStore";
import type {
  Expense,
  CreateExpenseRequest,
  UpdateExpenseRequest,
} from "../types/Expense";

export class ExpenseService {
  // GET all expenses with optional filtering
  static async getExpenses(
    start?: string,
    end?: string,
    category?: string,
    type?: "recurring" | "one-time"
  ) {
    try {
      const response = await DefaultService.getExpenses(
        start,
        end,
        category,
        type
      );
      useMascotStore.getState().setExpression("success");
      // Server wraps payload as { success, data, ... }
      const data = (response as any)?.data ?? response;
      return data as Expense[];
    } catch (error) {
      useMascotStore.getState().setExpression("error");
      console.error("Error fetching expenses:", error);
      throw new Error("Failed to fetch expenses");
    }
  }

  // GET expense by id
  static async getExpenseById(id: string) {
    try {
      const response = await DefaultService.getExpenses1(id);
      useMascotStore.getState().setExpression("success");
      const data = (response as any)?.data ?? response;
      return data as Expense;
    } catch (error) {
      useMascotStore.getState().setExpression("error");
      console.error(`Error fetching expense ${id}:`, error);
      throw new Error("Failed to fetch expense");
    }
  }

  // POST expense (multipart)
  static async createExpense(expenseData: CreateExpenseRequest) {
    try {
      const payload = {
        amount: Number(expenseData.amount),
        date: expenseData.date as unknown as string,
        categoryId: expenseData.categoryId,
        description: expenseData.description,
        type: expenseData.type,
        startDate: expenseData.startDate,
        endDate: expenseData.endDate,
        receipt: expenseData.receipt as unknown as Blob | undefined,
      };
      const response = await DefaultService.postExpenses(payload);
      useMascotStore.getState().setExpression("success");
      const data = (response as any)?.data ?? response;
      return data as Expense;
    } catch (error) {
      useMascotStore.getState().setExpression("error");
      console.error("Error creating expense:", error);
      throw new Error("Failed to create expense");
    }
  }

  // UPDATE expense (multipart)
  static async updateExpense(id: string, expenseData: UpdateExpenseRequest) {
    try {
      const payload = {
        amount:
          expenseData.amount !== undefined
            ? Number(expenseData.amount)
            : undefined,
        date: expenseData.date as unknown as string | undefined,
        categoryId: expenseData.categoryId,
        description: expenseData.description,
        type: expenseData.type,
        startDate: expenseData.startDate,
        endDate: expenseData.endDate,
        receipt: expenseData.receipt as unknown as Blob | undefined,
      };
      const response = await DefaultService.putExpenses(id, payload);
      useMascotStore.getState().setExpression("success");
      const data = (response as any)?.data ?? response;
      return data as Expense;
    } catch (error) {
      useMascotStore.getState().setExpression("error");
      console.error(`Error updating expense ${id}:`, error);
      throw new Error("Failed to update expense");
    }
  }

  // DELETE expense
  static async deleteExpense(id: string) {
    try {
      await DefaultService.deleteExpenses(id);
      useMascotStore.getState().setExpression("success");
    } catch (error) {
      useMascotStore.getState().setExpression("error");
      console.error(`Error deleting expense ${id}:`, error);
      throw new Error("Failed to delete expense");
    }
  }
}
