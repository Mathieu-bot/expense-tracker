import { OpenAPI } from './index';

// Configure OpenAPI base URL and credentials globally
// Prefer env override, fallback to Vite dev proxy path
const envBase = (import.meta as any)?.env?.VITE_API_BASE as string | undefined;
OpenAPI.BASE = envBase && envBase.trim() ? envBase : '/api';
OpenAPI.WITH_CREDENTIALS = true;
