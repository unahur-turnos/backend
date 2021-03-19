import jwt from 'jsonwebtoken';
import { jwtSecretSeed } from '../config/auth';

export const generarJWT = (uid, dni, time = '180d') => {
  const payload = { uid, dni };
  return jwt.sign(payload, jwtSecretSeed, { expiresIn: time });
};
