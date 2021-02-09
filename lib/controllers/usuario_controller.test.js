import Usuario from '../models/usuario';
import { cleanDb } from '../../test/db_utils';
import { getAuthorizedRequest } from '../../test/config_token';
import { inscripcionesPara } from '../helpers/api_guarani';

jest.mock('../helpers/api_guarani');

describe('Usuario controller', () => {
  let request;
  let informatico;

  beforeAll(async () => {
    await cleanDb();

    inscripcionesPara.mockResolvedValue(null);

    request = (await getAuthorizedRequest()).request;

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

  describe('/registro', () => {
    it('Devuelve código 201', async () => {
      const response = await request.post('/api/usuarios/registro').send({
        nombre: 'Im a',
        apellido: 'Test',
        contrasenia: 'admin123',
        dni: 42435381,
        telefono: 1164081371,
        email: 'asjdosadaj@asdasd.com',
        rol: 'admin',
        fechaSincronizacionGuarani: null,
      });

      expect(response.statusCode).toBe(201);
    });

    describe('El usuario ya existe', () => {
      it('DNI preexistente', async () => {
        const response = await request.post('/api/usuarios/registro').send({
          nombre: 'Im a',
          apellido: 'Test',
          contrasenia: 'admin123',
          dni: informatico.dni,
          telefono: 1164081371,
          email: 'asjdosadaj@asdasd.com',
          rol: 'admin',
          fechaSincronizacionGuarani: null,
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.error[0]).toBe(
          'El DNI ya está en uso, por favor utilice otro.'
        );
      });

      it('email preexistente', async () => {
        const response = await request.post('/api/usuarios/registro').send({
          nombre: 'Im a',
          apellido: 'Test',
          contrasenia: 'admin123',
          dni: 12345678,
          telefono: 1164081371,
          email: informatico.email,
          rol: 'admin',
          fechaSincronizacionGuarani: null,
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.error[0]).toBe(
          'El email ya está en uso, por favor utilice otro.'
        );
      });
    });
  });

  describe('/login', () => {
    it('Login correcto', async () => {
      const response = await request.post('/api/usuarios/login').send({
        dni: 4614047,
        contrasenia: 'contrasenia123',
      });

      expect(response.statusCode).toBe(200);
    });

    describe('Login incorrecto', () => {
      it('DNI incorrecto', async () => {
        const response = await request.post('/api/usuarios/login').send({
          dni: 42435381,
          contrasenia: 'contrasenia123',
        });
        expect(response.statusCode).toBe(401);
      });

      it('Contraseña incorrecta', async () => {
        const response = await request.post('/api/usuarios/login').send({
          dni: 4614047,
          contrasenia: 'admin123',
        });
        expect(response.statusCode).toBe(401);
      });
    });
  });

  describe('Actualización de un usuario', () => {
    it('Cambiar un dato y verificar que se actualizó', async () => {
      const nuevaFecha = new Date();
      const usuarioAntesDeActualizar = await Usuario.findByPk(informatico.id);

      await informatico.update({ fechaSincronizacionGuarani: nuevaFecha });

      expect(informatico.dataValues).toMatchObject({
        ...usuarioAntesDeActualizar.dataValues,
        fechaSincronizacionGuarani: nuevaFecha,
        updatedAt: informatico.updatedAt,
      });
    });
  });
});
