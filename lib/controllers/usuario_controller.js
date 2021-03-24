import { sendMail } from '../helpers/mail_sender';
import { compose, concat, map, prop, propOr } from 'ramda';
import Actividad from '../models/actividad';
import Usuario from '../models/usuario';
import { ValidationError } from 'sequelize';
import { generarJWT } from '../helpers/jwt';
import jwt from 'jsonwebtoken';
import { jwtSecretSeed } from '../config/auth';
import passport from 'passport';
import { asuntoRecuperarContrasenia, host } from '../config/mail_sender';

export const index = async (req, res) => {
  const data = await Usuario.findAll({});
  res.send({ data });
};

const obtenerMensajesSiHay = compose(
  map(prop('message')),
  propOr([], 'errors')
);

export const registro = (req, res, next) => {
  passport.authenticate('registro', (err, data) => {
    if (!err) {
      return res.status(201).json(data);
    }

    if (err instanceof ValidationError) {
      return res.status(400).json({ error: obtenerMensajesSiHay(err) });
    }

    throw err;
  })(req, res, next);
};

export const login = (req, res, next) => {
  passport.authenticate('login', (err, data) => {
    if (err) {
      return res.status(401).json({ error: err });
    }
    return res.status(200).json(data);
  })(req, res, next);
};

export const autenticar = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (err, data) => {
    if (err || !data) {
      return res.sendStatus(401);
    }

    req.usuario = await Usuario.findByPk(data.id);
    next();
  })(req, res, next);
};

export const getActividadesUsuario = async (req, res) => {
  const usuario = req.usuario;
  const { desde, hasta } = req.query;

  const idsCarreras = await usuario.getIdsCarreras();
  const idsActividadesConTurno = await usuario.getIdsActividadesConTurno();

  const data = await Actividad.conTurnos({
    desde,
    hasta,
    idsCarreras,
    idsActividadesConTurno,
  });

  res.send({ data });
};

export const getTurnosUsuario = async (req, res) => {
  const usuario = req.usuario;
  const data = await usuario.getTurnosConInfoActividades();
  res.send({ data });
};

export const recuperarContrasenia = async (req, res) => {
  const { dni } = req.body;
  const usuario = await Usuario.findOne({ where: { dni } });

  if (!usuario) {
    return res
      .status(400)
      .json({ error: `No existe un usuario con el DNI ${dni}` });
  }

  const tokenTemporal = usuario.generarTokenTemporal();
  await usuario.update({ tokenTemporal });

  await sendMail({
    destinatario: usuario.email,
    asunto: asuntoRecuperarContrasenia,
    template: 'templateRecuperarContrasenia',
    parametros: {
      nombreUsuario: usuario.nombre,
      linkTemporal: concat(
        host,
        `/usuario/${usuario.dni}/recuperar/${tokenTemporal}`
      ),
    },
  });

  res.sendStatus(200);
};

export const actualizarContrasenia = async (req, res) => {
  try {
    const tokenTemporal = req.authorization.credentials;
    const { uid } = await jwt.verify(tokenTemporal, jwtSecretSeed);
    const { contrasenia } = req.body;
    const usuario = await Usuario.findByPk(uid);

    if (!usuario.tokenTemporal) throw { message: 'Token expirado' };

    await usuario.actualizarContrasenia(contrasenia);
    await usuario.destruirTokenTemporal();
    const token = generarJWT(usuario.id, usuario.dni);

    res.status(200).json({ ...usuario.toJSON(), token });
  } catch (e) {
    console.log(e);
    // TODO: ver si el error efectivamente es de JWT (para no enmascarar otros)
    res.status(401).json({ error: e });
  }
};
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjQsImRuaSI6NDI0MzUzODAsImlhdCI6MTYxNjU0NDg3NCwiZXhwIjoxNjE2NTQ1Nzc0fQ.JpemwEC2CSi_tVV_5Ujin4y1rEBj_4hHrTBJqGswi6w
