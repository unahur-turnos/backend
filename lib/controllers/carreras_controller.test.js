import { cleanDb } from '../../test/db_utils';
import { getAuthorizedRequest } from '../../test/config_token';
import { take } from 'ramda';

describe('Carrera controller', () => {
  let request;

  beforeAll(async () => {
    await cleanDb();
    request = (await getAuthorizedRequest()).request;
  });

  describe('/carreras', () => {
    it('devuelve código 200', async () => {
      const response = await request.get('/api/carreras');
      expect(response.statusCode).toBe(200);
    });

    it('devuelve las primeras 10 carreras ordenadas por nombre', async () => {
      const response = await request.get('/api/carreras');
      const carreras = take(10, response.body.data);
      expect(carreras).toMatchObject([
        {
          nombre: 'CURSO 111 MIL',
        },
        {
          nombre: 'Curso de Preparacion universitaria',
        },
        {
          nombre: 'CURSO PREPARATORIO DE INGLES',
        },
        {
          nombre: 'Enfermería Universitaria',
        },
        {
          nombre: 'Especialización en Docencia Universitaria',
        },
        {
          nombre:
            'Especialización en Educación Física para personas con discapacidad',
        },
        {
          nombre: 'Especialización en Pedagogías de la Imagen',
        },
        {
          nombre: 'Ingeniería Eléctrica',
        },
        {
          nombre: 'Ingeniería Metalúrgica',
        },
        {
          nombre: 'Jornada de Kinesiología',
        },
      ]);
    });
  });
});
