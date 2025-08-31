import { Dialog, Button } from "../../../ui";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import type { Income } from "../../../types/Income";

interface DeleteConfirmationModalProps {
  open: boolean;
  income: Income | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmationModal = ({
  open,
  income,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Confirm Delete"
      footer={
        <>
          <Button
            onClick={onClose}
            className="border border-white/30 text-primary/80 bg-transparent hover:bg-primary/10"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </Button>
        </>
      }
    >
      <p className="text-primary-dark">
        Are you sure you want to delete this income?
      </p>
      {income && (
        <div className="mt-3 p-3 bg-primary/3 rounded-xl">
          <p>
            <strong>Amount: </strong>
            {formatCurrency(income.amount)}
          </p>
          <p>
            <strong>Source:</strong>{" "}
            {income.source.length > 0 ? income.source : "-"}
          </p>
          <p>
            <strong>Date:</strong> {formatDate(income.date)}
          </p>
        </div>
      )}
    </Dialog>
  );
};
