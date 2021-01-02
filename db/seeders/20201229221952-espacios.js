'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Espacios', [
      {
        EdificioId: 3,
        piso: 1,
        nombre: 'Laboratorio 14',
        habilitado: false,
        aforo: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        EdificioId: 1,
        piso: 0,
        nombre: 'Aula 8',
        habilitado: true,
        aforo: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        EdificioId: 2,
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
  },
};
