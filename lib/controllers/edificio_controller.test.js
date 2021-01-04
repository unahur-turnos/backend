import request from 'supertest';
import { cleanDb } from '../../test/db_utils';
import app from '../app';
import Edificio from '../models/edificio';

describe('Edificio controller', () => {
  beforeAll(async () => {
    await cleanDb();

    await Edificio.bulkCreate([
      { nombre: 'Malvinas' },
      { nombre: 'Origone A' },
    ]);
  });

  describe('/edificios', () => {
    it('devuelve código 200', async () => {
      const response = await request(app).get('/api/edificios');
      expect(response.statusCode).toBe(200);
    });

    it('devuelve la lista de edificios', async () => {
      const response = await request(app).get('/api/edificios');
      expect(response.body).toMatchObject({
        data: [{ nombre: 'Malvinas' }, { nombre: 'Origone A' }],
      });
    });
  });

  describe('/edificios/id', () => {
    it('devuelve código 200', async () => {
      const response = await request(app).get('/api/edificios/1');
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        data: { nombre: 'Malvinas' },
      });
    });

    it('devuelve código 404', async () => {
      const response = await request(app).get('/api/edificios/258');
      expect(response.statusCode).toBe(404);
    });

    it('actualizar', async () => {
      const response = await request(app).put('/api/edificios/1').send({
        nombre: 'Malvinas Argentinas',
      });
      expect(response.statusCode).toBe(200);

      const get = await request(app).get('/api/edificios/1');
      expect(get.body).toMatchObject({
        data: { nombre: 'Malvinas Argentinas' },
      });
    });

    it('borrar', async () => {
      const response = await request(app).del('/api/edificios/1');
      expect(response.statusCode).toBe(204);

      const get = await request(app).get('/api/edificios/1');
      expect(get.statusCode).toBe(404);
    });
  });
});
