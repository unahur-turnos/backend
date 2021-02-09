import express from 'express';
import { index } from '../controllers/carreras_controller';
import { withErrorHandling } from './utils';

const router = express.Router();

router.get('/', withErrorHandling(index));

export default router;
