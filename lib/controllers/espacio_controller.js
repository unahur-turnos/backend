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

export const deleteById = async (req, res) => {
  const espacio = await Espacio.destroy({
    where: {
      id: req.params.id,
    },
  });

  !espacio
    ? res
        .status(404)
        .send({ error: `No existe un espacio con el id ${req.params.id}` })
    : res.sendStatus(204);
};
