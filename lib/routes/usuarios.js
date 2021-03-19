import '../middlewares/auth';

import {
  autenticar,
  getActividadesUsuario,
  index,
  login,
  registro,
  getTurnosUsuario,
  recuperarContrasenia,
} from '../controllers/usuario_controller';

import express from 'express';
import { permitirAcceso } from '../middlewares/auth';
import { withErrorHandling } from './utils';

const router = express.Router();

router.get(
  '/',
  [autenticar, permitirAcceso('admin', 'bedel')],
  withErrorHandling(index)
);
router.post('/registro', withErrorHandling(registro));
router.post('/login', withErrorHandling(login));
router.post('/recuperar', withErrorHandling(recuperarContrasenia));
router.get(
  '/yo/actividades',
  [autenticar, permitirAcceso('admin', 'bedel', 'asistente')],
  withErrorHandling(getActividadesUsuario)
);
router.get(
  '/yo/turnos',
  [autenticar, permitirAcceso('asistente')],
  withErrorHandling(getTurnosUsuario)
);

export default router;
