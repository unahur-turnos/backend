'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Actividades', 'restriccionId', {
      allowNull: true,
      type: Sequelize.INTEGER,
    });
  },
};
