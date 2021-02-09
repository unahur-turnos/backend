import { compose, map, pluck, prop, propOr } from 'ramda';

import Actividad from '../models/actividad';
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
  passport.authenticate('jwt', { session: false }, (err, data) => {
    if (err || !data) {
      return res.sendStatus(401);
    }

    req.usuario = data;
    next();
  })(req, res, next);
};

export const getActividadesUsuario = async (req, res) => {
  const { desde, hasta } = req.query;

  const { dni } = req.body;

  const carreras = await inscripcionesPara(dni);
  const idsCarreras = pluck(['id'], carreras);

  const data = await Actividad.conAutorizaciones(
    { desde, hasta },
    { idsCarreras }
  );

  res.send({ data });
};
