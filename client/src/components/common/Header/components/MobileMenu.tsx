import { X, Menu } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MobileMenu = ({ isOpen, onToggle }: MobileMenuProps) => {
  return (
    <div className="lg:hidden">
      <button
        onClick={onToggle}
        className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors duration-200"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  );
};

export default MobileMenu;
