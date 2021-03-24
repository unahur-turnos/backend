import Usuario from '../models/usuario';
import { cleanDb } from '../../test/db_utils';
import Actividad from './actividad';
import InscripcionCarrera from './inscripcionCarrera';

describe('Usuario', () => {
  let informatico;

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
  });

  describe('Al actualizar', () => {
    it('no cambia la contraseña', async () => {
      const { contrasenia } = await Usuario.findByPk(informatico.id);
      await informatico.update({ fechaSincronizacionGuarani: new Date() });

      expect(informatico.contrasenia).toEqual(contrasenia);
    });
  });

  describe('#puedePedirTurnoPara', () => {
    it('una actividad pública', async () => {
      const tourPorLaFacu = Actividad.build({
        nombre: 'Un paseo por la facu',
        fechaHoraInicio: new Date(),
        fechaHoraFin: new Date(),
        tipoResponsable: 'Gestión Estudiantil',
      });
 
      expect(await informatico.puedePedirTurnoPara(tourPorLaFacu)).toBeTruthy();

    });

    describe('una actividad con restricción', () => {
      const claseObjetos2 = Actividad.build({
        nombre: 'Clase de Objetos 2',
        fechaHoraInicio: new Date(),
        fechaHoraFin: new Date(),
        tipoResponsable: 'Docente',
        restriccionId: 21,
      });




      it('cuando cursa la carrera', async () => {
        await InscripcionCarrera.create({
          idCarrera: 21,
          nombreCarrera: 'Tecnicatura en Programación Informática',
          usuarioId: informatico.id,
        });

        expect(
          await informatico.puedePedirTurnoPara(claseObjetos2)
        ).toBeTruthy();
      });

      it('cuando no cursa la carrera', async () => {
        expect(
          await informatico.puedePedirTurnoPara(claseObjetos2)
        ).toBeFalsy();
      });


    });
  });
});
