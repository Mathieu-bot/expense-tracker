import React from "react";
import { Palette } from "lucide-react";
import ThemeToggle from "../common/ThemeToggle";

export const AppearanceTab: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-primary-light/10 to-primary-dark/10 backdrop-blur-xl rounded-2xl p-8 border border-white/5 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-400/10 flex items-center justify-center">
          <Palette className="w-5 h-5 text-purple-400" />
        </div>
        <h2 className="text-xl font-semibold text-light/90">
          Appearance Settings
        </h2>
      </div>

      <div className="py-10 flex w-full items-center justify-center">
       <ThemeToggle/>
      </div>
    </div>
  );
};
