import {
  compose,
  includes,
  map,
  path,
  pluck,
  prop,
  propOr,
  reject,
} from 'ramda';

import Actividad from '../models/actividad';
import Edificio from '../models/edificio';
import Espacio from '../models/espacio';
import Turno from '../models/turno';
import Usuario from '../models/usuario';
import { inscripcionesPara } from '../helpers/api_guarani';
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

  const carreras = await inscripcionesPara(usuario.dni);
  const idsCarreras = pluck(['id'], carreras);

  const actividadesUsuario = await Actividad.conTurnos({
    desde,
    hasta,
    idsCarreras,
  });

  const turnosUsuario = await usuario.getTurnos();
  const idsActividadesUsuario = map(path(['Actividad', 'id']), turnosUsuario);

  const data = reject(
    (act) => includes(act.id, idsActividadesUsuario),
    actividadesUsuario
  );

  res.send({ data });
};

export const getTurnosUsuario = async (req, res) => {
  const usuario = req.usuario;
  const data = await usuario.getTurnos();
  res.send({ data });
};
