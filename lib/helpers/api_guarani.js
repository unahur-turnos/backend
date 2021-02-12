import axios from 'axios';
import { guaraniApiUrl } from '../config/auth';
import { rollbar } from '../config/rollbar';

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

export const getCarreras = async () => {
  try {
    const response = await makeApi().get(`/carreras`);
    return response.data;
  } catch (error) {
    rollbar.error('La API Guaraní está en el horno', error);
    throw error;
  }
};
