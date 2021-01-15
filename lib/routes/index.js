import express from 'express';
import edificios from './edificios';
import espacios from './espacios';
import actividades from './actividades';
import usuarios from './usuarios';

const router = express.Router();

router.use('/api/edificios', edificios);
router.use('/api/espacios', espacios);
router.use('/api/actividades', actividades);
router.use('/api/usuarios', usuarios);

export default router;
