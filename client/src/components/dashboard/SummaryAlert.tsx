import React, { type Dispatch } from "react";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SummaryAlert({
  alert,
  message,
  open,
  setIsOpen,
}: {
  alert: boolean;
  message: string;
  open: boolean;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          className={`fixed top-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl shadow-lg backdrop-blur-lg z-[99] flex items-center gap-3 w-fit max-w-md
            ${alert ? "bg-red-600/90" : "bg-green-600/90"}`}
        >
          <div className="flex-shrink-0">
            {alert ? (
              <AlertTriangle className="text-white h-6 w-6" />
            ) : (
              <CheckCircle2 className="text-white h-6 w-6" />
            )}
          </div>

          <span className="text-white text-sm sm:text-base font-medium leading-snug">
            {message} Ar
          </span>

          <button
            onClick={() => setIsOpen(false)}
            className="ml-auto text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
