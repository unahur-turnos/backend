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
  const espacio = req.body;
  const edificio = await Edificio.findByPk(espacio.edificioId);

  if (!edificio) {
    return res.status(400).send({
      error: `No existe un edificio con el id ${espacio.edificioId}, por favor ingrese otro.`,
    });
  }

  const data = await Espacio.create(espacio);
  res.status(201).send({ data });
};

export const update = async (req, res) => {
  const { id } = req.params;
  const espacio = await Espacio.findByPk(id);
  const edificio = await Edificio.findByPk(req.body.edificioId);

  if (!espacio) {
    return res
      .status(404)
      .send({ error: `No existe un espacio con el id ${id}` });
  }

  if (!edificio) {
    return res.status(400).send({
      error: `No existe un edificio con el id ${espacio.edificioId}, por favor ingrese otro.`,
    });
  }

  const data = await Espacio.update(req.body, {
    where: { id: id },
    returning: true,
    plain: true,
  });

  res.status(200).send({ data });
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
