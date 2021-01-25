import actividades from './actividades';
import { autenticar } from '../controllers/usuario_controller';
import autorizaciones from './autorizaciones';
import edificios from './edificios';
import espacios from './espacios';
import express from 'express';
import usuarios from './usuarios';
import { permitirAcceso } from '../middlewares/auth';

const router = express.Router();

router.use(
  '/api/edificios',
  [autenticar, permitirAcceso('admin', 'bedel')],
  edificios
);

router.use(
  '/api/espacios',
  [autenticar, permitirAcceso('admin', 'bedel')],
  espacios
);

router.use(
  '/api/actividades',
  [autenticar, permitirAcceso('admin', 'bedel')],
  actividades
);

router.use('/api/usuarios', usuarios);

router.use(
  '/api/autorizaciones',
  [autenticar, permitirAcceso('admin', 'bedel')],
  autorizaciones
);

export default router;
