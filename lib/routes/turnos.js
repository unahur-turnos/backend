import {
  create,
  deleteById,
  getById,
  index,
  update,
  registrarIngreso,
} from '../controllers/turno_controller';

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
  permitirAcceso('bedel', 'admin'),
  withErrorHandling(getById)
);
router.post(
  '/',
  permitirAcceso('asistente', 'bedel', 'admin'),
  withErrorHandling(create)
);
router.put('/:id', permitirAcceso('bedel', 'admin'), withErrorHandling(update));
router.delete(
  '/:id',
  permitirAcceso('asistente', 'bedel', 'admin'),
  withErrorHandling(deleteById)
);

router.post('/:id/ingreso', withErrorHandling(registrarIngreso));

export default router;
