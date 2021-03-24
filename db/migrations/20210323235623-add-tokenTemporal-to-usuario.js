'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Usuarios', 'tokenTemporal', {
      type: Sequelize.STRING,
      default: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Usuarios', 'tokenTemporal');
  },
};
