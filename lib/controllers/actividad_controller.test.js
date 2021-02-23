import Actividad from '../models/actividad';
import Autorizacion from '../models/autorizacion';
import { DateTime } from 'luxon';
import Edificio from '../models/edificio';
import Espacio from '../models/espacio';
import Usuario from '../models/usuario';
import { cleanDb } from '../../test/db_utils';
import { getAuthorizedRequest } from '../../test/config_token';

describe('Actividad controller', () => {
  let request;

  beforeAll(async () => {
    await cleanDb();

    request = (await getAuthorizedRequest()).request;

    const edificios = await Edificio.bulkCreate(
      [{ nombre: 'Malvinas' }, { nombre: 'Origone B' }],
      {
        returning: true,
      }
    );

    const espacios = await Espacio.bulkCreate(
      [
        {
          edificioId: edificios[0].id,
          piso: 1,
          nombre: 'Laboratorio 3',
          habilitado: false,
          aforo: 15,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          edificioId: edificios[1].id,
          piso: 1,
          nombre: 'Biblioteca',
          habilitado: true,
          aforo: 20,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {
        returning: true,
      }
    );

    const actividades = await Actividad.bulkCreate([
      {
        espacioId: espacios[0].id,
        nombre: 'Clase de laboratorio',
        fechaHoraInicio: DateTime.fromISO('2021-02-10T09:00:00').toISO(),
        fechaHoraFin: DateTime.fromISO('2021-02-10T11:00:00').toISO(),
        responsable: 'Mariela Tocino',
        dniResponsable: 18765234,
        tipoResponsable: 'Docente',
        activa: true,
        requiereControl: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        espacioId: espacios[1].id,
        nombre: 'Lectura grupal',
        fechaHoraInicio: DateTime.fromISO('2021-02-16T19:30:00').toISO(),
        fechaHoraFin: DateTime.fromISO('2021-02-16T20:30:00').toISO(),
        responsable: 'Marcela Peperoni',
        dniResponsable: 30234789,
        tipoResponsable: 'No docente',
        activa: true,
        requiereControl: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        espacioId: espacios[1].id,
        nombre: 'Química',
        fechaHoraInicio: DateTime.fromISO('2021-02-08T14:00:00').toISO(),
        fechaHoraFin: DateTime.fromISO('2021-02-08T16:00:00').toISO(),
        responsable: 'Walter White',
        dniResponsable: 11111111,
        tipoResponsable: 'Docente',
        activa: true,
        requiereControl: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        espacioId: espacios[0].id,
        nombre: 'Prácticas de enfermería',
        fechaHoraInicio: DateTime.fromISO('2021-02-22T10:00:00').toISO(),
        fechaHoraFin: DateTime.fromISO('2021-02-22T13:00:00').toISO(),
        responsable: 'Camila Perez',
        dniResponsable: 32000000,
        tipoResponsable: 'Docente',
        activa: false,
        requiereControl: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        espacioId: espacios[1].id,
        nombre: 'Laboratorio de biotecnología',
        fechaHoraInicio: DateTime.fromISO('2021-03-01T09:00:00').toISO(),
        fechaHoraFin: DateTime.fromISO('2021-03-01T12:00:00').toISO(),
        responsable: 'Natalia Soria',
        dniResponsable: 31000000,
        tipoResponsable: 'Invitado',
        activa: false,
        requiereControl: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const usuarios = await Usuario.bulkCreate(
      [
        {
          nombre: 'Usuario',
          apellido: 'Prueba',
          contrasenia: '1234',
          dni: 2,
          telefono: 1,
          email: 'usuario2@gmail.com',
          rol: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true }
    );

    await Autorizacion.bulkCreate([
      {
        usuarioId: usuarios[0].id,
        actividadId: actividades[0].id,
        estuvoEnContacto: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        usuarioId: usuarios[0].id,
        actividadId: actividades[2].id,
        estuvoEnContacto: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        usuarioId: usuarios[0].id,
        actividadId: actividades[2].id,
        estuvoEnContacto: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  });

  describe('/actividades', () => {
    it('devuelve código 200', async () => {
      const response = await request.get('/api/actividades');
      expect(response.statusCode).toBe(200);
    });

    it('sin filtro de fecha', async () => {
      const response = await request.get('/api/actividades');
      expect(response.body.data).toMatchObject([
        {
          espacioId: 2,
          nombre: 'Química',
          responsable: 'Walter White',
          dniResponsable: 11111111,
          tipoResponsable: 'Docente',
          activa: true,
          requiereControl: false,
          autorizaciones: 2,
        },
        {
          espacioId: 1,
          nombre: 'Clase de laboratorio',
          responsable: 'Mariela Tocino',
          dniResponsable: 18765234,
          tipoResponsable: 'Docente',
          activa: true,
          requiereControl: false,
          autorizaciones: 1,
        },
        {
          espacioId: 2,
          nombre: 'Lectura grupal',
          responsable: 'Marcela Peperoni',
          dniResponsable: 30234789,
          tipoResponsable: 'No docente',
          activa: true,
          requiereControl: false,
          autorizaciones: 0,
        },
      ]);
    });

    it('con filtro de fecha {desde}', async () => {
      const response = await request.get('/api/actividades?desde=2021-02-09');
      expect(response.body.data).toMatchObject([
        {
          espacioId: 1,
          nombre: 'Clase de laboratorio',
          responsable: 'Mariela Tocino',
          dniResponsable: 18765234,
          tipoResponsable: 'Docente',
          activa: true,
          requiereControl: false,
          autorizaciones: 1,
        },
        {
          espacioId: 2,
          nombre: 'Lectura grupal',
          responsable: 'Marcela Peperoni',
          dniResponsable: 30234789,
          tipoResponsable: 'No docente',
          activa: true,
          requiereControl: false,
          autorizaciones: 0,
        },
      ]);
    });

    it('con filtro de fecha {hasta}', async () => {
      const response = await request.get('/api/actividades?hasta=2021-02-15');
      expect(response.body.data).toMatchObject([
        {
          espacioId: 2,
          nombre: 'Química',
          responsable: 'Walter White',
          dniResponsable: 11111111,
          tipoResponsable: 'Docente',
          activa: true,
          requiereControl: false,
          autorizaciones: 2,
        },
        {
          espacioId: 1,
          nombre: 'Clase de laboratorio',
          responsable: 'Mariela Tocino',
          dniResponsable: 18765234,
          tipoResponsable: 'Docente',
          activa: true,
          requiereControl: false,
          autorizaciones: 1,
        },
      ]);
    });

    it('con filtro de fecha {desde, hasta}', async () => {
      const response = await request.get(
        '/api/actividades?desde=2021-02-10&hasta=2021-02-15'
      );
      expect(response.body.data).toMatchObject([
        {
          espacioId: 1,
          nombre: 'Clase de laboratorio',
          responsable: 'Mariela Tocino',
          dniResponsable: 18765234,
          tipoResponsable: 'Docente',
          activa: true,
          requiereControl: false,
          autorizaciones: 1,
        },
      ]);
    });

    it('con filtro de inactivas', async () => {
      const response = await request.get('/api/actividades?inactivas=true');
      expect(response.body.data).toMatchObject([
        {
          espacioId: 2,
          nombre: 'Química',
          responsable: 'Walter White',
          dniResponsable: 11111111,
          tipoResponsable: 'Docente',
          activa: true,
          requiereControl: false,
          autorizaciones: 2,
        },
        {
          espacioId: 1,
          nombre: 'Clase de laboratorio',
          responsable: 'Mariela Tocino',
          dniResponsable: 18765234,
          tipoResponsable: 'Docente',
          activa: true,
          requiereControl: false,
          autorizaciones: 1,
        },
        {
          espacioId: 2,
          nombre: 'Lectura grupal',
          responsable: 'Marcela Peperoni',
          dniResponsable: 30234789,
          tipoResponsable: 'No docente',
          activa: true,
          requiereControl: false,
          autorizaciones: 0,
        },
        {
          espacioId: 1,
          nombre: 'Prácticas de enfermería',
          responsable: 'Camila Perez',
          dniResponsable: 32000000,
          tipoResponsable: 'Docente',
          activa: false,
          requiereControl: true,
          autorizaciones: 0,
        },
        {
          espacioId: 2,
          nombre: 'Laboratorio de biotecnología',
          responsable: 'Natalia Soria',
          dniResponsable: 31000000,
          tipoResponsable: 'Invitado',
          activa: false,
          requiereControl: true,
          autorizaciones: 0,
        },
      ]);
    });

    it('con filtro de fechas {desde} e inactivas', async () => {
      const response = await request.get(
        '/api/actividades?desde=2021-02-15&inactivas=true'
      );
      expect(response.body.data).toMatchObject([
        {
          espacioId: 2,
          nombre: 'Lectura grupal',
          responsable: 'Marcela Peperoni',
          dniResponsable: 30234789,
          tipoResponsable: 'No docente',
          activa: true,
          requiereControl: false,
          autorizaciones: 0,
        },
        {
          espacioId: 1,
          nombre: 'Prácticas de enfermería',
          responsable: 'Camila Perez',
          dniResponsable: 32000000,
          tipoResponsable: 'Docente',
          activa: false,
          requiereControl: true,
          autorizaciones: 0,
        },
        {
          espacioId: 2,
          nombre: 'Laboratorio de biotecnología',
          responsable: 'Natalia Soria',
          dniResponsable: 31000000,
          tipoResponsable: 'Invitado',
          activa: false,
          requiereControl: true,
          autorizaciones: 0,
        },
      ]);
    });
  });

  describe('/actividades/id', () => {
    describe('Cuando existe la actividad', () => {
      it('devuelve código 200', async () => {
        const response = await request.get('/api/actividades/1');
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
          data: {
            espacioId: 1,
            nombre: 'Clase de laboratorio',
            responsable: 'Mariela Tocino',
            dniResponsable: 18765234,
            tipoResponsable: 'Docente',
            activa: true,
            requiereControl: false,
          },
        });
      });
    });

    describe('Cuando no existe la actividad', () => {
      it('devuelve código 404', async () => {
        const response = await request.get('/api/actividades/150');
        expect(response.statusCode).toBe(404);
      });
    });

    describe('Actualizar y verificar cambio de los datos', () => {
      it('actualizar', async () => {
        const response = await request.put('/api/actividades/2').send({
          espacioId: 2,
          nombre: 'Lectura',
          fechaHoraInicio: '2021-08-21 04:05:02',
          fechaHoraFin: '2021-08-21 06:05:02',
          responsable: 'Marcela Peperoni',
          dniResponsable: 30234789,
          tipoResponsable: 'Docente',
          activa: true,
          requiereControl: false,
        });
        expect(response.statusCode).toBe(200);

        const get = await request.get('/api/actividades/2');
        expect(get.body).toMatchObject({
          data: {
            espacioId: 2,
            nombre: 'Lectura',
            responsable: 'Marcela Peperoni',
            dniResponsable: 30234789,
            tipoResponsable: 'Docente',
            activa: true,
            requiereControl: false,
          },
        });
      });
    });

    describe('Borrar y verificar que se eliminó', () => {
      it('borrar', async () => {
        const response = await request.del('/api/actividades/2');
        expect(response.statusCode).toBe(204);

        const get = await request.get('/api/actividades/2');
        expect(get.statusCode).toBe(404);
      });
    });
  });
});
