import Edificio from '../models/edificio';

export const index = async (req, res) => {
  const data = await Edificio.findAll({});
  res.send({ data });
};

export const getById = async (req, res) => {
  const { id } = req.params;
  const data = await Edificio.findByPk(id);

  if (!data) {
    return res
      .status(404)
      .send({ error: `No existe un edificio con el id ${id}` });
  }
  res.send({ data });
};

export const create = async (req, res) => {
  const data = await Edificio.create(req.body);
  res.status(201).send({ data });
};

export const update = async (req, res) => {
  const { id } = req.params;
  const [data] = await Edificio.update(req.body, {
    where: { id: id },
  });

  if (!data) {
    return res
      .status(404)
      .send({ error: `No existe un edificio con el id ${id}` });
  }
  res.sendStatus(200);
};

export const deleteById = async (req, res) => {
  const { id } = req.params;
  const data = await Edificio.destroy({
    where: {
      id: id,
    },
  });

  if (!data) {
    return res
      .status(404)
      .send({ error: `No existe un edificio con el id ${id}` });
  }
  res.sendStatus(204);
};
