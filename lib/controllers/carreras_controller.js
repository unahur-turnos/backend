import { getCarreras } from '../helpers/api_guarani';

export const index = async (req, res) => {
  const data = await getCarreras();
  res.send({ data });
};
