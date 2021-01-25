import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
import { jwtSecretSeed, loginIncorrecto } from '../config/auth';

import { Strategy as LocalStrategy } from 'passport-local';
import Usuario from '../models/usuario';
import { generarJWT } from '../helpers/jwt';
import jwt_decode from 'jwt-decode';
import passport from 'passport';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('jwt'),
  secretOrKey: jwtSecretSeed,
};

passport.use(
  'registro',
  new LocalStrategy(
    {
      usernameField: 'dni',
      passwordField: 'contrasenia',
      passReqToCallback: true,
    },
    async (req, dni, contrasenia, done) => {
      try {
        const data = await Usuario.create(req.body);
        const token = generarJWT(data.id, dni);

        return done(null, { ...data.toJSON(), token });
      } catch (e) {
        return done(e);
      }
    }
  )
);

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'dni',
      passwordField: 'contrasenia',
    },
    async (dni, contrasenia, done) => {
      try {
        const usuarioBD = await Usuario.findOne({ where: { dni } });

        if (!usuarioBD) {
          return done(loginIncorrecto, false);
        }

        if (!usuarioBD.validarContrasenia(contrasenia)) {
          return done(loginIncorrecto, false);
        }

        const token = generarJWT(usuarioBD.id, dni);

        return done(null, { ...usuarioBD.toJSON(), token });
      } catch (e) {
        return done(e);
      }
    }
  )
);

passport.use(
  'jwt',
  new JWTStrategy(opts, async (payload, done) => {
    try {
      const { dni } = payload;
      const usuarioBD = await Usuario.findOne({ where: { dni } });

      if (!usuarioBD) {
        return done('No existe el usuario', false);
      }

      return done(null, usuarioBD);
    } catch (e) {
      return done(e);
    }
  })
);

export const permitirAcceso = (...roles) => {
  return async (req, res, next) => {
    const token = req.headers['authorization'];
    const decodeToken = jwt_decode(token);

    const usuario = await Usuario.findByPk(decodeToken.uid);

    if (roles.includes(usuario.rol)) {
      next();
    } else {
      res.status(403).json({
        error: 'El usuario no tiene permisos para acceder a este recurso',
      });
    }
  };
};
