import Usuario from '../models/usuario';
import { cleanDb } from '../../test/db_utils';

describe('Usuario controller', () => {
  let informatico;

  beforeAll(async () => {
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

  describe('Actualización de un usuario', () => {
    it('Al actualizar un valor no cambia la contraseña', async () => {
      const usuarioAntesDeActualizar = await Usuario.findByPk(informatico.id);
      const { contrasenia } = usuarioAntesDeActualizar.dataValues;

      await informatico.update({ fechaSincronizacionGuarani: new Date() });

      expect(informatico.dataValues).toMatchObject({ contrasenia });
    });
  });
});
