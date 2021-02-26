'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      'Turnos',
      'completoCapacitaction',
      'completoCapacitacion'
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      'Turnos',
      'completoCapacitacion',
      'completoCapacitaction'
    );
  },
};
