import React from "react";
import { Frown } from "lucide-react";
import { Button } from "../../ui";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen ml-10 flex items-center justify-center">
      <div className="bg-gradient-to-br w-[23vw] from-primary-light/10 to-primary-dark/10 backdrop-blur-xl rounded-2xl p-8 border border-white/5 shadow-lg text-center max-w-md">
        <div className="w-16 h-16 bg-red-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Frown className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-light/90 mb-2">Error</h2>
        <p className="text-light/60 mb-6">{error}</p>
        <Button
          onClick={onRetry}
          size="medium"
          className="bg-white/10 hover:bg-white/20 text-light/90 border border-white/10"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
};
