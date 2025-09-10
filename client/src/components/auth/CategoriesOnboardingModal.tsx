import { useEffect, useMemo, useState } from "react";
import Dialog from "../../ui/Dialog";
import { Button } from "../../ui";
import { DefaultService } from "../../api";
import { useToast } from "../../ui";
import type { Category } from "../../types/Auth";
import { modalCls, submitCls } from "./constants";
import { CheckCircle2, Circle } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
};

export default function CategoriesOnboardingModal({ open, onClose, onDone }: Props) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const cats = (await DefaultService.getCategories()) as Category[];
        if (!mounted) return;
        setAllCategories(cats || []);
        const globals = (cats || []).filter(c => c.user_id == null);
        setSelectedIds(new Set(globals.map(c => c.category_id)));
      } catch {
        if (!mounted) return;
        toast.error("Failed to load categories");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [open, toast]);

  const defaultCategories = useMemo(() => allCategories.filter(c => c.user_id == null), [allCategories]);

  const toggle = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const submit = async () => {
    setSaving(true);
    try {
      const toUse = selectedIds.size > 0
        ? defaultCategories.filter(c => selectedIds.has(c.category_id))
        : defaultCategories; 
      for (const cat of toUse) {
        try {
          await DefaultService.postCategories({ name: cat.category_name });
        } catch {
          /* ignore */
        }
      }
      toast.success("Categories ready");
      onDone();
    } catch {
      toast.error("Failed to create categories");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Choose your default categories"
      footer={
        <>
          <Button type="button" onClick={onClose} className="text-gray-200 bg-gray-200/10 hover:bg-gray-200/20" disabled={saving}>Back</Button>
          <Button type="button" onClick={submit} loading={saving} loadingPosition="start" className={`${submitCls} !bg-accent !text-primary-dark`}>
            Continue
          </Button>
        </>
        
      }
      classes={modalCls}  

    >
      <div className="space-y-3">
        <p className="text-sm text-light">Select the default categories you want to start with. If you don't choose any, we'll add all defaults.</p>
        <div className="max-h-72 overflow-auto divide-y rounded border p-2 space-y-2 scrollbar">
          {loading ? (
            <div className="p-4 text-sm text-light">Loading...</div>
          ) : defaultCategories.length === 0 ? (
            <div className="p-4 text-sm text-light">No default categories available.</div>
          ) : (
            defaultCategories.map(cat => (
              <label
                key={cat.category_id}
                className="group relative flex items-center gap-3 rounded-sm p-3 cursor-pointer bg-light/10 text-light has-[:checked]:!bg-accent/10 has-[:checked]:!border-accent"
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={selectedIds.has(cat.category_id)}
                  onChange={() => toggle(cat.category_id)}
                />
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm ring-offset-2 ring-offset-transparent group-has-[:focus-visible]:ring-2 group-has-[:focus-visible]:ring-accent">
                  <Circle className="h-5 w-5 text-light block group-has-[:checked]:hidden" />
                  <CheckCircle2 className="h-5 w-5 text-accent hidden group-has-[:checked]:block" />
                </span>
                <span className="font-semibold text-base">{cat.category_name}</span>
              </label>
            ))
          )}
        </div>
      </div>
    </Dialog>
  );
}
