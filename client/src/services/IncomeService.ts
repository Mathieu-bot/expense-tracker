import { DefaultService } from "../api/services/DefaultService";
import { useMascotStore } from "../stores/mascotStore";
import type {
  Income,
  IncomeCategory,
  CreateIncomeRequest,
  UpdateIncomeRequest,
} from "../types/Income";

export class IncomeService {
  //GET all incomes with optional filtering
  static async getIncomes(start?: string, end?: string) {
    try {
      const response = await DefaultService.getIncomes(start, end);
      useMascotStore.getState().setExpression("success");
      return response as Income[];
    } catch (error) {
      useMascotStore.getState().setExpression("error");

      console.error("Error fetching incomes:", error);
      throw new Error("Failed to fetch incomes");
    }
  }

  //GET income by id
  static async getIncomeById(id: string) {
    try {
      const response = await DefaultService.getIncomes1(id);
      useMascotStore.getState().setExpression("success");

      return response as Income;
    } catch (error) {
      useMascotStore.getState().setExpression("error");

      console.error(`Error fetching income ${id}:`, error);
      throw new Error("Failed to fetch income");
    }
  }

  //POST income
  static async createIncome(incomeData: CreateIncomeRequest) {
    try {
      const requestData = {
        ...incomeData,
        amount: Number(incomeData.amount),
      };

      if (incomeData.date) {
        requestData.date = incomeData.date;
      }
      const response = await DefaultService.postIncomes(requestData);
      useMascotStore.getState().setExpression("success");
      return response as Income;
    } catch (error) {
      useMascotStore.getState().setExpression("error");
      console.error("Error creating income:", error);
      throw new Error("Failed to create income");
    }
  }

  //UPDATE income
  static async updateIncome(id: string, incomeData: UpdateIncomeRequest) {
    try {
      const requestData = { ...incomeData };
      if (incomeData.amount !== undefined) {
        requestData.amount = Number(incomeData.amount);
      }

      const response = await DefaultService.putIncomes(id, requestData);
      useMascotStore.getState().setExpression("success");

      return response as Income;
    } catch (error) {
      useMascotStore.getState().setExpression("error");

      console.error(`Error updating income ${id}:`, error);
      throw new Error("Failed to update income");
    }
  }

  //DELETE income
  static async deleteIncome(id: string) {
    try {
      await DefaultService.deleteIncomes(id);
      useMascotStore.getState().setExpression("success");
    } catch (error) {
      useMascotStore.getState().setExpression("error");

      console.error(`Error deleting income ${id}:`, error);
      throw new Error("Failed to delete income");
    }
  }

  //GET ALL income categories (custom and system)
  static async getIncomeCategories() {
    try {
      const response = await DefaultService.getIncomesCategories();
      useMascotStore.getState().setExpression("success");

      return response as IncomeCategory[];
    } catch (error) {
      useMascotStore.getState().setExpression("error");

      console.error("Error fetching income categories:", error);
      throw new Error("Failed to fetch income categories");
    }
  }

  //GET custom categories
  static async getCustomIncomeCategories() {
    try {
      const response = await DefaultService.getIncomesCustomCategories();
      useMascotStore.getState().setExpression("success");

      return response as IncomeCategory[];
    } catch (error) {
      useMascotStore.getState().setExpression("error");

      console.error("Error fetching custom income categories:", error);
      throw new Error("Failed to fetch custom income categories");
    }
  }

  //POST new category
  static async createIncomeCategory(name: string) {
    try {
      const response = await DefaultService.postIncomesCustomCategories({
        category_name: name,
      });
      useMascotStore.getState().setExpression("success");

      return response as IncomeCategory;
    } catch (error) {
      useMascotStore.getState().setExpression("error");

      console.error("Error creating income category:", error);
      throw new Error("Failed to create income category");
    }
  }

  //UPDATE a category
  static async updateIncomeCategory(
    id: string,
    name: string
  ): Promise<IncomeCategory> {
    try {
      const response = await DefaultService.putIncomesCustomCategories(id, {
        category_name: name,
      });
      useMascotStore.getState().setExpression("success");

      return response as IncomeCategory;
    } catch (error) {
      useMascotStore.getState().setExpression("error");

      console.error(`Error updating income category ${id}:`, error);
      throw new Error("Failed to update income category");
    }
  }

  //DELETE category
  static async deleteIncomeCategory(id: string) {
    try {
      useMascotStore.getState().setExpression("success");

      await DefaultService.deleteIncomesCustomCategories(id);
    } catch (error) {
      useMascotStore.getState().setExpression("error");

      console.error(`Error deleting income category ${id}:`, error);
      throw new Error("Failed to delete income category");
    }
  }
}
