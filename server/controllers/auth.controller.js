import jwt from 'jsonwebtoken';
import { signupUser, loginUser, getPublicUser } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { BadRequestError } from '../utils/errors.js';
import isStrongPassword from 'validator/lib/isStrongPassword.js';

const TOKEN_COOKIE_NAME = 'token';

const setAuthCookie = (res, payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('Missing JWT_SECRET');
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

export const signup = asyncHandler(async (req, res) => {
  const { email, password, username, firstname, lastname } = req.body;
  if (!email || !password) throw new BadRequestError('Email and password are required');
  if (!isStrongPassword(String(password), { minLength: 6, minLowercase: 0, minUppercase: 1, minNumbers: 1, minSymbols: 0 })) {
    throw new BadRequestError('Password must be at least 6 characters and include at least one uppercase letter and one number');
  }
  const user = await signupUser({ email: req.body.email, password, username, firstname, lastname });
  setAuthCookie(res, { user_id: user.user_id, email: user.email });
  return res.status(201).json(user);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new BadRequestError('Email and password are required');
  const publicUser = await loginUser({ email: req.body.email, password });
  setAuthCookie(res, { user_id: publicUser.user_id, email: publicUser.email });
  return res.json(publicUser);
});

export const me = asyncHandler(async (req, res) => {
  const user = await getPublicUser(req.user.user_id);
  return res.json(user);
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie(TOKEN_COOKIE_NAME, { path: '/', sameSite: 'lax' });
  return res.status(204).send();
});
