'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Autorizaciones', 'completoCapacitaction', {
      type: Sequelize.BOOLEAN,
      default: false,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Autorizaciones', 'completoCapacitaction');
  },
};
