import { DefaultService } from "../api/services/DefaultService";
import { useMascotStore } from "../stores/mascotStore";
import type {
  Income,
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
}
