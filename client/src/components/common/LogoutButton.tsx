import { Button } from "../../ui";
import { useToast } from "../../ui";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { ButtonProps } from "../../ui/Button";

type Props = Omit<ButtonProps, "onClick" | "children"> & {
  children?: React.ReactNode;
};

const LogoutButton = ({ children = "Logout", ...btnProps }: Props) => {
  const { logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  async function onLogout() {
    try {
      
      await logout();
      toast.success("Logged out. See you soon!");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Logout failed");
    }
  }

  return (
    <Button onClick={onLogout} {...btnProps}>
      {children}
    </Button>
  );
}

export default LogoutButton;
export { LogoutButton };
