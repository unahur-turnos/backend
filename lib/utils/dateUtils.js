import { DateTime } from 'luxon';

export const getInicioDelDia = (fecha) => {
  return DateTime.fromISO(fecha).startOf('day').toISO();
};

export const getFinDelDia = (fecha) => {
  return DateTime.fromISO(fecha).endOf('day').toISO();
};

export const getFechaActual = () => {
  return DateTime.local().toISODate();
};