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
