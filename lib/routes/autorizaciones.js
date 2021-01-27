import {
  create,
  deleteById,
  getById,
  index,
  update,
} from '../controllers/autorizacion_controller';

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
  permitirAcceso('admin', 'bedel'),
  withErrorHandling(getById)
);
router.post(
  '/',
  permitirAcceso('admin', 'bedel', 'invitado'),
  withErrorHandling(create)
);
router.put('/:id', permitirAcceso('admin', 'bedel'), withErrorHandling(update));
router.delete(
  '/:id',
  permitirAcceso('admin', 'bedel'),
  withErrorHandling(deleteById)
);

export default router;
