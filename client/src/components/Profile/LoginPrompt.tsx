import React from "react";
import { User } from "lucide-react";
import { Button } from "../../ui";

export const LoginPrompt: React.FC = () => {
  return (
    <div className="min-h-screen ml-10 flex items-center justify-center">
      <div className="bg-gradient-to-br from-primary-light/10 to-primary-dark/10 backdrop-blur-xl rounded-2xl p-8 border border-white/5 shadow-lg text-center max-w-md">
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <User className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-2xl font-bold text-light/90 mb-4">Please Log In</h2>
        <p className="text-light/60 mb-6">
          You need to be logged in to view your profile
        </p>
        <Button
          onClick={() => (window.location.href = "/login")}
          size="medium"
          className="bg-accent/60 border-none text-white"
        >
          Go to Login
        </Button>
      </div>
    </div>
  );
};
