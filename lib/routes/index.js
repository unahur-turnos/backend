import actividades from './actividades';
import { autenticar } from '../controllers/usuario_controller';
import autorizaciones from './autorizaciones';
import edificios from './edificios';
import espacios from './espacios';
import express from 'express';
import usuarios from './usuarios';

const router = express.Router();

router.use('/api/edificios', autenticar, edificios);
router.use('/api/espacios', autenticar, espacios);
router.use('/api/actividades', autenticar, actividades);
router.use('/api/usuarios', usuarios);
router.use('/api/autorizaciones', autenticar, autorizaciones);

export default router;
