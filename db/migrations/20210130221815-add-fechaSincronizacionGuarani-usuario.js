'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Usuarios', 'fechaSincronizacionGuarani', {
      type: Sequelize.DATE,
      default: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Usuarios', 'fechaSincronizacionGuarani');
  },
};
