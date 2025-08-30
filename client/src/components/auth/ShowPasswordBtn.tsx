
import { Eye, EyeOff } from "lucide-react";
import { IconButton } from "../../ui";

type ShowPasswordBtnProps = {
    onClick() : void,
    showPassword: boolean,
}

export default function ShowPasswordBtn({onClick, showPassword} : ShowPasswordBtnProps) {
    return (
        <IconButton
        size="small"
        type="button"
        aria-label={showPassword ? "Hide password" : "Show password"}
        onClick={onClick}
        edge="end"
        className="text-gray-500 hover:bg-gray-400 hover:text-gray-700 hover: focus:ring-2 focus:ring-offset-2 focus:ring-primary !border-none"
      >
        {showPassword ? (
          <EyeOff className="w-5 h-5" />
        ) : (
          <Eye className="w-5 h-5" />
        )}
      </IconButton>
    )
}