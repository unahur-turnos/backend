import { cleanDb } from '../../test/db_utils';
import Usuario from './usuario';

describe('Usuario', () => {
  let fede;

  beforeAll(async () => {
    // Borramos todos los datos preexistentes en la base.
    await cleanDb();

    fede = await Usuario.create({
      fechaNacimiento: '1991-10-30',
      nombre: 'Fede',
      apellido: 'Aloi',
    });

    // Fijamos la fecha actual con un fake para que el test no dependa del día en que se ejecuta.
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2020-12-16').getTime());
  });

  afterAll(() => {
    // Volvemos a la fecha real.
    jest.useRealTimers();
  });

  test('campos básicos', () => {
    // Usamos toMatchObject y no toEquals para que solo mire los atributos que especificamos.
    expect(fede).toMatchObject({
      nombre: 'Fede',
      fechaNacimiento: '1991-10-30',
    });
  });

  test('edad - se calcula a partir de la fecha de nacimiento', () => {
    expect(fede.edad).toEqual(29);
  });

  describe('es tocayo de', () => {
    // El método build crea un objeto pero no lo persiste, por eso no hace falta el await.
    const otroFede = Usuario.build({ nombre: 'Fede', apellido: 'Sierra' });
    const daiana = Usuario.build({ nombre: 'Daiana', apellido: 'Sierra' });

    test('alguien con el mismo nombre', () => {
      expect(fede.esTocayoDe(otroFede)).toBeTruthy();
    });

    test('alguien con otro nombre', () => {
      expect(fede.esTocayoDe(daiana)).toBeFalsy();
    });
  });
});
