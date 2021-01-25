import express from 'express';
import { withErrorHandling } from './utils';
import {
  index,
  registro,
  login,
  autenticar,
} from '../controllers/usuario_controller';
import '../middlewares/auth';
import { permitirAcceso } from '../middlewares/auth';

const router = express.Router();

router.get(
  '/',
  [autenticar, permitirAcceso('admin', 'bedel')],
  withErrorHandling(index)
);
router.post('/registro', withErrorHandling(registro));
router.post('/login', withErrorHandling(login));

export default router;
