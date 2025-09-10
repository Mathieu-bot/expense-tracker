import { Button, Dialog } from "../../../ui";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  names: string[];
};

const BulkDeleteModal = ({ open, onClose, onConfirm, loading, names }: Props) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={<span className="text-red-600 font-bold text-xl">Delete selected</span>}
      classes={{
        panel: "bg-white/95 dark:bg-primary-light/20 border border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl",
        header: "border-b border-gray-200 dark:border-gray-700",
        body: "text-gray-700 dark:text-gray-200",
        footer: "border-t border-gray-200 dark:border-gray-700",
        close: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center",
        overlay: "backdrop-blur-md",
      }}
      footer={
        <>
          <Button
            onClick={onClose}
            className="border border-gray-300 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:border-gray-600 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
            size="small"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 border-none text-white hover:bg-red-700"
            size="small"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </>
      }
    >
      <p className="mb-2">Are you sure you want to delete the following categories?</p>
      <ul className="max-h-40 overflow-auto text-sm list-disc pl-5 space-y-1">
        {names.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">This action cannot be undone.</p>
    </Dialog>
  );
};

export default BulkDeleteModal;
