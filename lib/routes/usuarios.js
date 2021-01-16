import {
  index,
  loginUsuario,
  registroUsuario,
} from '../controllers/usuario_controller';

import express from 'express';
import { withErrorHandling } from './utils';

const router = express.Router();

router.get('/', withErrorHandling(index));
router.post('/registro', withErrorHandling(registroUsuario));
router.post('/login', withErrorHandling(loginUsuario));

export default router;
