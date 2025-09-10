import { Plus, Search } from "lucide-react";
import { TextField } from "../../ui";
import type { CreateFormProps } from "../../types/Category";

const CreateForm = ({ name, saving, onNameChange, onCreate, searchQuery, onSearchChange }: CreateFormProps) => {
  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-12 gap-3">
      <div className="md:col-span-4">
        <TextField
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          startAdornment={<Search className="w-4 h-4 text-white" />}
          variant="filled"
          size="medium"
          classes={{
            input: "!bg-white/10 dark:!bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-xl focus:!ring focus:!ring-primary-light focus:!border-primary-light placeholder-white/60",
            label: "hidden",
            startAdornment: "z-10",
          }}
        />
      </div>
      <div className="md:col-span-4"/>
      <div className="md:col-span-4 flex flex-col sm:flex-row gap-2 md:justify-end">
        <div className="flex-1 md:max-w-md">
          <TextField
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            fullWidth
            placeholder="New category"
            size="medium"
            variant="filled"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !saving && name.trim()) {
                onCreate();
              }
            }}
            endAdornment={
              <button
                type="button"
                onClick={onCreate}
                disabled={saving || !name.trim()}
                className="p-1.5 rounded-md bg-accent/20 hover:bg-accent/30 border border-accent/30 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Create category"
                title="Create category"
              >
                <Plus className="w-4 h-4" />
              </button>
            }
            classes={{
              input:
                "!bg-white/10 dark:!bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-xl focus:!ring focus:!ring-primary-light focus:!border-primary-light placeholder-white/60",
              label: "hidden",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateForm;
