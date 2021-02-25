import actividades from './actividades';
import { autenticar } from '../controllers/usuario_controller';
import turnos from './turnos';
import edificios from './edificios';
import espacios from './espacios';
import carreras from './carreras';
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

router.use('/api/actividades', autenticar, actividades);

router.use('/api/usuarios', usuarios);

router.use('/api/turnos', autenticar, turnos);

router.use('/api/carreras', carreras);

export default router;
