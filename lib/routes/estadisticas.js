import { index } from '../controllers/estadisticas_controller';

import express from 'express';
import { withErrorHandling } from './utils';

const router = express.Router();

router.get('/', withErrorHandling(index));

export default router;
