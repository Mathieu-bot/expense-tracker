import { Button } from "../../ui";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";

export type BulkFloatingActionProps = {
  bulkMode: boolean;
  selectedCount: number;
  onClick: () => void;
};

const BulkFloatingAction = ({ bulkMode, selectedCount, onClick }: BulkFloatingActionProps) => {
  return (
    <AnimatePresence>
      {bulkMode && selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-6 right-40 z-50"
        >
          <div className="flex items-center gap-3 bg-red-600/90 dark:bg-red-600/80 text-white rounded-full shadow-2xl backdrop-blur-xl px-3 py-2 border border-white/10">
            <span className="text-xs md:text-sm hidden sm:inline">{selectedCount} selected</span>
            <Button
              onClick={onClick}
              size="small"
              className="bg-red-700 hover:bg-red-800 border-none text-white"
              startIcon={<Trash2 size={16} />}
            >
              Delete selected
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BulkFloatingAction;