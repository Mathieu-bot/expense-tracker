import crypto from 'crypto';
import { BadRequestError } from '../utils/errors.js';
import { fetchWithTimeout } from '../utils/http.js';

const GOOGLE_AUTH_BASE = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

export const buildGoogleAuthUrl = ({ redirectUri }) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET; // only to validate presence
  if (!clientId || !clientSecret) throw new BadRequestError('Google OAuth not configured');

  const state = crypto.randomBytes(16).toString('hex');
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'offline',
    prompt: 'consent',
  });
  return { url: `${GOOGLE_AUTH_BASE}?${params.toString()}`, state };
};

export const exchangeGoogleCodeForProfile = async ({ code, redirectUri }) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new BadRequestError('Google OAuth not configured');

  const body = new URLSearchParams({
    code: String(code),
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  }).toString();

  let tokenResp;
  try {
    tokenResp = await fetchWithTimeout(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
  } catch (e) {
    throw new BadRequestError(`Token exchange network error: ${(e && e.message) || e}`);
  }
  if (!tokenResp.ok) {
    const t = await tokenResp.text().catch(() => '');
    throw new BadRequestError(`Token exchange failed: ${t || tokenResp.status}`);
  }
  const tokenJson = await tokenResp.json();
  const accessToken = tokenJson.access_token;
  if (!accessToken) throw new BadRequestError('Missing access token');

  let userResp;
  try {
    userResp = await fetchWithTimeout(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (e) {
    throw new BadRequestError(`Userinfo network error: ${(e && e.message) || e}`);
  }
  if (!userResp.ok) {
    const t = await userResp.text().catch(() => '');
    throw new BadRequestError(`Failed to fetch userinfo: ${t || userResp.status}`);
  }
  const profile = await userResp.json();
  return profile;
};
