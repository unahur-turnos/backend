import express from 'express';
import { index, show } from '../controllers/usuario_controller';
import { withErrorHandling } from './utils';

const router = express.Router();

router.get('/', withErrorHandling(index));
router.get('/:id', withErrorHandling(show));

export default router;
