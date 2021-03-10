import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
import {
  asuntoRegistro,
  attachmentsRegistro,
  templateRegistro,
} from '../config/mail_sender';
import { jwtSecretSeed, loginIncorrecto } from '../config/auth';

import InscripcionCarrera from '../models/inscripcionCarrera';
import { Strategy as LocalStrategy } from 'passport-local';
import { MailSender } from '../helpers/mail_sender';
import Usuario from '../models/usuario';
import { generarJWT } from '../helpers/jwt';
import { inscripcionesPara } from '../helpers/api_guarani';
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
        const usuario = await Usuario.create(req.body);
        const token = generarJWT(usuario.id, dni);
        const carreras = await inscripcionesPara(usuario.dni);

        if (carreras != null) {
          await InscripcionCarrera.bulkCreate(
            carreras.map(({ id, nombre }) => ({
              usuarioId: usuario.id,
              idCarrera: id,
              nombreCarrera: nombre,
            }))
          );

          await usuario.update({ fechaSincronizacionGuarani: new Date() });
        }

        await MailSender.sendMail(
          usuario.email,
          asuntoRegistro,
          templateRegistro,
          attachmentsRegistro
        );

        return done(null, { ...usuario.toJSON(), token });
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

      return done(null, usuarioBD.toJSON());
    } catch (e) {
      return done(e);
    }
  })
);

export const permitirAcceso = (...roles) => {
  return async (req, res, next) => {
    const usuario = req.usuario;

    if (!roles.includes(usuario.rol)) {
      res.status(403).json({
        error: 'El usuario no tiene permisos para acceder a este servicio',
      });
    }
    next();
  };
};
