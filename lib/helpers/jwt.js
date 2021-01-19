import jwt from 'jsonwebtoken';

export const generarJWT = (uid, dni) => {
  const payload = { uid, dni };
  return jwt.sign(payload, process.env.SECRET_JWT_SEED, { expiresIn: '180d' });
};
