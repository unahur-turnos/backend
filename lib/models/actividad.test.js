import Usuario from '../models/usuario';
import { cleanDb } from '../../test/db_utils';
import Actividad, { NoHayMasCuposError } from './actividad';
import Edificio from './edificio';
import Espacio from './espacio';
import { DateTime } from 'luxon';
import Turno from './turno';

describe('Actividad', () => {
  let informatico, espacio, actividad, otraPersona;

  beforeEach(async () => {
    await cleanDb();

    informatico = await Usuario.create({
      nombre: 'Databa',
      apellido: 'SePreUser',
      contrasenia: 'contrasenia123',
      dni: 4614047,
      telefono: 1164081371,
      email: 'prueba@asdasd.com',
    });

    otraPersona = await Usuario.create({
      nombre: 'Pirulo',
      apellido: 'SePreUser',
      contrasenia: 'contrasenia123',
      dni: 11223344,
      telefono: 1164081371,
      email: 'prueba-123@asdasd.com',
    });

    const edificio = await Edificio.create({ nombre: 'Origone A' });

    espacio = await Espacio.create({
      edificioId: edificio.id,
      piso: 1,
      nombre: 'Laboratorio 3',
      habilitado: false,
      aforo: 1,
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
    beforeEach(async () => {
      await Turno.create({
        usuarioId: informatico.id,
        actividadId: actividad.id,
        medioDeTransporte: 'Movilidad propia',
      });
    });

    it('devuelve la cuenta', async () => {
      const lugaresDisponibles = await actividad.lugaresDisponibles();
      expect(lugaresDisponibles).toEqual(0);
    });
  });

  describe('sacarTurnoPara', () => {
    let turnoInformatico;

    beforeEach(async () => {
      turnoInformatico = await actividad.sacarTurnoPara({
        usuario: informatico,
        medioDeTransporte: 'Movilidad propia',
      });
    });

    it('cuando hay lugares disponibles', async () => {
      expect(turnoInformatico).toMatchObject({
        actividadId: actividad.id,
        usuarioId: informatico.id,
        medioDeTransporte: 'Movilidad propia',
      });
    });

    it('cuando no hay más lugares', async () => {
      await expect(
        actividad.sacarTurnoPara({
          usuario: otraPersona,
          medioDeTransporte: 'Movilidad propia',
        })
      ).rejects.toThrowError(NoHayMasCuposError);
    });
  });
});
