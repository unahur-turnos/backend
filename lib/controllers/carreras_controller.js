import { compose, prop, sortBy, toLower } from 'ramda';

import { getCarreras } from '../helpers/api_guarani';

export const index = async (req, res) => {
  const carreras = await getCarreras();
  const carrerasOrdenadas = sortBy(compose(toLower, prop('nombre')), carreras);

  res.send({ data: carrerasOrdenadas });
};
