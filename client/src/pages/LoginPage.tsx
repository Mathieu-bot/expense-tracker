import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../ui";
import { useAuth } from "../hooks/useAuth";
import { type LoginFormData } from "../types/Auth";
import LoginForm from "../components/auth/LoginForm";
import AuthLayout from "../components/auth/AuthLayout";

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const toast = useToast();
  const from = location.state?.from || "/";

  async function onSubmit({ email, password }: LoginFormData) {
    try {
      await login(email, password);
      toast.success("Signed in successfully");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    }
  }

  return (
    <AuthLayout
      sideImageUrl="/auth-side.jpg"
      title="Welcome back"
      subtitle={<span>Continue with Google or enter your details.</span>}
   >
      <LoginForm onSubmit={onSubmit} loading={loading} error={error} />
    </AuthLayout>
  );
}
