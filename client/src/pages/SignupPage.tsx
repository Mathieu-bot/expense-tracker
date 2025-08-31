import { useToast } from "../ui";
import { useAuth } from "../hooks/useAuth";
import SignupForm from "../components/auth/SignupForm";
import { type SignupFormData } from "../types/Auth";
import AuthLayout from "../components/auth/AuthLayout";

export default function SignupPage() {
  const { signup, loading, error } = useAuth();
  const toast = useToast();

  async function onSubmit({ email, password }: SignupFormData) {
    try {
      await signup({ email, password });
      toast.success("Account created successfully");
    } catch (err) {
      console.warn('Signup failed', err);
      throw err;
    }
  }

  return (
    <AuthLayout
      sideImageUrl="/auth-side.jpg"
      title="Let's create your account"
      subtitle={<span>Continue with Google or fill in the details below.</span>}
    >
      <SignupForm onSubmit={onSubmit} loading={loading} error={error} />
    </AuthLayout>
  );
}
