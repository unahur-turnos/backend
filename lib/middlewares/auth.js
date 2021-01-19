import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';

import { Strategy as LocalStrategy } from 'passport-local';
import Usuario from '../models/usuario';
import { generarJWT } from '../helpers/jwt';
import passport from 'passport';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('jwt'),
  secretOrKey: process.env.SECRET_JWT_SEED,
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
        const usuario = req.body;

        const existeDNI = await Usuario.findOne({ where: { dni } });

        if (existeDNI) {
          return done('El DNI ya está en uso, por favor utilice otro', false);
        }

        const existeEmail = await Usuario.findOne({
          where: { email: usuario.email },
        });

        if (existeEmail) {
          return done('El email ya está en uso, por favor utilice otro', false);
        }

        const existeTelefono = await Usuario.findOne({
          where: { telefono: usuario.telefono },
        });

        if (existeTelefono) {
          return done(
            'El telefono ya está en uso, por favor utilice otro',
            false
          );
        }

        const data = await Usuario.create(usuario);

        return done(null, { data });
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
          return done(
            'El DNI y/o contraseña ingresada son invalidas por favor vuelta a intentar.',
            false
          );
        }

        if (!usuarioBD.validarContrasenia(contrasenia)) {
          return done(
            'El DNI y/o contraseña ingresada son invalidas por favor vuelta a intentar.',
            false
          );
        }

        const token = generarJWT(usuarioBD.id, dni);

        return done(null, { token: token });
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
