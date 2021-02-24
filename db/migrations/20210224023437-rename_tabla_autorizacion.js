'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.renameTable('Autorizaciones', 'Turnos');
  },

  down: async (queryInterface) => {
    await queryInterface.renameTable('Turnos', 'Autorizaciones');
  },
};
