import Edificio from '../models/edificio';
import { cleanDb } from '../../test/db_utils';
import { getAuthorizedRequest } from '../../test/config_token';

describe('Edificio controller', () => {
  let request;

  beforeAll(async () => {
    await cleanDb();

    request = (await getAuthorizedRequest()).request;

    await Edificio.bulkCreate([
      { nombre: 'Malvinas' },
      { nombre: 'Origone A' },
    ]);
  });

  describe('/edificios', () => {
    it('devuelve código 200', async () => {
      const response = await request.get('/api/edificios');
      expect(response.statusCode).toBe(200);
    });

    it('devuelve la lista de edificios', async () => {
      const response = await request.get('/api/edificios');
      expect(response.body).toMatchObject({
        data: [{ nombre: 'Malvinas' }, { nombre: 'Origone A' }],
      });
    });
  });

  describe('/edificios/id', () => {
    describe('Cuando existe el edificio', () => {
      it('devuelve código 200', async () => {
        const response = await request.get('/api/edificios/1');
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
          data: { nombre: 'Malvinas' },
        });
      });
    });

    describe('Cuando el edificio no existe', () => {
      it('devuelve código 404', async () => {
        const response = await request.get('/api/edificios/258');
        expect(response.statusCode).toBe(404);
      });
    });

    describe('Actualizar y verificar cambio de los datos', () => {
      it('actualizar', async () => {
        const response = await request.put('/api/edificios/1').send({
          nombre: 'Malvinas Argentinas',
        });
        expect(response.statusCode).toBe(200);

        const get = await request.get('/api/edificios/1');
        expect(get.body).toMatchObject({
          data: { nombre: 'Malvinas Argentinas' },
        });
      });
    });

    describe('Borrar y verificar que se eliminó', () => {
      it('borrar', async () => {
        const response = await request.del('/api/edificios/1');
        expect(response.statusCode).toBe(204);

        const get = await request.get('/api/edificios/1');
        expect(get.statusCode).toBe(404);
      });
    });
  });
});
