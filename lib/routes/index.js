import edificios from './edificios';
import espacios from './espacios';
import actividades from './actividades';
import express from 'express';

const router = express.Router();

router.use('/api/edificios', edificios);
router.use('/api/espacios', espacios);
router.use('/api/actividades', actividades);

export default router;
