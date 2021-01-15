import express from 'express';
import { withErrorHandling } from './utils';
import {
  index,
  registroUsuario,
  loginUsuario,
} from '../controllers/usuario_controller';

const router = express.Router();
router.get('/', withErrorHandling(index));
router.post('/registro', withErrorHandling(registroUsuario));
router.post('/login', withErrorHandling(loginUsuario));

export default router;
