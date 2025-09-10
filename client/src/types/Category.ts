import type { Category } from "./Auth";

export type ViewMode = "list" | "grid";
export type SortOrder = "name_asc" | "name_desc" | "date_desc" | "date_asc";

export type CreateFormProps = {
  name: string;
  saving: boolean;
  onNameChange: (v: string) => void;
  onCreate: () => void;
  searchQuery: string;
  onSearchChange: (v: string) => void;
};

export type ListViewProps = {
  categories: Category[];
  editingId: number | null;
  editName: string;
  onEditNameChange: (v: string) => void;
  onStartEdit: (c: Category) => void;
  onSaveEdit: (id: number) => void;
  onCancelEdit: () => void;
  onRemove: (id: number) => void;
  saving: boolean;
  highlightQuery?: string;
  totalsThisMonth?: Record<number, number>;
  
  bulkMode?: boolean;
  selectedIds?: number[];
  onToggleSelect?: (id: number) => void;
  onOpenDetails?: (c: Category) => void;
};

export type GridViewProps = ListViewProps;

export type HeaderProps = {
  viewMode: ViewMode;
  onToggleView: () => void;
  sortOrder: SortOrder;
  onSortChange: (v: SortOrder) => void;
  
  bulkMode?: boolean;
  onToggleBulkMode?: () => void;
  selectedCount?: number;
  onBulkDelete?: () => void;
};

