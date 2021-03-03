import promiseRetry from 'promise-retry';
import { Transaction } from 'sequelize';
import { rollbar } from '../config/rollbar';
import db from '../models';
import debug from 'debug';

const MAX_RETRIES = 20;

const debugLog = debug('turnos-api:sql');

const logRetries = (triesCount) => {
  if (triesCount < MAX_RETRIES) {
    const mensaje = `Reintentando transacción (${triesCount}/${MAX_RETRIES})`;
    rollbar.debug(mensaje);
    debugLog(mensaje);
  } else {
    const mensaje =
      'Una transacción llegó a su último reintento, quizás habría que subir el máximo';
    rollbar.warn(mensaje);
    debugLog(mensaje);
  }
};

export const transaccionConReintento = (operacion) =>
  promiseRetry(
    { minTimeout: 50, randomize: true, retries: MAX_RETRIES },
    async (retry, triesCount) => {
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

        logRetries(triesCount);
        return retry(error);
      }
    }
  );
