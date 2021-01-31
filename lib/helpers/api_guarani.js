import axios from 'axios';
import { rollbar } from '../config/rollbar';

// TODO: mover a una variable de entorno
const GUARANI_API_URL = 'http://cidia.unahur.edu.ar/api-guarani';

const makeApi = () => axios.create({ baseURL: GUARANI_API_URL });

export const inscripcionesPara = async (dni) => {
  try {
    const response = await makeApi().get(`/inscripciones/${dni}`);
    return response.data.carreras;
  } catch (error) {
    // Procesar errores
    // 404 -> no hay nadie con ese DNI
    // return []
    // otra cosa -> la API anda mal
    // aplicar rol "pendiente", notificar via rollbar
    rollbar.error('la API Guaraní está en el horno', error);
  }
};
