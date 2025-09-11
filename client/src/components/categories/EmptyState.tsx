import { Grid3X3, RefreshCw } from "lucide-react";
import { Button } from "../../ui";

type Props = {
  onRefresh?: () => void;
  message?: string;
};

const CategoriesEmptyState = ({ onRefresh, message }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-800 dark:text-light/50">
      <div className="w-16 h-16 rounded-full dark:bg-none bg-gradient-to-br from-cyan-100 to-blue-100 dark:bg-white/5 flex items-center justify-center mb-4">
        <Grid3X3 className="w-8 h-8 text-cyan-600 dark:text-light/50" />
      </div>
      <p className="text-lg mb-4">{message ?? 'No categories found'}</p>
      {onRefresh && (
        <Button
          onClick={onRefresh}
          size="small"
          className="bg-gradient-to-r from-cyan-400/20 to-blue-400/20 hover:from-cyan-400/30 hover:to-blue-400/30 border border-cyan-200 text-cyan-700 backdrop-blur-sm hover:shadow-cyan-200/50 transition-all duration-300 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-light/90"
          startIcon={<RefreshCw className="w-3 h-3" />}
        >
          Refresh
        </Button>
      )}
    </div>
  );
};

export default CategoriesEmptyState;
