import { getFinDelDia, getInicioDelDia } from '../utils/dateUtils';

import Actividad from '../models/actividad';
import Autorizacion from '../models/autorizacion';
import Edificio from '../models/edificio';
import Espacio from '../models/espacio';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';
import Usuario from '../models/usuario';

export const index = async (req, res) => {
  const { desde, hasta } = req.query;

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
    where: getCondicion(desde, hasta),
  });

  res.send({ data });
};

const getCondicion = (desde, hasta) => {
  if (desde !== undefined && hasta !== undefined) {
    return {
      fechaHoraInicio: {
        [Op.between]: [getInicioDelDia(desde), getFinDelDia(hasta)],
      },
    };
  }

  if (desde !== undefined) {
    return { fechaHoraInicio: { [Op.gte]: getInicioDelDia(desde) } };
  }

  if (hasta !== undefined) {
    return { fechaHoraInicio: { [Op.lte]: getFinDelDia(hasta) } };
  }

  return {};
};

export const getById = async (req, res) => {
  const { id } = req.params;
  const data = await Actividad.findByPk(id, {
    include: {
      model: Espacio,
      attributes: ['id', 'nombre', 'aforo'],
      include: {
        model: Edificio,
        attributes: ['id', 'nombre'],
      },
    },
  });

  if (!data) {
    return res
      .status(404)
      .send({ error: `No existe una actividad con el id ${id}` });
  }
  res.send({ data });
};

export const create = async (req, res) => {
  const actividad = req.body;
  const espacio = await Espacio.findByPk(actividad.espacioId);

  if (!espacio) {
    return res.status(400).send({
      error: `No existe un espacio con el id ${espacio.id}, por favor ingrese otro.`,
    });
  }

  const data = await Actividad.create(actividad);
  res.status(201).send({ data });
};

export const update = async (req, res) => {
  const { id } = req.params;
  const actividad = await Actividad.findByPk(id);
  const espacio = await Espacio.findByPk(req.body.espacioId);

  if (!actividad) {
    return res
      .status(404)
      .send({ error: `No existe una actividad con el id ${id}` });
  }

  if (!espacio) {
    return res.status(400).send({
      error: `No existe un espacio con el id ${espacio.id}, por favor ingrese otro.`,
    });
  }

  const data = await Actividad.update(req.body, {
    where: { id: id },
    returning: true,
    plain: true,
  });

  res.status(200).send({ data });
};

export const deleteById = async (req, res) => {
  const { id } = req.params;
  const data = await Actividad.destroy({
    where: {
      id: id,
    },
  });

  if (!data) {
    return res
      .status(404)
      .send({ error: `No existe una actividad con el id ${id}` });
  }
  res.sendStatus(204);
};

export const getAutorizaciones = async (req, res) => {
  const { id } = req.params;

  const actividad = await Actividad.findByPk(id);

  if (!actividad) {
    return res
      .status(404)
      .send({ error: `No existe una actividad con el id ${id}` });
  }

  const data = await Autorizacion.findAll({
    where: {
      actividadId: id,
    },
    include: [
      {
        model: Usuario,
        attributes: ['id', 'nombre', 'apellido', 'dni'],
      },
    ],
    order: [[Usuario, 'apellido']],
  });

  res.send({ data });
};
