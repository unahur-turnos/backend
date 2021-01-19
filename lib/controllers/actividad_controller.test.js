import Actividad from '../models/actividad';
import Espacio from '../models/espacio';
import Edificio from '../models/edificio';
import app from '../app';
import { cleanDb } from '../../test/db_utils';
import request from 'supertest';
import Usuario from '../models/usuario';

describe('Actividad controller', () => {
  let token;
  beforeAll(async () => {
    await cleanDb();

    const usuario = {
      nombre: 'Usuario',
      apellido: 'Prueba',
      contrasenia: '1234',
      dni: 1,
      telefono: 1,
      email: 'usuario@gmail.com',
      rol: 'invitado',
    };

    await Usuario.create(usuario);

    const login = await request(app).post('/api/usuarios/login').send({
      dni: usuario.dni,
      contrasenia: usuario.contrasenia,
    });

    token = login.body.token;

    const edificios = await Edificio.bulkCreate(
      [
        { id: 1, nombre: 'Malvinas' },
        { id: 2, nombre: 'Origone B' },
      ],
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

    await Actividad.bulkCreate([
      {
        espacioId: espacios[0].id,
        nombre: 'Clase de laboratorio',
        fechaHoraInicio: new Date(),
        fechaHoraFin: new Date(),
        responsable: 'Mariela Tocino',
        dniResponsable: 18765234,
        tipoResponsable: 'Docente',
        estado: true,
        requiereControl: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        espacioId: espacios[1].id,
        nombre: 'Lectura grupal',
        fechaHoraInicio: new Date(),
        fechaHoraFin: new Date(),
        responsable: 'Marcela Peperoni',
        dniResponsable: 30234789,
        tipoResponsable: 'No docente',
        estado: true,
        requiereControl: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  });

  describe('/actividades', () => {
    it('devuelve código 200', async () => {
      const response = await request(app)
        .get('/api/actividades')
        .set('Authorization', `Bearer ${token}`);
      expect(response.statusCode).toBe(200);
    });

    it('devuelve la lista de actividad', async () => {
      const response = await request(app)
        .get('/api/actividades')
        .set('Authorization', `Bearer ${token}`);
      expect(response.body).toMatchObject({
        data: [
          { nombre: 'Clase de laboratorio' },
          { nombre: 'Lectura grupal' },
        ],
      });
    });
  });

  describe('/actividades/id', () => {
    describe('Cuando existe la actividad', () => {
      it('devuelve código 200', async () => {
        const response = await request(app)
          .get('/api/actividades/1')
          .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
          data: { nombre: 'Clase de laboratorio' },
        });
      });
    });

    describe('Cuando no existe la actividad', () => {
      it('devuelve código 404', async () => {
        const response = await request(app)
          .get('/api/actividades/150')
          .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(404);
      });
    });

    describe('Actualizar y verificar cambio de los datos', () => {
      it('actualizar', async () => {
        const response = await request(app)
          .put('/api/actividades/2')
          .send({
            espacioId: 2,
            nombre: 'Lectura',
            fechaHoraInicio: '2021-08-21 04:05:02',
            fechaHoraFin: '2021-08-21 06:05:02',
            responsable: 'Marcela Peperoni',
            dniResponsable: 30234789,
            tipoResponsable: 'Docente',
            estado: true,
            requiereControl: false,
          })
          .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);

        const get = await request(app)
          .get('/api/actividades/2')
          .set('Authorization', `Bearer ${token}`);
        expect(get.body).toMatchObject({
          data: {
            nombre: 'Lectura',
            tipoResponsable: 'Docente',
          },
        });
      });
    });

    describe('Borrar y verificar que se eliminó', () => {
      it('borrar', async () => {
        const response = await request(app)
          .del('/api/actividades/2')
          .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(204);

        const get = await request(app)
          .get('/api/actividades/2')
          .set('Authorization', `Bearer ${token}`);
        expect(get.statusCode).toBe(404);
      });
    });
  });
});
