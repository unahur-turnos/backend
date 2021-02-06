import Actividad from '../models/actividad';
import Autorizacion from '../models/autorizacion';
import Usuario from '../models/usuario';
import { makeApi } from '../helpers/api_guarani';

// Para facilitar la inscripción, agregar también un endpoint /usuarios/yo/actividades,
// que devuelva únicamente las actividades a las que ese usuario puede inscribirse
// (con el mismo filtro de fecha que tiene /actividades). Con esto ya se podría quitarle
// acceso a la ruta /actividades, así solo puede ver las que puede realizar.

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

// Luego, al crear una autorización para dicha actividad, hay que verificar que el usuario
//  esté inscripto a esa carrera y devolver un 403 si no lo está (Unauthorized).

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

  const usuarios = await makeApi().get(
    `/carreras/${actividad.restriccionId}/alumnos`
  );
  const cursa = usuarios.data.filter((user) => user.documento == usuario.dni);

  console.log(cursa.length);

  if (cursa.length == 0) {
    return res.status(403).send({
      error: `El usuario no está inscripto a la carrera`,
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
  const data = await Autorizacion.destroy({
    where: {
      id: id,
    },
  });

  if (!data) {
    return res
      .status(404)
      .send({ error: `No existe una autorización con el id ${id}` });
  }

  res.sendStatus(204);
};
