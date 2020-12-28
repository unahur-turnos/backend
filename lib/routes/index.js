import express from 'express';
import usuarios from './usuarios';

const router = express.Router();

router.use('/api/usuarios', usuarios);

export default router;
