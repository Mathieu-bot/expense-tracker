import React from "react";
import { User} from "lucide-react";
import { Button } from "../../ui";

export const LoginPrompt: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-6">
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/15 shadow-2xl text-center max-w-md w-full">
        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-accent/20">
          <User className="w-10 h-10 text-accent" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Welcome Back!</h2>
        <p className="text-light/60 mb-6">
          Please log in to access your personalized profile and settings
        </p>
        <Button
          onClick={() => (window.location.href = "/login")}
          className="bg-gradient-to-r flex-col from-accent/60 to-accent/20 hover:from-accent/50 hover:accent/10 text-white rounded-2xl px-8 py-4 border-none shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto"
        >
          Go to Login Page
        </Button>
      </div>
    </div>
  );
};
