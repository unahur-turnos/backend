import {
  create,
  deleteById,
  getAutorizaciones,
  getById,
  index,
  update,
} from '../controllers/actividad_controller';

import express from 'express';
import { withErrorHandling } from './utils';
import { permitirAcceso } from '../middlewares/auth';

const router = express.Router();

router.get(
  '/',
  permitirAcceso('asistente', 'bedel', 'admin'),
  withErrorHandling(index)
);
router.get(
  '/:id',
  permitirAcceso('asistente', 'bedel', 'admin'),
  withErrorHandling(getById)
);
router.post('/', permitirAcceso('bedel', 'admin'), withErrorHandling(create));
router.put('/:id', permitirAcceso('bedel', 'admin'), withErrorHandling(update));
router.delete(
  '/:id',
  permitirAcceso('bedel', 'admin'),
  withErrorHandling(deleteById)
);
router.get(
  '/:id/autorizaciones',
  permitirAcceso('bedel', 'admin'),
  withErrorHandling(getAutorizaciones)
);

export default router;
