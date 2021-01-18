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
        console.log(e);
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
        return done(null, { data: usuarioBD });
      } catch (e) {
        console.log(e);
      }
    }
  )
);
