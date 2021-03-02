import Actividad from '../models/actividad';
import Edificio from '../models/edificio';
import Espacio from '../models/espacio';
import Turno from '../models/turno';
import Usuario from '../models/usuario';
import { cleanDb } from '../../test/db_utils';
import { getAuthorizedRequest } from '../../test/config_token';
import { inscripcionesPara } from '../helpers/api_guarani';

jest.mock('../helpers/api_guarani');

describe('Usuario controller', () => {
  let request;
  let informatico, edificio, espacio, actividad, nuevaActividad, autorizacion;

  beforeAll(async () => {
    await cleanDb();

    inscripcionesPara.mockResolvedValue(null);

    informatico = await Usuario.create({
      nombre: 'Databa',
      apellido: 'SePreUser',
      contrasenia: 'contrasenia123',
      dni: 4614047,
      telefono: 1164081371,
      email: 'prueba@asdasd.com',
      rol: 'asistente',
      fechaSincronizacionGuarani: null,
    });

    request = (await getAuthorizedRequest(informatico)).request;

    edificio = await Edificio.create({
      nombre: 'Malvinas',
    });

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
      fechaHoraInicio: new Date(),
      fechaHoraFin: new Date(),
      responsable: 'Mariela Tocino',
      telefonoDeContactoResponsable: '1145867998',
      activa: true,
      requiereControl: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    nuevaActividad = await Actividad.create({
      espacioId: espacio.id,
      nombre: 'Clase de química',
      fechaHoraInicio: new Date(),
      fechaHoraFin: new Date(),
      responsable: 'Carlos Perez',
      telefonoDeContactoResponsable: '1100110011',
      activa: true,
      requiereControl: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    autorizacion = await Turno.create({
      usuarioId: informatico.id,
      actividadId: actividad.id,
      medioDeTransporte: 'Movilidad propia',
      completoCapacitacion: false,
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

  describe('Turnos del usuario', () => {
    it('Turnos del usuario', async () => {
      const response = await request.get('/api/usuarios/yo/turnos');

      expect(response.statusCode).toBe(200);
    });

    it('Cantidad de turnos', async () => {
      const responseGET = await request
        .get('/api/usuarios/yo/turnos')
        .send(informatico);
      expect(responseGET.body.data).toMatchObject([
        {
          id: autorizacion.id,
          medioDeTransporte: autorizacion.medioDeTransporte,
          actividadId: actividad.id,
          usuarioId: informatico.id,
        },
      ]);
    });
  });

  describe('Actividades del usuario', () => {
    it('Devuelve código 200', async () => {
      const response = await request.get('/api/usuarios/yo/actividades');
      expect(response.statusCode).toBe(200);
    });

    it('Antes de sacar turno', async () => {
      const response = await request.get('/api/usuarios/yo/actividades');
      expect(response.body.data).toMatchObject([
        {
          espacioId: espacio.id,
          nombre: 'Clase de química',
          responsable: 'Carlos Perez',
          telefonoDeContactoResponsable: '1100110011',
          activa: true,
          requiereControl: true,
          turnos: 0,
        },
      ]);
    });

    it('Después de sacar turno', async () => {
      await Turno.create({
        usuarioId: informatico.id,
        actividadId: nuevaActividad.id,
        medioDeTransporte: 'Caminando',
        completoCapacitacion: true,
      });

      const response = await request.get('/api/usuarios/yo/actividades');
      expect(response.body.data).toEqual([]);
    });
  });
});
