'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Actividades', 'dniResponsable');
    await queryInterface.removeColumn('Actividades', 'tipoResponsable');

    await queryInterface.addColumn(
      'Actividades',
      'telefonoDeContactoResponsable',
      {
        type: Sequelize.STRING,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'Actividades',
      'telefonoDeContactoResponsable'
    );
    await queryInterface.addColumn('Actividades', 'dniResponsable', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn('Actividades', 'tipoResponsable', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
