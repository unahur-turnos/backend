import { getCarreras } from '../helpers/api_guarani';

export const index = async (req, res) => {
  const response = await getCarreras();

  res.send({ data: response });
};
