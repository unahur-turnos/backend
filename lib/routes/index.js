import edificios from './edificios';
import espacios from './espacios';
import express from 'express';

const router = express.Router();

router.use('/api/edificios', edificios);
router.use('/api/espacios', espacios);

export default router;
