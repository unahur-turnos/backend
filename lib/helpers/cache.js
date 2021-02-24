import NodeCache from 'node-cache';

const cache = new NodeCache();

export const conCache = (cacheKey, obtenerValor) => async () => {
  const desdeCache = cache.get(cacheKey);

  if (desdeCache) {
    return desdeCache;
  }

  const valor = await obtenerValor();
  cache.set(cacheKey, valor);

  return valor;
};
