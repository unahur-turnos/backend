import {
    index,
    getById,
    create,
    update,
    deleteById,
  } from '../controllers/actividad_controller';
  
  import express from 'express';
  import { withErrorHandling } from './utils';
  
  const router = express.Router();
  
  router.get('/', withErrorHandling(index));
  router.get('/:id', withErrorHandling(getById));
  router.post('/', withErrorHandling(create));
  router.put('/:id', withErrorHandling(update));
  router.delete('/:id', withErrorHandling(deleteById));
  
  export default router;
  