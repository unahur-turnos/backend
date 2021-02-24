import { compose, prop, sortBy, toLower } from 'ramda';
import NodeCache from 'node-cache';
import axios from 'axios';
import { guaraniApiUrl } from '../config/auth';
import { rollbar } from '../config/rollbar';

const cache = new NodeCache();
const makeApi = () => axios.create({ baseURL: guaraniApiUrl });

export const inscripcionesPara = async (dni) => {
  try {
    const response = await makeApi().get(`/inscripciones/${dni}`);
    return response.data.carreras;
  } catch (error) {
    if (error.response.data.status === 404) {
      return [];
    } else {
      rollbar.error('La API Guaraní está en el horno', error);
      return null;
    }
  }
};

export const getCarrera = async (idCarrera) => {
  try {
    const response = await makeApi().get(`/carreras/${idCarrera}`);
    return response.data;
  } catch (error) {
    rollbar.error('La API Guaraní no se encuentra operativa', error);
    throw error;
  }
};

const CARRERAS_CACHE_KEY = 'carrerasGuarani';
export const getCarreras = async () => {
  try {
    const desdeCache = cache.get(CARRERAS_CACHE_KEY);

    if (desdeCache) {
      return desdeCache;
    }

    const response = await makeApi().get(`/carreras`);
    const carrerasOrdenadas = sortBy(
      compose(toLower, prop('nombre')),
      response.data
    );

    cache.set(CARRERAS_CACHE_KEY, carrerasOrdenadas);

    return carrerasOrdenadas;
  } catch (error) {
    rollbar.error('La API Guaraní está en el horno', error);
    throw error;
  }
};
