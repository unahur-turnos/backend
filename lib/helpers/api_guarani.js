import axios from 'axios';
import { guaraniApiUrl } from '../config/auth';
import { rollbar } from '../config/rollbar';

export const makeApi = () => axios.create({ baseURL: guaraniApiUrl });

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
