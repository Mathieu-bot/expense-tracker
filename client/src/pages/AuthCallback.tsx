import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation() as ReturnType<typeof useLocation> & {
    state?: { from?: string } | null;
  };
  const { refresh } = useAuth();

  useEffect(() => {
    // the backend should have set the session cookie. Just refresh the session and redirect.
    const from = (location.state && typeof location.state === 'object' && location.state?.from) || "/";
    (async () => {
      try {
        await refresh();
      } finally {
        navigate(from, { replace: true });
      }
    })();
  }, [navigate, refresh, location.state]);

  return (
    <div className="min-h-screen flex items-center justify-center p-24">
      <div className="text-gray-700">Finishing sign-in…</div>
    </div>
  );
}
