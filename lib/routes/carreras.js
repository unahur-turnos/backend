import express from 'express';
import { getCarreras } from '../helpers/api_guarani';
import { withErrorHandling } from './utils';

const router = express.Router();

const index = async (req, res) => {
  const response = await getCarreras();

  res.send(response);
};

router.get('/', withErrorHandling(index));

export default router;
