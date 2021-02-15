import Actividad from '../models/actividad';
import Autorizacion from '../models/autorizacion';
import Usuario from '../models/usuario';

export const index = async (req, res) => {
  const data = await Autorizacion.findAll({
    include: [
      {
        model: Usuario,
        attributes: ['id', 'nombre'],
      },
      {
        model: Actividad,
        attributes: ['id', 'nombre'],
      },
    ],
  });

  res.send({ data });
};

export const getById = async (req, res) => {
  const { id } = req.params;
  const data = await Autorizacion.findByPk(id, {
    include: [
      {
        model: Usuario,
        attributes: ['id', 'nombre'],
      },
      {
        model: Actividad,
        attributes: ['id', 'nombre'],
      },
    ],
  });

  if (!data) {
    return res
      .status(404)
      .send({ error: `No existe una autorización con el id ${id}` });
  }

  res.send({ data });
};

export const create = async (req, res) => {
  const { usuarioId, actividadId } = req.body;

  const usuario = await Usuario.findByPk(usuarioId);
  if (!usuario) {
    return res.status(400).send({
      error: `No existe un usuario con el id ${usuarioId}`,
    });
  }

  const actividad = await Actividad.findByPk(actividadId);
  if (!actividad) {
    return res.status(400).send({
      error: `No existe una actividad con el id ${actividadId}`,
    });
  }

  if (!(await usuario.puedePedirTurnoPara(actividad))) {
    return res.status(403).send({
      error: 'El usuario no puede pedir turno para esta actividad',
    });
  }

  const data = await Autorizacion.create(req.body);
  res.status(201).send({ data });
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { usuarioId, actividadId } = req.body;

  const autorizacion = await Autorizacion.findByPk(id);
  if (!autorizacion) {
    return res
      .status(404)
      .send({ error: `No existe una autorización con el id ${id}` });
  }

  const usuario = await Usuario.findByPk(usuarioId);
  if (!usuario) {
    return res.status(400).send({
      error: `No existe un usuario con el id ${usuarioId}`,
    });
  }

  const actividad = await Actividad.findByPk(actividadId);
  if (!actividad) {
    return res.status(400).send({
      error: `No existe una actividad con el id ${actividadId}`,
    });
  }

  const data = await Autorizacion.update(req.body, {
    where: { id: id },
    returning: true,
  });

  res.status(200).send({ data });
};

export const deleteById = async (req, res) => {
  const { id } = req.params;
  const { usuario } = req;

  const autorizacionABorrar = await Autorizacion.findByPk(id);

  if (!autorizacionABorrar) {
    return res
      .status(404)
      .send({ error: `No existe una autorización con el id ${id}` });
  }

  if (!usuario.puedeBorrar(autorizacionABorrar)) {
    return res.sendStatus(403);
  }

  await autorizacionABorrar.destroy();

  res.sendStatus(204);
};

export const registrarIngreso = async (req, res) => {
  const { id } = req.params;

  const autorizacion = await Autorizacion.findByPk(id, {
    include: [
      { model: Usuario, attributes: ['id', 'nombre', 'apellido', 'dni'] },
    ],
  });

  if (!autorizacion) {
    return res
      .status(404)
      .send({ error: `No existe una autorización con el id ${id}` });
  }

  const data = await autorizacion.update({
    ...autorizacion,
    fechaHoraIngreso: new Date(),
  });
  return res.status(200).send({ data });
};
