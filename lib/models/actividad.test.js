import Usuario from '../models/usuario';
import { cleanDb } from '../../test/db_utils';
import Actividad from './actividad';
import Edificio from './edificio';
import Espacio from './espacio';
import { DateTime } from 'luxon';

describe('Actividad', () => {
  let informatico, espacio, actividad;

  beforeEach(async () => {
    await cleanDb();

    informatico = await Usuario.create({
      nombre: 'Databa',
      apellido: 'SePreUser',
      contrasenia: 'contrasenia123',
      dni: 4614047,
      telefono: 1164081371,
      email: 'prueba@asdasd.com',
      rol: 'admin',
      fechaSincronizacionGuarani: null,
    });

    const edificio = await Edificio.create({ nombre: 'Origone A' });

    espacio = await Espacio.create({
      edificioId: edificio.id,
      piso: 1,
      nombre: 'Laboratorio 3',
      habilitado: false,
      aforo: 15,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    actividad = await Actividad.create({
      espacioId: espacio.id,
      nombre: 'Clase de laboratorio',
      fechaHoraInicio: DateTime.fromISO('2021-02-10T09:00:00').toISO(),
      fechaHoraFin: DateTime.fromISO('2021-02-10T11:00:00').toISO(),
      responsable: 'Mariela Tocino',
      telefonoDeContactoResponsable: '11458679',
      activa: true,
      requiereControl: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  describe('lugaresDisponibles', () => {
    it('devuelve la cuenta', async () => {
      const lugaresDisponibles = await actividad.lugaresDisponibles();
      expect(lugaresDisponibles).toEqual(15);
    });
  });
});
