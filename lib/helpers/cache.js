import NodeCache from 'node-cache';
import { isEmpty } from 'ramda';

const cache = new NodeCache();

export const conCache = (cacheKey, obtenerValor) => async () => {
  const desdeCache = cache.get(cacheKey);

  if (desdeCache) {
    return desdeCache;
  }

  const valor = await obtenerValor();

  if (!isEmpty(valor)) {
    cache.set(cacheKey, valor);
  }

  return valor;
};

export const limpiarCache = () => cache.flushAll();
