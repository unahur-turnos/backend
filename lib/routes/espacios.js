import express from 'express';
import {
  index,
  deleteById,
  getById,
  create,
  update,
} from '../controllers/espacio_controller';
import { withErrorHandling } from './utils';

const router = express.Router();

router.get('/', withErrorHandling(index));
router.get('/:id', withErrorHandling(getById));
router.post('/', withErrorHandling(create));
router.put('/:id', withErrorHandling(update));
router.delete('/:id', withErrorHandling(deleteById));

export default router;
