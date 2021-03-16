import { DateTime } from 'luxon';

export const getInicioDelDia = (fecha) => {
  //console.log(DateTime.fromISO(fecha).startOf('day').toISO());
  return DateTime.fromISO(fecha).startOf('day').toISO();
};

export const getFinDelDia = (fecha) => {
  return DateTime.fromISO(fecha).endOf('day').toISO();
};

export const getFechaActual = () => {
  return DateTime.local().toISODate();
};

export const formatISO = (fecha) => {
  return DateTime.fromISO(fecha).toISO();
};

// export const getFecha = (fecha) => {
//   console.log(DateTime.toJSDate(fecha));
//   return DateTime.toJSDate(fecha);
// }
