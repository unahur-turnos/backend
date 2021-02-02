'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Actividades', 'dniResponsable', {
      allowNull: true,
      type: Sequelize.INTEGER,
    });
    await queryInterface.changeColumn('Actividades', 'responsable', {
      allowNull: true,
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Actividades', 'dniResponsable', {
      allowNull: false,
      type: Sequelize.INTEGER,
    });
    await queryInterface.changeColumn('Actividades', 'responsable', {
      allowNull: false,
      type: Sequelize.STRING,
    });
  },
};
