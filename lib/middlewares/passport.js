import passport from 'passport';
import { LocalStrategy } from 'passport-local';
import Usuario from '../models/usuario';

passport.use(
  new LocalStrategy(function (dni, contrasenia, done) {
    Usuario.findOne(
      {
        where: {
          username: dni,
        },
      },
      function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: 'Nombre de usuario y/o contraseña incorrecto.',
          });
        }
        if (!user.validPassword(contrasenia)) {
          return done(null, false, {
            message: 'Nombre de usuario y/o contraseña incorrecto.',
          });
        }
        return done(null, user);
      }
    );
  })
);
