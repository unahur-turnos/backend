import jwt from 'jsonwebtoken';
import { jwtSecretSeed } from '../config/auth';

export const generarJWT = (uid, dni) => {
  const payload = { uid, dni };
  return jwt.sign(payload, jwtSecretSeed, { expiresIn: '180d' });
};
