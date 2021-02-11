import Usuario from '../models/usuario';
import { cleanDb } from '../../test/db_utils';

describe('Usuario', () => {
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

  describe('Al actualizar', () => {
    it('no cambia la contraseña', async () => {
      const { contrasenia } = await Usuario.findByPk(informatico.id);
      await informatico.update({ fechaSincronizacionGuarani: new Date() });

      expect(informatico.contrasenia).toEqual(contrasenia);
    });
  });
});
