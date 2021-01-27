import Actividad from '../models/actividad';
import Edificio from '../models/edificio';
import Espacio from '../models/espacio';
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
      const response = await request.get('/api/actividades');
      expect(response.statusCode).toBe(200);
    });

    it('devuelve la lista de actividad', async () => {
      const response = await request.get('/api/actividades');
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
        const response = await request.get('/api/actividades/1');
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
          data: { nombre: 'Clase de laboratorio' },
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
          estado: true,
          requiereControl: false,
        });
        expect(response.statusCode).toBe(200);

        const get = await request.get('/api/actividades/2');
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
        const response = await request.del('/api/actividades/2');
        expect(response.statusCode).toBe(204);

        const get = await request.get('/api/actividades/2');
        expect(get.statusCode).toBe(404);
      });
    });
  });
});
