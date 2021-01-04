import Edificio from '../models/edificio';
import Espacio from '../models/espacio';
import app from '../app';
import { cleanDb } from '../../test/db_utils';
import request from 'supertest';

describe('Espacio controller', () => {
  beforeAll(async () => {
    await cleanDb();

    const edificios = await Edificio.bulkCreate(
      [
        { id: 1, nombre: 'Malvinas' },
        { id: 2, nombre: 'Origone B' },
      ],
      {
        returning: true,
      }
    );

    await Espacio.bulkCreate([
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
    ]);
  });

  describe('/espacios', () => {
    it('devuelve código 200', async () => {
      const response = await request(app).get('/api/espacios');
      expect(response.statusCode).toBe(200);
    });

    it('devuelve la lista de espacios', async () => {
      const response = await request(app).get('/api/espacios');
      expect(response.body).toMatchObject({
        data: [{ nombre: 'Laboratorio 3' }, { nombre: 'Biblioteca' }],
      });
    });
  });

  describe('/espacios/id', () => {
    it('devuelve código 200', async () => {
      const response = await request(app).get('/api/espacios/2');
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        data: { nombre: 'Biblioteca' },
      });
    });

    it('devuelve código 404', async () => {
      const response = await request(app).get('/api/espacios/258');
      expect(response.statusCode).toBe(404);
    });

    it('actualizar', async () => {
      const response = await request(app).put('/api/espacios/1').send({
        nombre: 'Almacen de Material Didactico',
      });
      expect(response.statusCode).toBe(200);

      const get = await request(app).get('/api/espacios/1');
      expect(get.body).toMatchObject({
        data: { nombre: 'Almacen de Material Didactico' },
      });
    });

    it('borrar', async () => {
      const response = await request(app).del('/api/espacios/2');
      expect(response.statusCode).toBe(204);

      const get = await request(app).get('/api/espacios/2');
      expect(get.statusCode).toBe(404);
    });
  });
});
