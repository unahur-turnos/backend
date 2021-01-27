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
  permitirAcceso('admin', 'bedel', 'invitado'),
  withErrorHandling(index)
);
router.get(
  '/:id',
  permitirAcceso('admin', 'bedel', 'invitado'),
  withErrorHandling(getById)
);
router.post('/', permitirAcceso('admin', 'bedel'), withErrorHandling(create));
router.put('/:id', permitirAcceso('admin', 'bedel'), withErrorHandling(update));
router.delete(
  '/:id',
  permitirAcceso('admin', 'bedel'),
  withErrorHandling(deleteById)
);
router.get(
  '/:id/autorizaciones',
  permitirAcceso('admin', 'bedel'),
  withErrorHandling(getAutorizaciones)
);

export default router;
