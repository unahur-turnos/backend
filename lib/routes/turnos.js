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

router.get('/', permitirAcceso('admin'), withErrorHandling(index));
router.get('/:id', permitirAcceso('admin'), withErrorHandling(getById));
router.post(
  '/',
  permitirAcceso('asistente', 'admin'),
  withErrorHandling(create)
);
router.put('/:id', permitirAcceso('admin'), withErrorHandling(update));
router.delete(
  '/:id',
  permitirAcceso('asistente', 'admin'),
  withErrorHandling(deleteById)
);

router.post(
  '/:id/ingreso',
  withErrorHandling(registrarIngreso),
  permitirAcceso('bedel')
);

export default router;
