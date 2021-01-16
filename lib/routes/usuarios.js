import { index, loginUsuario } from '../controllers/usuario_controller';

import express from 'express';
import passport from 'passport';
import { withErrorHandling } from './utils';

require('../middlewares/auth');

const router = express.Router();

router.get('/', withErrorHandling(index));
router.post(
  '/registro',
  passport.authenticate('registro', { session: false }),
  async (req, res) => {
    res.json({
      msg: 'Registro correcto',
      usuario: req.user,
    });
  }
);
router.post('/login', withErrorHandling(loginUsuario));

export default router;
