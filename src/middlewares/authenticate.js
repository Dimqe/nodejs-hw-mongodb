
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { UsersCollection } from '../db/models/user.js';

import { SessionsCollection } from '../db/models/session.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(createHttpError(401, 'Authorization header is missing'));
  }

  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Auth header should be of type Bearer'));
  }

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);


    const session = await SessionsCollection.findOne({ userId, accessToken: token });
    if (!session) {

      throw createHttpError(401, 'Session not found. Please login again.');
    }

    const user = await UsersCollection.findById(userId);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(createHttpError(401, 'Access token expired'));
    }
    next(createHttpError(401, err.message || 'Not authorized'));
  }
};