import express from 'express';
import { withErrorHandling } from './utils';
import { index, registro, login } from '../controllers/usuario_controller';

require('../middlewares/auth');

const router = express.Router();

router.get('/', withErrorHandling(index));
router.post('/registro', registro);
router.post('/login', login);

export default router;
