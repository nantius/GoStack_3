import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Token exists
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  // Bearer, Token
  const [, token] = authHeader.split(' ');

  try {
    // Token verification
    await promisify(jwt.verify)(token, authConfig.secret);
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
