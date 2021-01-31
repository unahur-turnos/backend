'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Usuarios', 'fechaSincronizacionGuarani', {
      type: Sequelize.DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'Usuaruios',
      'fechaSincronizacionGuarani'
    );
  },
};
