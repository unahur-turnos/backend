'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('Autorizaciones', 'Turnos');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('Turnos', 'Autorizaciones');
  },
};
