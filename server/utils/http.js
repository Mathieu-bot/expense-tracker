// Generic fetch helper with timeout and clear error messages
export const fetchWithTimeout = async (input, init = {}) => {
  const timeoutMs = Number(process.env.GOOGLE_OAUTH_TIMEOUT_MS || 10000);
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(new Error('Request timed out')), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
};
