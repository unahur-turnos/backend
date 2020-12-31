import Edificio from '../models/edificio';
import Espacio from '../models/espacio';

export const index = async (req, res) => {
  const data = await Espacio.findAll({
    attributes: ['id', 'piso', 'nombre', 'habilitado', 'aforo'],
    include: {
      as: 'edificio',
      model: Edificio,
      attributes: ['id', 'nombre'],
    },
  });
  res.send({ data });
};

export const getById = async (req, res) => {
  const espacio = await Espacio.findByPk(req.params.id);
  if (!espacio) {
    return res
      .status(404)
      .send(`No existe un espacio con el id ${req.params.id}`);
  }
  res.send(espacio);
};

export const create = async (req, res) => {
  Espacio.create({
    edificioFk: req.body.edificioFk,
    piso: req.body.piso,
    nombre: req.body.nombre,
    habilitado: req.body.habilitado,
    aforo: req.body.aforo,
  })
    .then(() => res.sendStatus(201))
    .catch((error) => res.status(500).send(error));
};

export const update = async (req, res) => {
  Espacio.update(
    {
      edificioFk: req.body.edificioFk,
      piso: req.body.piso,
      nombre: req.body.nombre,
      habilitado: req.body.habilitado,
      aforo: req.body.aforo,
    },
    { where: { id: req.params.id } }
  )
    .then(([count]) => {
      if (!count) {
        return res
          .status(404)
          .send(`No existe un espacio con el id ${req.params.id}`);
      }
      res.sendStatus(204);
    })
    .catch((error) => res.status(500).send(error));
};

export const deleteById = async (req, res) => {
  Espacio.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((count) => {
      if (!count) {
        return res
          .status(404)
          .send(`No existe un espacio con el id ${req.params.id}`);
      }
      res.sendStatus(204);
    })
    .catch((error) => res.status(500).send(error));
};
