
export type LoginFormData = {
  email: string;
  password: string;
};

export type LoginFormProps = {
  onSubmit: (data: LoginFormData) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
  title?: string;
  submitLabel?: string;
  showSignupLink?: boolean;
};

export type SignupFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type SignupFormProps = {
    onSubmit: (data: SignupFormData) => void | Promise<void>;
    loading?: boolean;
    error?: string | null;
    title?: string;
    submitLabel?: string;
    showLoginLink?: boolean;
};

// Public user shape from server/services/auth.service.js `publicUserSelect`
export interface PublicUser {
  user_id: number;
  email: string;
  username: string | null;
  firstname: string | null;
  lastname: string | null;
  created_at: string;
}

export interface AuthState {
  user: PublicUser | null;
  loading: boolean;
  error: string | null;
}

export type UsernameModalProps = {
  open: boolean;
  email: string;
  username: string;
  onUsernameChange: (value: string) => void;
  onClose: () => void;
  onSkip: () => void;
  onSave: () => void;
  saving?: boolean;
};

export type Category = {
  category_id: number;
  category_name: string;
  created_at?: string;
  updated_at?: string;
  is_custom?: boolean;
  user_id?: number | null;
};