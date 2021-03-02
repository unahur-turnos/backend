import Actividad, { NoHayMasCuposError } from '../models/actividad';
import Turno from '../models/turno';
import Usuario from '../models/usuario';

export const index = async (req, res) => {
  const data = await Turno.findAll({
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
  const data = await Turno.findByPk(id, {
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
      .send({ error: `No existe un turno con el id ${id}` });
  }

  res.send({ data });
};

export const create = async (req, res) => {
  const {
    usuario,
    body: { actividadId },
  } = req;

  const actividad = await Actividad.findByPk(actividadId);
  if (!actividad) {
    return res.status(400).send({
      error: `No existe una actividad con el id ${actividadId}`,
    });
  }

  if (!(await usuario.puedePedirTurnoPara(actividad))) {
    return res.status(403).send({
      error: 'No podés solicitar un turno para esta actividad',
    });
  }

  if (await usuario.solicitoTurnoPara(actividad)) {
    return res.status(422).send({
      error: 'Ya solicitaste un turno para esta actividad',
    });
  }

  try {
    const data = await actividad.sacarTurnoPara({ usuario, ...req.body });
    res.status(201).send({ data });
  } catch (error) {
    if (error instanceof NoHayMasCuposError) {
      res.status(422).send({ error: error.message });
    } else {
      throw error;
    }
  }
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { usuarioId, actividadId } = req.body;

  const turno = await Turno.findByPk(id);
  if (!turno) {
    return res
      .status(404)
      .send({ error: `No existe un turno con el id ${id}` });
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

  const data = await turno.update(req.body, {
    where: { id: id },
    returning: true,
  });

  res.status(200).send({ data });
};

export const deleteById = async (req, res) => {
  const { id } = req.params;
  const { usuario } = req;

  const turnoABorrar = await Turno.findByPk(id);

  if (!turnoABorrar) {
    return res
      .status(404)
      .send({ error: `No existe un turno con el id ${id}` });
  }

  if (!usuario.puedeBorrar(turnoABorrar)) {
    return res.sendStatus(403);
  }

  await turnoABorrar.destroy();

  res.sendStatus(204);
};

export const registrarIngreso = async (req, res) => {
  const { id } = req.params;

  const turno = await Turno.findByPk(id, {
    include: [
      { model: Usuario, attributes: ['id', 'nombre', 'apellido', 'dni'] },
    ],
  });

  if (!turno) {
    return res
      .status(404)
      .send({ error: `No existe un turno con el id ${id}` });
  }

  const data = await turno.update({
    fechaHoraIngreso: new Date(),
  });
  return res.status(200).send({ data });
};
