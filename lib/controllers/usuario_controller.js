import { compose, map, prop, propOr } from 'ramda';

import Actividad from '../models/actividad';
import Usuario from '../models/usuario';
import { generarJWT } from '../helpers/jwt';
import jwt_decode from 'jwt-decode';
import passport from 'passport';

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
    if (err) {
      return res.status(400).json({ error: obtenerMensajesSiHay(err) });
    }
    return res.status(201).json(data);
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

  await usuario.recuperarContrasenia();

  res.sendStatus(200);
};

export const actualizarContrasenia = async (req, res) => {
  const tokenTemporal = req.headers['authorization'];
  const decodedTokenTemporal = jwt_decode(tokenTemporal);
  const { dni, contrasenia } = req.body;

  const usuario = await Usuario.findOne({ where: { dni } });
  await usuario.actualizarContrasenia(contrasenia);

  const token = generarJWT(usuario.id, dni);

  res.status(200).json({ ...usuario.toJSON(), token });
};
