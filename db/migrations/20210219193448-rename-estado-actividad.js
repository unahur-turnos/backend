'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Actividades', 'estado', 'activa');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Actividades', 'activa', 'estado');
  },
};
