import React from "react";
import { Frown} from "lucide-react";
import { Button } from "../../ui";

interface ErrorStateProps {
  error: string | null;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-6">
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/15 shadow-2xl text-center max-w-md w-full">
        <div className="w-20 h-20 bg-red-400/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-400/20">
          <Frown className="w-10 h-10 text-red-400" />
        </div>
        <h2 className=" text-white mb-3">
          Oops! Something went wrong
        </h2>
        <p className="text-light/60 mb-6">{error}</p>
        <Button
          onClick={onRetry}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-2xl px-6 py-3 transition-all duration-300 flex items-center gap-2 mx-auto"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
};
