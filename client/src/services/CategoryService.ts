import type { Category } from "../types/Auth";
import { DefaultService } from "../api/services/DefaultService";
import { useMascotStore } from "../stores/mascotStore";
import { parseError, chooseMessage } from "./ServiceError";

export type ServiceResult<T> = { data: T | null; error?: string };

export const CategoryService = {
  async listAll(): Promise<Category[]> {
    const data = (await DefaultService.getCategories()) as Category[];
    return Array.isArray(data) ? data : [];
  },

  async listUser(): Promise<Category[]> {
    const all = await this.listAll();
    return all.filter((c) => c.user_id != null);
  },

  async create(input: { name: string }): Promise<Category> {
    return (await DefaultService.postCategories({
      name: input.name,
    })) as Category;
  },

  async update(id: number, input: { name?: string }): Promise<Category> {
    return (await DefaultService.putCategories(String(id), input)) as Category;
  },

  async remove(id: number): Promise<void> {
    await DefaultService.deleteCategories(String(id));
  },

  async safeListAll(): Promise<ServiceResult<Category[]>> {
    try {
      const data = await this.listAll();
      useMascotStore.getState().setExpression("success");
      return { data };
    } catch (e: unknown) {
      useMascotStore.getState().setExpression("error");
      const ctx = parseError(e);
      const msg = chooseMessage("Failed to load categories", ctx);
      return { data: null, error: msg };
    }
  },

  async safeCreate(input: { name: string }): Promise<ServiceResult<Category>> {
    try {
      const data = await this.create(input);
      useMascotStore.getState().setExpression("success");
      return { data };
    } catch (e: unknown) {
      useMascotStore.getState().setExpression("error");
      const ctx = parseError(e);
      const msg = chooseMessage("Failed to create category", ctx, {
        alreadyExistsMsg: "Category name already exists. Please choose a different name.",
        validationMsg: "Category name is invalid. Please check and try again.",
      });
      return { data: null, error: msg };
    }
  },

  async safeUpdate(id: number, input: { name?: string }): Promise<ServiceResult<Category>> {
    try {
      const data = await this.update(id, input);
      useMascotStore.getState().setExpression("success");
      return { data };
    } catch (e: unknown) {
      useMascotStore.getState().setExpression("error");
      const ctx = parseError(e);
      const msg = chooseMessage("Failed to update category", ctx, {
        alreadyExistsMsg: "Category name already exists. Please choose a different name.",
        validationMsg: "Category name is invalid. Please check and try again.",
      });
      return { data: null, error: msg };
    }
  },

  async safeRemove(id: number): Promise<ServiceResult<void>> {
    try {
      await this.remove(id);
      useMascotStore.getState().setExpression("success");
      return { data: null };
    } catch (e: unknown) {
      useMascotStore.getState().setExpression("error");
      const ctx = parseError(e);
      const msg = chooseMessage("Failed to delete category.", ctx, {
        cannotDeleteMsg: "Cannot delete: the category is used by expenses.",
      });
      return { data: null, error: msg };
    }
  },
};
