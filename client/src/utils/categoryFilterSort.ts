import type { Category } from "../types/Auth";
import type { SortOrder } from "../types/Category";

export function applyCategoryFilterSort(
  categories: Category[],
  query: string,
  sortOrder: SortOrder
): Category[] {
  const q = query.trim().toLowerCase();
  let arr = !q
    ? categories
    : categories.filter((c) => c.category_name.toLowerCase().includes(q));

  const getDate = (c: Category) => {
    const ts = c.updated_at ?? c.created_at;
    return ts ? new Date(ts).getTime() : 0;
  };

  if (sortOrder === "name_asc")
    arr = [...arr].sort((a, b) => a.category_name.localeCompare(b.category_name));
  else if (sortOrder === "name_desc")
    arr = [...arr].sort((a, b) => b.category_name.localeCompare(a.category_name));
  else if (sortOrder === "date_desc") arr = [...arr].sort((a, b) => getDate(b) - getDate(a));
  else if (sortOrder === "date_asc") arr = [...arr].sort((a, b) => getDate(a) - getDate(b));

  return arr;
}
