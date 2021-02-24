'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.renameColumn('Actividades', 'estado', 'activa');
  },

  down: async (queryInterface) => {
    await queryInterface.renameColumn('Actividades', 'activa', 'estado');
  },
};
