import bcrypt from 'bcrypt';
import { prisma } from '../db/prisma.js';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/errors.js';

const publicUserSelect = {
  user_id: true,
  email: true,
  username: true,
  firstname: true,
  lastname: true,
  created_at: true,
};

export const signupUser = async ({ email, password, username, firstname, lastname }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ConflictError('Email already in use');

  const hashed_password = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      hashed_password,
      username: username || email.split('@')[0],
      firstname: firstname || '',
      lastname: lastname || '',
    },
    select: publicUserSelect,
  });
  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new UnauthorizedError('Invalid credentials');

  const ok = await bcrypt.compare(password, user.hashed_password);
  if (!ok) throw new UnauthorizedError('Invalid credentials');

  const publicUser = {
    user_id: user.user_id,
    email: user.email,
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
    created_at: user.created_at,
  };
  return publicUser;
};

export const getPublicUser = async (userId) => {
  const user = await prisma.user.findUnique({ where: { user_id: userId }, select: publicUserSelect });
  if (!user) throw new NotFoundError('User not found');
  return user;
};

export const upsertOAuthUser = async ({ email, given_name, family_name, name }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return {
      user_id: existing.user_id,
      email: existing.email,
      username: existing.username,
      firstname: existing.firstname,
      lastname: existing.lastname,
      created_at: existing.created_at,
    };
  }

  const randomPass = `oauth-${Math.random().toString(36).slice(2)}-${Date.now()}`;
  const hashed_password = await bcrypt.hash(randomPass, 10);
  const preferred = (given_name && String(given_name).trim())
    || (name && String(name).trim())
    || (email && String(email).split('@')[0])
    || 'user';
  const username = preferred.slice(0, 50);

  const user = await prisma.user.create({
    data: {
      email,
      hashed_password,
      username,
      firstname: given_name || name || '',
      lastname: family_name || '',
    },
    select: publicUserSelect,
  });
  return user;
};

//--------------------------------------------------------

//UPDATE USER, in order to allow user to change their profile informations

export const updateUserProfile = async (userId, { firstname, lastname, username }) => {
  const user = await prisma.user.update({
    where: { user_id: userId },
    data: {
      firstname: firstname || undefined,
      lastname: lastname || undefined,
      username: username || undefined,
    },
    select: publicUserSelect,
  });
  return user;
};

//possibility to change password

export const changeUserPassword = async (userId, { currentPassword, newPassword }) => {
  const user = await prisma.user.findUnique({ where: { user_id: userId } });
  if (!user) throw new NotFoundError('User not found');

  const ok = await bcrypt.compare(currentPassword, user.hashed_password);
  if (!ok) throw new UnauthorizedError('Current password is incorrect');

  const hashed_password = await bcrypt.hash(newPassword, 10);
  
  await prisma.user.update({
    where: { user_id: userId },
    data: { hashed_password },
  });

  return { message: 'Password updated successfully' };
};
