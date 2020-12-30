import express from 'express';
import usuarios from './usuarios';
import espacios from './espacios';

const router = express.Router();

router.use('/api/usuarios', usuarios);
router.use('/api/espacios', espacios);

export default router;
