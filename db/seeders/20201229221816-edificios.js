'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Edificios', [
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
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Edificios', null, {});
  },
};
