import { getCarrera, getCarreras, inscripcionesPara } from './api_guarani';

import axios from 'axios';

jest.mock('axios');

describe('API Guaraní', () => {
  const apiMock = { get: jest.fn() };

  beforeAll(() => {
    axios.create.mockReturnValue(apiMock);
  });

  describe('inscripcionesPara', () => {
    describe('un estudiante que está cursando', () => {
      it('devuelve las carreras y materias', async () => {
        apiMock.get.mockResolvedValue({
          data: {
            id: 11794,
            nombre: 'ALFREDO ',
            apellido: 'Nievas Gomez',
            dni: '4614047',
            carreras: [
              {
                id: 21,
                nombre: 'Tecnicatura universitaria en Informática',
                materias: [
                  {
                    id: 579,
                    nombre: 'Programacion Concurrente',
                    codigo: '766',
                  },
                ],
              },
              {
                id: 38,
                nombre: 'Licenciatura en Informática',
                materias: [
                  {
                    id: 579,
                    nombre: 'Programacion Concurrente',
                    codigo: '766',
                  },
                ],
              },
            ],
          },
        });

        const carreras = await inscripcionesPara('4614047');
        expect(carreras).toEqual([
          {
            id: 21,
            nombre: 'Tecnicatura universitaria en Informática',
            materias: [
              {
                id: 579,
                nombre: 'Programacion Concurrente',
                codigo: '766',
              },
            ],
          },
          {
            id: 38,
            nombre: 'Licenciatura en Informática',
            materias: [
              {
                id: 579,
                nombre: 'Programacion Concurrente',
                codigo: '766',
              },
            ],
          },
        ]);
      });
    });

    describe('una persona que no existe en Guaraní', () => {
      it('no devuelve ninguna carrera', async () => {
        apiMock.get.mockRejectedValue({
          response: {
            data: {
              status: 404,
            },
          },
        });

        const carreras = await inscripcionesPara('12378900');
        expect(carreras).toEqual([]);
      });
    });

    describe('cuando falla con error desconocido', () => {
      it('devuelve null', async () => {
        apiMock.get.mockRejectedValue({
          response: {
            data: {
              status: 503,
            },
          },
        });

        const carreras = await inscripcionesPara('12378900');
        expect(carreras).toBeNull();
      });
    });
  });

  describe('getCarrera', () => {
    describe('cuando existe la carrera', () => {
      it('devuelve la carrera', async () => {
        apiMock.get.mockResolvedValue({
          data: {
            nombre: 'Tecnicatura universitaria en Informática',
          },
        });

        const carrera = await getCarrera(21);
        expect(carrera).toEqual({
          nombre: 'Tecnicatura universitaria en Informática',
        });
      });
    });

    describe('cuando no existe la carrera', () => {
      it('devuelve null', async () => {
        apiMock.get.mockResolvedValue({
          data: null,
        });

        const carrera = await getCarrera(25);
        expect(carrera).toBeNull();
      });
    });
  });

  describe('getCarreras', () => {
    beforeEach(() => {
      apiMock.get.mockResolvedValue({
        data: [
          {
            nombre: 'CURSO PREPARATORIO DE INGLES',
          },
          {
            nombre: 'Jornada de Kinesiología',
          },
          {
            nombre: 'Enfermería Universitaria',
          },
          {
            nombre: 'Curso de Preparacion universitaria',
          },
          {
            nombre: 'Especialización en Docencia Universitaria',
          },
        ],
      });
    });

    it('devuelve las carreras ordenadas por nombre', async () => {
      const carreras = await getCarreras();
      expect(carreras).toEqual([
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
          nombre: 'Jornada de Kinesiología',
        },
      ]);
    });

    it('no le vuelve a pegar a la API en llamados sucesivos', async () => {
      // Reseteamos las llamadas para que no afecten los otros tests.
      apiMock.get.mockClear();

      await getCarreras();
      await getCarreras();
      await getCarreras();

      // Depende cómo se ejecute el test, puede tener 0 o 1 llamado.
      // Sí, así de horrible es la forma de hacer un expect de "fue llamado a lo sumo". 🤷
      expect(apiMock.get.mock.calls.length).toBeLessThanOrEqual(1);
    });
  });
});
