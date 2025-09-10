import type { Category } from "../types/Auth";
import { DefaultService } from "../api/services/DefaultService";
import { useMascotStore } from "../stores/mascotStore";

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
    } catch (e: any) {
      useMascotStore.getState().setExpression("error");
      return { data: null, error: e?.message ?? "Failed to load categories" };
    }
  },

  async safeCreate(input: { name: string }): Promise<ServiceResult<Category>> {
    try {
      const data = await this.create(input);
      useMascotStore.getState().setExpression("success");
      return { data };
    } catch (e: any) {
      useMascotStore.getState().setExpression("error");
      const raw = String(e?.message ?? "");
      const serverMsg: string | undefined = e?.body?.error ?? (typeof e?.body === 'string' ? e.body : undefined);
      let msg = "Failed to create category";
      if (e?.status === 409 || /already exists/i.test(raw) || /already exists/i.test(serverMsg ?? "")) {
        msg = "Category name already exists. Please choose a different name.";
      } else if (/validation/i.test(raw)) {
        msg = serverMsg || "Category name is invalid. Please check and try again.";
      } else if (serverMsg) {
        msg = serverMsg;
      } else if (raw) {
        msg = raw;
      }
      return { data: null, error: msg };
    }
  },

  async safeUpdate(id: number, input: { name?: string }): Promise<ServiceResult<Category>> {
    try {
      const data = await this.update(id, input);
      useMascotStore.getState().setExpression("success");
      return { data };
    } catch (e: any) {
      useMascotStore.getState().setExpression("error");
      const raw = String(e?.message ?? "");
      const serverMsg: string | undefined = e?.body?.error ?? (typeof e?.body === 'string' ? e.body : undefined);
      let msg = "Failed to update category";
      if (e?.status === 409 || /already exists/i.test(raw) || /already exists/i.test(serverMsg ?? "")) {
        msg = "Category name already exists. Please choose a different name.";
      } else if (/validation/i.test(raw)) {
        msg = serverMsg || "Category name is invalid. Please check and try again.";
      } else if (serverMsg) {
        msg = serverMsg;
      } else if (raw) {
        msg = raw;
      }
      return { data: null, error: msg };
    }
  },

  async safeRemove(id: number): Promise<ServiceResult<void>> {
    try {
      await this.remove(id);
      useMascotStore.getState().setExpression("success");
      return { data: null };
    } catch (e: any) {
      useMascotStore.getState().setExpression("error");
      const raw = String(e?.message ?? "");
      const serverMsg: string | undefined = e?.body?.error ?? (typeof e?.body === 'string' ? e.body : undefined);
      let msg = "Failed to delete category.";
      if (raw.includes("Cannot delete category") || e?.status === 409) {
        msg = serverMsg || "Cannot delete: the category is used by expenses.";
      } else if (serverMsg) {
        msg = serverMsg;
      }
      return { data: null, error: msg };
    }
  },
};
