import { compose, map, pluck, prop, propOr } from 'ramda';
import { getFiltroCarreras, getFiltroFecha } from '../utils/actividadUtils';

import Actividad from '../models/actividad';
import Autorizacion from '../models/autorizacion';
import Edificio from '../models/edificio';
import Espacio from '../models/espacio';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';
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

  // TODO: mover la búsqueda al modelo (se repite en actividad_controller) y pasar los filtros por parámetro

  const data = await Actividad.findAll({
    attributes: {
      include: [
        // Sequelize trata al COUNT como un string, por eso hacemos un casteo a integer.
        // Ver https://github.com/sequelize/sequelize/issues/2383
        [
          Sequelize.literal('COUNT("Autorizacions".id)::integer'),
          'autorizaciones',
        ],
      ],
    },
    include: [
      {
        model: Espacio,
        attributes: ['id', 'nombre', 'aforo'],
        include: {
          model: Edificio,
          attributes: ['id', 'nombre'],
        },
      },
      {
        model: Autorizacion,
        attributes: [],
        required: false,
      },
    ],
    group: ['Actividad.id', 'Espacio.id', 'Espacio.Edificio.id'],
    where: {
      [Op.and]: [getFiltroFecha(desde, hasta), getFiltroCarreras(idsCarreras)],
    },
  });

  res.send({ data });
};
