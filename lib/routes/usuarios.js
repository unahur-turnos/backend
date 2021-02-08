import '../middlewares/auth';

import {
  autenticar,
  getActividadesUsuario,
  index,
  login,
  registro,
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
router.get('/yo/actividades', withErrorHandling(getActividadesUsuario));

export default router;
