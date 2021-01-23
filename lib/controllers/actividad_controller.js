import Actividad from '../models/actividad';
import Autorizacion from '../models/autorizacion';
import Espacio from '../models/espacio';
import Usuario from '../models/usuario';

export const index = async (req, res) => {
  const data = await Actividad.findAll({
    include: {
      model: Espacio,
      attributes: ['id', 'nombre'],
    },
  });
  res.send({ data });
};

export const getById = async (req, res) => {
  const { id } = req.params;
  const data = await Actividad.findByPk(id, {
    include: {
      model: Espacio,
      attributes: ['id', 'nombre'],
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
        attributes: ['id', 'nombre'],
      },
    ],
  });

  res.send({ data });
};
