import { Strategy as LocalStrategy } from 'passport-local';
import Usuario from '../models/usuario';
import passport from 'passport';

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

        const existeDNI = await Usuario.findOne({ where: { dni: dni } });
        const existeEmail = await Usuario.findOne({
          where: { email: usuario.email },
        });

        if (existeDNI) {
          return done('El DNI ya está en uso, por favor utilice otro', false);
        }

        if (existeEmail) {
          return done('El email ya está en uso, por favor utilice otro', false);
        }

        const data = await Usuario.create(usuario);
        return done(null, data);
      } catch (e) {
        return done(e);
      }
    }
  )
);
