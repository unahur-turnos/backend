import Edificio from '../models/edificio';
import Espacio from '../models/espacio';

export const index = async (req, res) => {
  const data = await Espacio.findAll({
    include: {
      model: Edificio,
      attributes: ['id', 'nombre'],
    },
  });

  res.send({ data });
};

export const getById = async (req, res) => {
  const { id } = req.params;
  const data = await Espacio.findByPk(id, {
    include: {
      model: Edificio,
      attributes: ['id', 'nombre'],
    },
  });

  if (!data) {
    return res
      .status(404)
      .send({ error: `No existe un espacio con el id ${id}` });
  }
  res.send({ data });
};

export const create = async (req, res) => {
  const data = await Espacio.create(req.body);
  res.status(201).send({ data });
};

export const update = async (req, res) => {
  const { id } = req.params;
  const [data] = await Espacio.update(req.body, {
    where: { id: id },
  });

  if (!data) {
    return res
      .status(404)
      .send({ error: `No existe un espacio con el id ${id}` });
  }
  res.sendStatus(200);
};

export const deleteById = async (req, res) => {
  const { id } = req.params;
  const data = await Espacio.destroy({
    where: {
      id: id,
    },
  });

  if (!data) {
    return res
      .status(404)
      .send({ error: `No existe un espacio con el id ${id}` });
  }
  res.sendStatus(204);
};
