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
        {
          nombre: 'Origone B',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: 'Malvinas Argentinas',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true }
    );

    await queryInterface.bulkInsert('Espacios', [
      {
        EdificioId: edificios[2].id,
        piso: 1,
        nombre: 'Laboratorio 14',
        habilitado: false,
        aforo: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        EdificioId: edificios[0].id,
        piso: 0,
        nombre: 'Aula 8',
        habilitado: true,
        aforo: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        EdificioId: edificios[1].id,
        piso: 0,
        nombre: 'Biblioteca',
        habilitado: true,
        aforo: 25,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Espacios', null, {});
    await queryInterface.bulkDelete('Edificios', null, {});
  },
};
