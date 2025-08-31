import { useState } from "react";
import { Button, TextField } from "../../ui";
import { Link } from "react-router-dom";
import { type LoginFormProps } from "../../types/Auth";
import { authLabelCls, authInputCls, submitCls, authGoogleCls } from "./constants";
import GoogleButton, { OrSeparation } from "./GoogleButton";
import ShowPasswordBtn from "./ShowPasswordBtn";

export default function LoginForm({
  onSubmit,
  loading = false,
  error = null,
  submitLabel = "Sign in",
  showSignupLink = true,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [roEmail, setRoEmail] = useState(true);
  const [roPassword, setRoPassword] = useState(true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit({ email, password });
  }


  return (
    <form onSubmit={handleSubmit} className="auth-form w-full max-w-sm space-y-4" autoComplete="off">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
          {error}
        </div>
      )}
      <GoogleButton className={authGoogleCls}/>
      <OrSeparation />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        variant="standard"
        required
        autoComplete="email"
        inputMode="email"
        readOnly={roEmail}
        onFocus={() => setRoEmail(false)}
        classes={{ label: authLabelCls, input: authInputCls }}
      />
      <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        variant="standard"
        required
        readOnly={roPassword}
        onFocus={() => setRoPassword(false)}
        classes={{ label: authLabelCls, input: authInputCls }}
        endAdornment={
          <ShowPasswordBtn onClick={() => setShowPassword((p) => !p)} showPassword={showPassword}/>
        }
      />
      <Button type="submit" disabled={loading} loading={loading} loadingPosition="start" fullWidth className={submitCls}>
        {submitLabel}
      </Button>
      {showSignupLink && (
        <div className="text-sm text-black text-center mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-black font-semibold hover:underline">
            Sign up for free
          </Link> 
        </div>
      )}
    </form>
  );
}
