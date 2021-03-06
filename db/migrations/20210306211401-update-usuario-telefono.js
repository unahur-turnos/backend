'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Usuarios', 'telefono', {
      allowNull: false,
      type: Sequelize.BIGINT,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Usuarios', 'telefono', {
      allowNull: false,
      type: Sequelize.INTEGER,
    });
  },
};
