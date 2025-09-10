import { Button, Dialog } from "../../../ui";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  categoryName?: string;
};

const DeleteConfirmationModal = ({ open, onClose, onConfirm, loading, categoryName }: Props) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-500/15 text-red-500">!</span>
          <span>Confirm Delete</span>
        </div>
      }
      classes={{
        panel: "bg-white/95 dark:bg-primary-light/20 border border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl",
        header: "border-b border-gray-200 dark:border-gray-700",
        title: "text-red-600 font-bold text-xl",
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
            {loading ? "Deleting..." : "Delete Category"}
          </Button>
        </>
      }
    >
      <p>
        {categoryName ? (
          <>
            Are you sure you want to delete the category <strong>{categoryName}</strong>? This action cannot be undone.
          </>
        ) : (
          <>Are you sure you want to delete this category? This action cannot be undone.</>
        )}
      </p>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
