import { Dialog, Button } from "../../../ui";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import type { Income } from "../../../types/Income";

interface ReceiptModalProps {
  open: boolean;
  income: Income | null;
  onClose: () => void;
}

export const ReceiptModal = ({ open, income, onClose }: ReceiptModalProps) => {
  if (!income) return null;

  return (
    <Dialog
      classes={{
        body: "text-primary-dark",
        title: "text-primary-dark",
      }}
      open={open}
      onClose={onClose}
      title="Income Receipt"
      footer={
        <Button
          onClick={onClose}
          className="bg-accent/90 text-primary-dark font-semibold hover:bg-accent"
        >
          Close
        </Button>
      }
    >
      <div className="p-4">
        <div className="bg-primary/3 rounded-xl p-6 border border-white/10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-primary-dark">
                {income.source}
              </h3>
              <p className="text-primary-dark">{formatDate(income.date)}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-accent">
                {formatCurrency(income.amount)}
              </p>
            </div>
          </div>

          {income.description && (
            <div className="mb-6">
              <p className="text-primary-dark">{income.description}</p>
            </div>
          )}

          <div className="pt-4 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-primary-dark">Income Number</span>
              <span className="text-primary-dark">#{income.income_id}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-primary-dark">Created</span>
              <span className="text-primary-dark">
                {formatDate(income.creation_date)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
