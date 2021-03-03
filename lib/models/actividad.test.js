import { cleanDb } from '../../test/db_utils';
import Actividad, { ActividadSinCuposError } from './actividad';
import Edificio from './edificio';
import Espacio from './espacio';
import { DateTime } from 'luxon';
import Turno from './turno';
import { usuarioDePrueba } from '../../test/factories';
import { filter, propEq } from 'ramda';

describe('Actividad', () => {
  let informatico, espacio, espacioDosLugares, actividad, otraPersona;

  beforeEach(async () => {
    await cleanDb();

    informatico = await usuarioDePrueba({ dni: 4614047 });
    otraPersona = await usuarioDePrueba({ dni: 11223344 });

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

    espacioDosLugares = await Espacio.create({
      edificioId: edificio.id,
      piso: 1,
      nombre: 'Laboratorio 4',
      aforo: 2,
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
      ).rejects.toThrowError(ActividadSinCuposError);
    });

    describe('cuando hay inscripciones concurrentes', () => {
      let otroUsuarioMas, actividadConDosLugares;

      const promisesRechazadas = filter(propEq('status', 'rejected'));

      beforeEach(async () => {
        otroUsuarioMas = await usuarioDePrueba({ dni: 44332211 });

        actividadConDosLugares = await Actividad.create({
          espacioId: espacioDosLugares.id,
          nombre: 'Algo muy bueno',
          fechaHoraInicio: DateTime.fromISO('2021-02-10T09:00:00').toISO(),
          fechaHoraFin: DateTime.fromISO('2021-02-10T11:00:00').toISO(),
        });
      });

      it('y queda cupo para todas', async () => {
        // El allSettled espera a que todas las promises terminen, independientemente de si fallan o no.
        // Ver https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
        const resultado = await Promise.allSettled([
          actividadConDosLugares.sacarTurnoPara({
            usuario: otraPersona,
            medioDeTransporte: 'Movilidad propia',
          }),
          actividadConDosLugares.sacarTurnoPara({
            usuario: otroUsuarioMas,
            medioDeTransporte: 'Movilidad propia',
          }),
        ]);

        expect(promisesRechazadas(resultado)).toEqual([]);
      });

      it('y solo hay cupo para algunas', async () => {
        const terceroEnDiscordia = await usuarioDePrueba({ dni: 5555555 });

        const resultado = await Promise.allSettled([
          actividadConDosLugares.sacarTurnoPara({
            usuario: otraPersona,
            medioDeTransporte: 'Movilidad propia',
          }),
          actividadConDosLugares.sacarTurnoPara({
            usuario: terceroEnDiscordia,
            medioDeTransporte: 'Movilidad propia',
          }),
          actividadConDosLugares.sacarTurnoPara({
            usuario: otroUsuarioMas,
            medioDeTransporte: 'Movilidad propia',
          }),
        ]);

        // No podemos saber cuál va a fallar,
        // pero sí sabemos que siempre debería fallar una de las tres (porque solo hay dos lugares).
        const rechazadas = promisesRechazadas(resultado);
        expect(rechazadas.length).toBe(1);
        expect(rechazadas).toMatchObject([
          { reason: expect.any(ActividadSinCuposError) },
        ]);
      });
    });
  });
});
