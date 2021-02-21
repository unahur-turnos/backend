import { ascend, compose, prop, sortWith, toLower } from 'ramda';

import { getCarreras } from '../helpers/api_guarani';

export const index = async (req, res) => {
  const carreras = await getCarreras();
  const carrerasOrdenadas = sortWith(
    [ascend(compose(toLower, prop('nombre')))],
    carreras
  );

  res.send({ data: carrerasOrdenadas });
};
