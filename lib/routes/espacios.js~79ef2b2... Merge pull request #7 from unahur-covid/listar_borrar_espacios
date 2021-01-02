import express from 'express';
import { index, deleteById } from '../controllers/espacio_controller';
import { withErrorHandling } from './utils';

const router = express.Router();

router.get('/', withErrorHandling(index));
router.delete('/:id', withErrorHandling(deleteById));

export default router;
