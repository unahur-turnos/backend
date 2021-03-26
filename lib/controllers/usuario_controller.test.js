import { sendMail } from '../helpers/mail_sender';
import Actividad from '../models/actividad';
import Edificio from '../models/edificio';
import Espacio from '../models/espacio';
import InscripcionCarrera from '../models/inscripcionCarrera';
import Turno from '../models/turno';
import Usuario from '../models/usuario';
import { cleanDb } from '../../test/db_utils';
import {
  getAuthorizedRequest,
  getAuthorizedRequestWithToken,
} from '../../test/config_token';
import { inscripcionesPara } from '../helpers/api_guarani';
import { pick } from 'ramda';

jest.mock('../helpers/api_guarani');
jest.mock('../helpers/mail_sender');

describe('Usuario controller', () => {
  let request;
  let informatico,
    edificio,
    espacio,
    actividad,
    nuevaActividad,
    autorizacion,
    usuarioOlvidadizo;

  beforeAll(async () => {
    await cleanDb();

    inscripcionesPara.mockResolvedValue(null);
    sendMail.mockResolvedValue();

    informatico = await Usuario.create({
      nombre: 'Databa',
      apellido: 'SePreUser',
      contrasenia: 'contrasenia123',
      dni: 4614047,
      telefono: 1164081371,
      email: 'prueba@asdasd.com',
      rol: 'asistente',
      fechaSincronizacionGuarani: null,
      tokenTemporal: null,
    });

    await InscripcionCarrera.create({
      usuarioId: informatico.id,
      idCarrera: 21,
      nombreCarrera: 'Tecnicatura en Informática',
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
    describe('de un usuario nuevo', () => {
      let response;

      beforeAll(async () => {
        response = await request.post('/api/usuarios/registro').send({
          nombre: 'Usuario',
          apellido: 'Prueba',
          contrasenia: 'Admin123',
          dni: 5000000,
          telefono: 1100555555,
          email: 'usuario@pruebaturnos.com',
          rol: 'admin',
          fechaSincronizacionGuarani: null,
        });
      });

      it('devuelve código 201', async () => {
        expect(response.statusCode).toBe(201);
      });

      it('envía un mail de bienvenida', async () => {
        expect(sendMail).toHaveBeenCalledWith({
          destinatario: 'usuario@pruebaturnos.com',
          asunto: '¡Gracias por registrarte!',
          template: expect.any(String),
          parametros: expect.any(Object),
        });
      });
    });

    it('con número de telefono grande', async () => {
      const response = await request.post('/api/usuarios/registro').send({
        nombre: 'Im a',
        apellido: 'Test',
        contrasenia: 'admin123',
        dni: 35970083,
        telefono: '3541274111',
        email: 'asjdos@asdasd.com',
        rol: 'admin',
        fechaSincronizacionGuarani: null,
      });

      expect(response.statusCode).toBe(201);
    });

    describe('con datos de otro usuario que ya existe', () => {
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

  describe('/recuperar', () => {
    let response;

    beforeAll(async () => {
      usuarioOlvidadizo = await Usuario.create({
        nombre: 'Databa',
        apellido: 'SePreUser',
        contrasenia: 'contrasenia123',
        dni: 42424242,
        telefono: 11248676,
        email: 'prueba_recuperar@asdasd.com',
        rol: 'asistente',
        fechaSincronizacionGuarani: null,
        tokenTemporal: null,
      });
      response = await request
        .post('/api/usuarios/recuperar')
        .send({ dni: usuarioOlvidadizo.dni });
    });

    it('devuelve código 200', async () => {
      expect(response.statusCode).toBe(200);
    });

    it('envía mail para recuperar contraseña', async () => {
      expect(sendMail).toHaveBeenCalledWith({
        destinatario: usuarioOlvidadizo.email,
        asunto: 'Recuperar contraseña',
        template: expect.any(String),
        parametros: expect.any(Object),
      });
    });
  });

  describe('/credenciales', () => {
    it('Actualizar contraseña', async () => {
      const req = (
        await getAuthorizedRequestWithToken(
          usuarioOlvidadizo.generarTokenTemporal()
        )
      ).request;
      const response = await req
        .post('/api/usuarios/credenciales')
        .send({ contrasenia: 'NuevaPass1234' });
      expect(response.statusCode).toBe(200);
    });

    it('Login contrasenia vieja falla', async () => {
      const response = await request.post('/api/usuarios/login').send({
        dni: usuarioOlvidadizo.dni,
        contrasenia: 'contrasenia123',
      });

      expect(response.statusCode).toBe(401);
    });

    it('Login correcto', async () => {
      const response = await request.post('/api/usuarios/login').send({
        dni: usuarioOlvidadizo.dni,
        contrasenia: 'NuevaPass1234',
      });

      expect(response.statusCode).toBe(200);
    });
  });

  describe('/usuarios/yo/turnos', () => {
    let response;

    beforeAll(async () => {
      response = await request.get('/api/usuarios/yo/turnos').send(informatico);
    });

    it('devuelve código 200', async () => {
      expect(response.statusCode).toBe(200);
    });

    it('devuelve los turnos con datos de actividad y espacio', async () => {
      expect(response.body.data).toMatchObject([
        {
          id: autorizacion.id,
          medioDeTransporte: autorizacion.medioDeTransporte,
          Actividad: {
            ...pick(['id', 'nombre', 'responsable'], actividad),
            Espacio: {
              nombre: espacio.nombre,
              Edificio: { nombre: edificio.nombre },
            },
          },
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

    it('omite actividades de otras carreras', async () => {
      const practicaEnfermeria = await Actividad.create({
        espacioId: espacio.id,
        nombre: 'Práctica de Enfermería',
        fechaHoraInicio: new Date(),
        fechaHoraFin: new Date(),
        restriccionId: 17,
      });

      const response = await request.get('/api/usuarios/yo/actividades');
      expect(response.body.data).not.toContainEqual(
        expect.objectContaining({ id: practicaEnfermeria.id })
      );
    });
  });
});
