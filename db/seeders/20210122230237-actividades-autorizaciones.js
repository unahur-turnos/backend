'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const edificios = await queryInterface.bulkInsert(
      'Edificios',
      [
        {
          nombre: 'Origone A',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true }
    );

    const espacios = await queryInterface.bulkInsert(
      'Espacios',
      [
        {
          edificioId: edificios[0].id,
          piso: 1,
          nombre: 'Laboratorio 14',
          habilitado: false,
          aforo: 15,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true }
    );

    const actividades = await queryInterface.bulkInsert(
      'Actividades',
      [
        {
          espacioId: espacios[0].id,
          nombre: 'Clase de Química',
          fechaHoraInicio: new Date(),
          fechaHoraFin: new Date(),
          responsable: 'Walter White',
          dniResponsable: 12345678,
          tipoResponsable: 'Docente',
          estado: true,
          requiereControl: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          espacioId: espacios[0].id,
          nombre: 'Clase de Biología',
          fechaHoraInicio: new Date(),
          fechaHoraFin: new Date(),
          responsable: 'Carla Perez',
          dniResponsable: 11111111,
          tipoResponsable: 'Invitado',
          estado: true,
          requiereControl: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          espacioId: espacios[0].id,
          nombre: 'Prácticas de Enfermería',
          fechaHoraInicio: new Date(),
          fechaHoraFin: new Date(),
          responsable: 'María Gonzalez',
          dniResponsable: 12345678,
          tipoResponsable: 'Docente',
          estado: true,
          requiereControl: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true }
    );

    const usuarios = await queryInterface.bulkInsert(
      'Usuarios',
      [
        {
          nombre: 'Usuario',
          apellido: 'Prueba',
          contrasenia: '1234',
          dni: 1,
          telefono: 1,
          email: 'usuario@gmail.com',
          rol: 'invitado',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true }
    );

    await queryInterface.bulkInsert('Autorizaciones', [
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
        actividadId: actividades[1].id,
        estuvoEnContacto: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Edificios', null, {});
    await queryInterface.bulkDelete('Espacios', null, {});
    await queryInterface.bulkDelete('Usuarios', null, {});
    await queryInterface.bulkDelete('Actividades', null, {});
    await queryInterface.bulkDelete('Autorizaciones', null, {});
  },
};
