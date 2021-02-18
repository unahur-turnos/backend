'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Autorizaciones', 'fechaHoraIngreso', {
      type: Sequelize.DATE,
      default: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Autorizaciones', 'fechaHoraIngreso');
  },
};
