import {
  create,
  deleteById,
  getTurnos,
  getById,
  index,
  update,
} from '../controllers/actividad_controller';

import express from 'express';
import { withErrorHandling } from './utils';
import { permitirAcceso } from '../middlewares/auth';

const router = express.Router();

router.get('/', permitirAcceso('bedel', 'admin'), withErrorHandling(index));
router.get('/:id', permitirAcceso('admin'), withErrorHandling(getById));
router.post('/', permitirAcceso('admin'), withErrorHandling(create));
router.put('/:id', permitirAcceso('admin'), withErrorHandling(update));
router.delete('/:id', permitirAcceso('admin'), withErrorHandling(deleteById));
router.get(
  '/:id/turnos',
  permitirAcceso('bedel', 'admin'),
  withErrorHandling(getTurnos)
);

export default router;
