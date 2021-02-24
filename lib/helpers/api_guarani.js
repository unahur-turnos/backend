import { compose, prop, sortBy, toLower } from 'ramda';
import axios from 'axios';
import { guaraniApiUrl } from '../config/auth';
import { rollbar } from '../config/rollbar';
import { conCache } from './cache';

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

export const getCarreras = conCache('carrerasGuarani', async () => {
  try {
    const response = await makeApi().get(`/carreras`);
    return sortBy(compose(toLower, prop('nombre')), response.data);
  } catch (error) {
    rollbar.error('La API Guaraní está en el horno', error);
    throw error;
  }
});
