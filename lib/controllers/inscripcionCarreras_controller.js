import { Op } from 'sequelize';
import InscripcionCarrera from '../models/inscripcionCarrera';

export const getByUserId = async (req, res) => {
  const { id } = req.params;
  const data = await InscripcionCarrera.findAll({
    where: {
      [Op.and]: {
        usuarioId: id,
        nombreCarrera: {
          [Op.not]: 'Curso de Preparacion universitaria',
        },
      },
    },
  });

  res.send({ data });
};
