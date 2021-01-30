'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Usuarios', 'rol');
    await queryInterface.addColumn('Usuarios', 'rol', {
      allowNull: false,
      type: Sequelize.ENUM('asistente', 'bedel', 'admin'),
      default: 'asistente',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Usuarios', 'rol');
  },
};
