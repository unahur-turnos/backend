import Actividad from '../models/actividad';
import Edificio from '../models/edificio';
import Espacio from '../models/espacio';
import Turno from '../models/turno';
import Usuario from '../models/usuario';
import { cleanDb } from '../../test/db_utils';
import { getAuthorizedRequest } from '../../test/config_token';

describe('Turno controller', () => {
  let request;
  let actividades, usuario, turnos;

  beforeEach(async () => {
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

    actividades = await Actividad.bulkCreate(
      [
        {
          espacioId: espacios[0].id,
          nombre: 'Clase de laboratorio',
          fechaHoraInicio: new Date(),
          fechaHoraFin: new Date(),
          responsable: 'Mariela Tocino',
          telefonoDeContactoResponsable: '1145867933',
          activa: true,
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
          telefonoDeContactoResponsable: '1145867922',
          activa: true,
          requiereControl: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          restriccionId: 21,
        },
        {
          espacioId: espacios[1].id,
          nombre: 'Química',
          fechaHoraInicio: new Date(),
          fechaHoraFin: new Date(),
          responsable: 'Walter White',
          telefonoDeContactoResponsable: '11458679',
          activa: true,
          requiereControl: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          espacioId: espacios[0].id,
          nombre: 'Prácticas de enfermería',
          fechaHoraInicio: new Date(),
          fechaHoraFin: new Date(),
          responsable: 'Camila Perez',
          telefonoDeContactoResponsable: '11458679',
          activa: false,
          requiereControl: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true }
    );

    usuario = await Usuario.create({
      nombre: 'Usuario',
      apellido: 'Prueba',
      contrasenia: '1234',
      dni: 2,
      telefono: 1,
      email: 'usuario_2@gmail.com',
      rol: 'asistente',
    });

    turnos = await Turno.bulkCreate(
      [
        {
          usuarioId: usuario.id,
          actividadId: actividades[0].id,
          medioDeTransporte: 'Movilidad propia',
        },
        {
          usuarioId: usuario.id,
          actividadId: actividades[1].id,
          medioDeTransporte: 'Movilidad propia',
        },
      ],
      { returning: true }
    );
  });

  describe('/turnos', () => {
    it('devuelve código 200', async () => {
      const response = await request.get('/api/turnos');
      expect(response.statusCode).toBe(200);
    });

    it('devuelve la lista de turnos', async () => {
      const response = await request.get('/api/turnos');
      expect(response.body).toMatchObject({
        data: [
          {
            usuarioId: 2,
            medioDeTransporte: 'Movilidad propia',
          },
          {
            usuarioId: 2,
            medioDeTransporte: 'Movilidad propia',
          },
        ],
      });
    });

    it('crea un turno', async () => {
      const response = await request.post('/api/turnos').send({
        usuarioId: 2,
        actividadId: 3,
        medioDeTransporte: 'Movilidad propia',
      });
      expect(response.statusCode).toBe(201);

      const get = await request.get('/api/turnos/3');
      expect(get.body).toMatchObject({
        data: {
          usuarioId: 2,
          actividadId: 3,
          medioDeTransporte: 'Movilidad propia',
        },
      });
    });

    it('falla al crear un turno para una actividad restringida', async () => {
      const response = await request.post('/api/turnos').send({
        usuarioId: 1,
        actividadId: actividades[1].id,
        medioDeTransporte: 'Movilidad propia',
      });
      expect(response.statusCode).toBe(403);
      expect(response.body.error).toEqual(
        'El usuario no puede pedir turno para esta actividad'
      );
    });

    it('falla al solicitar más de un turno para la misma actividad', async () => {
      const response = await request.post('/api/turnos').send({
        usuarioId: 2,
        actividadId: 4,
        medioDeTransporte: 'Caminando',
      });
      expect(response.statusCode).toBe(201);

      const repeatedResponse = await request.post('/api/turnos').send({
        usuarioId: 2,
        actividadId: 4,
        medioDeTransporte: 'Caminando',
      });
      expect(repeatedResponse).toMatchObject({
        status: 422,
        body: {
          error: 'El usuario ya solicitó un turno para esta actividad',
        },
      });
    });
  });

  describe('/turnos/id', () => {
    describe('Cuando existe el turno', () => {
      it('devuelve código 200', async () => {
        const response = await request.get('/api/turnos/2');
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
          data: {
            usuarioId: 2,
            medioDeTransporte: 'Movilidad propia',
          },
        });
      });
    });

    describe('Cuando no existe el turno', () => {
      it('devuelve código 404', async () => {
        const response = await request.get('/api/turnos/10');
        expect(response.statusCode).toBe(404);
      });
    });

    describe('Actualizar y verificar cambio de los datos', () => {
      it('actualizar', async () => {
        const response = await request.put('/api/turnos/2').send({
          usuarioId: 2,
          actividadId: 2,
          medioDeTransporte: 'Movilidad propia',
        });

        expect(response.statusCode).toBe(200);

        const get = await request.get('/api/turnos/2');
        expect(get.body).toMatchObject({
          data: {
            usuarioId: 2,
            actividadId: 2,
            medioDeTransporte: 'Movilidad propia',
          },
        });
      });
    });
  });

  describe('DELETE /turnos/:id', () => {
    let otroUsuario, otroTurno;

    beforeEach(async () => {
      otroUsuario = await Usuario.create({
        nombre: 'Usuario',
        apellido: 'Prueba',
        contrasenia: '1234',
        dni: 288,
        telefono: 1,
        email: 'usuario_45@gmail.com',
        rol: 'asistente',
      });

      otroTurno = await Turno.create({
        usuarioId: otroUsuario.id,
        actividadId: actividades[0].id,
        medioDeTransporte: 'Movilidad propia',
      });
    });

    describe('cuando existe el turno', () => {
      it('usuario admin', async () => {
        const turno = turnos[0];
        const response = await request.del(`/api/turnos/${turno.id}`);
        expect(response.statusCode).toBe(204);

        expect(await Turno.findByPk(turno.id)).toBeNull();
      });

      describe('usuario asistente', () => {
        it('intentando borrar una propia', async () => {
          const response = await request.del(`/api/turnos/${turnos[1].id}`);
          expect(response.statusCode).toBe(204);
        });

        it('intentando borrar una de otra persona', async () => {
          const request = (await getAuthorizedRequest(usuario)).request;
          const response = await request.del(`/api/turnos/${otroTurno.id}`);
          expect(response.statusCode).toBe(403);
        });
      });
    });

    it('cuando no existe el turno', async () => {
      const response = await request.del('/api/turnos/7');
      expect(response.statusCode).toBe(404);
    });
  });

  describe('/turnos/:id/ingreso', () => {
    it('cuando existe el turno', async () => {
      const turno = turnos[1];

      const response = await request.post(`/api/turnos/${turno.id}/ingreso`);
      expect(response.statusCode).toBe(200);

      await turno.reload();
      expect(turno.fechaHoraIngreso).toBeInstanceOf(Date);
    });

    it('cuando no existe el turno', async () => {
      const response = await request.del('/api/turnos/15/ingreso');
      expect(response.statusCode).toBe(404);
    });
  });
});
