import express from 'express';
import { getByUserId } from '../controllers/inscripcionCarreras_controller';
import { withErrorHandling } from './utils';

const router = express.Router();

router.get('/usuario/:id', withErrorHandling(getByUserId));

export default router;
