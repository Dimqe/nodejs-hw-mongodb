

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { sendEmail } from '../utils/sendEmail.js'; 

const createSession = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  };
};



export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  return await UsersCollection.create({ ...payload, password: hashedPassword });
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(401, 'Unauthorized');
  }
  const passwordMatch = await bcrypt.compare(payload.password, user.password);
  if (!passwordMatch) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const session = createSession(user._id);

  return await SessionsCollection.create({
    userId: user._id,
    ...session,
  });
};

export const refreshSession = async ({ refreshToken }) => {
  const session = await SessionsCollection.findOne({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isRefreshTokenExpired = new Date() > session.refreshTokenValidUntil;
  if (isRefreshTokenExpired) {
    throw createHttpError(401, 'Refresh token expired');
  }

  await SessionsCollection.deleteOne({ _id: session._id });

  const newSession = createSession(session.userId);

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logoutUser = async (refreshToken) => {
  await SessionsCollection.deleteOne({ refreshToken });
};



export const requestResetEmail = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: '5m',
  });

  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${resetToken}`;

  try {
    await sendEmail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset your password',
      html: `<p>To reset your password, please click on this link: <a href="${resetLink}" target="_blank">Reset Password</a>. This link will expire in 5 minutes.</p>`,
    });
  } catch (error) {
    console.error('Failed to send reset email:', error);
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};

export const resetPassword = async ({ token, password }) => {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await UsersCollection.findOne({ email: decoded.email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await UsersCollection.updateOne({ _id: user._id }, { password: hashedPassword });


  await SessionsCollection.deleteMany({ userId: user._id });
};