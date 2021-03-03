import promiseRetry from 'promise-retry';
import { Transaction } from 'sequelize';
import db from '../models';

export const transaccionConReintento = (operacion) =>
  promiseRetry(async (retry) => {
    try {
      const resultado = await db.sequelize.transaction(
        { isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE },
        operacion
      );
      return resultado;
    } catch (error) {
      if (error.name !== 'SequelizeDatabaseError') {
        throw error;
      }

      return retry(error);
    }
  });
