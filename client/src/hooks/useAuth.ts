import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiError, DefaultService, type PublicUser } from '../api';

// SDK config is applied globally in src/api/config.ts

function extractErrorMessage(err: unknown, fallback = 'Unexpected error'): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === 'string' && err) return err;
  try {
    const anyErr = err as any;
    if (anyErr && typeof anyErr === 'object') {
      if (typeof anyErr.error === 'string') return anyErr.error;
      if (typeof anyErr.message === 'string') return anyErr.message;
    }
  } catch {
    // ignore
  }
  return fallback;
}

type AuthAction = 'login' | 'signup' | 'logout' | 'me';

function toFriendlyAuthMessage(err: unknown, action: AuthAction): string {
  const raw = extractErrorMessage(err, '');
  if (raw && /network|failed to fetch|ECONNREFUSED|timeout/i.test(raw)) {
    return 'Network error. Please check your connection and try again.';
  }

  if (err instanceof ApiError) {
    const status = err.status;
    // Optional server-provided error code/message
    const body: any = (err as any).body || {};
    const serverMsg: string | undefined = body?.error || body?.message;

    if (status === 401) {
      if (action === 'login') return 'Invalid email or password.';
      if (action === 'me') return 'Your session has expired. Please sign in again.';
      return 'You are not authorized. Please sign in.';
    }
    if (status === 409 && action === 'signup') {
      return 'An account with this email already exists.';
    }
    if (status === 429) {
      return 'Too many attempts. Please try again later.';
    }
    if (status === 400 || status === 422) {
      if (action === 'signup') return 'Please check your details and try again.';
      if (action === 'login') return 'Please enter a valid email and password.';
      return 'Invalid request. Please try again.';
    }
    if (status >= 500) {
      return 'Something went wrong on our side. Please try again later.';
    }
    if (serverMsg && typeof serverMsg === 'string' && serverMsg.length < 160) return serverMsg;
  }

  switch (action) {
    case 'login':
      return 'Could not sign in. Please try again.';
    case 'signup':
      return 'Could not create your account. Please try again.';
    case 'logout':
      return 'Could not sign out. Please try again.';
    case 'me':
    default:
      return 'Could not verify your session. Please try again.';
  }
}

export function useAuth() {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const me = useCallback(async () => {
    setError(null);
    try {
      const u = await DefaultService.getAuthMe();
      setUser(u);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setUser(null);
        return;
      }
      setUser(null);
      setError(extractErrorMessage(err, 'Failed to fetch session'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    me();
  }, [me]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await DefaultService.postAuthLogin({ email, password });
      const u = await DefaultService.getAuthMe();
      setUser(u);
      return u;
    } catch (err) {
      const msg = toFriendlyAuthMessage(err, 'login');
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(
    async (params: { email: string; password: string; username?: string; firstname?: string; lastname?: string }) => {
      setLoading(true);
      setError(null);
      try {
        await DefaultService.postAuthSignup({ email: params.email, password: params.password });
        const u = await DefaultService.getAuthMe();
        setUser(u);
        return u;
      } catch (err) {
        const msg = toFriendlyAuthMessage(err, 'signup');
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await DefaultService.postAuthLogout();
      setUser(null);
    } catch (err) {
      const msg = toFriendlyAuthMessage(err, 'logout');
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, error, login, signup, logout, refresh: me }),
    [user, loading, error, login, signup, logout, me]
  );

  return value;
}
