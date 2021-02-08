import { getFinDelDia, getInicioDelDia } from './dateUtils';

import { Op } from 'sequelize';

export const getFiltroFecha = (desde, hasta) => {
  if (desde !== undefined && hasta !== undefined) {
    return {
      fechaHoraInicio: {
        [Op.between]: [getInicioDelDia(desde), getFinDelDia(hasta)],
      },
    };
  }

  if (desde !== undefined) {
    return { fechaHoraInicio: { [Op.gte]: getInicioDelDia(desde) } };
  }

  if (hasta !== undefined) {
    return { fechaHoraInicio: { [Op.lte]: getFinDelDia(hasta) } };
  }

  return {};
};

export const getFiltroCarreras = (idsCarreras) => {
  return {
    restriccionId: {
      [Op.or]: {
        [Op.in]: idsCarreras,
        [Op.eq]: null,
      },
    },
  };
};
