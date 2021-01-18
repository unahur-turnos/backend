import express from 'express';
import edificios from './edificios';
import espacios from './espacios';
import actividades from './actividades';
import usuarios from './usuarios';
import { autenticar } from '../controllers/usuario_controller';

const router = express.Router();

router.use('/api/edificios', autenticar, edificios);
router.use('/api/espacios', autenticar, espacios);
router.use('/api/actividades', autenticar, actividades);
router.use('/api/usuarios', usuarios);

export default router;
