import jwt from 'jsonwebtoken';

export const generarJWT = (uid, name) => {
  const payload = { uid, name };
  return jwt.sign(payload, process.env.SECRET_JWT_SEED, { expiresIn: '1h' });
};
