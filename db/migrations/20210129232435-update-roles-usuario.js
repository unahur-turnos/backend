'use strict';

const enumUtils = require('./utils/enum');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { renameValue, alterValues } = enumUtils(queryInterface);

    await renameValue({
      table: 'Usuarios',
      column: 'rol',
      oldValue: 'invitado',
      newValue: 'asistente',
    });
    await alterValues({
      table: 'Usuarios',
      column: 'rol',
      newValues: ['asistente', 'bedel', 'admin'],
      defaultValue: 'asistente',
    });
  },

  down: async (queryInterface, Sequelize) => {
    const { renameValue, alterValues } = enumUtils(queryInterface);

    await renameValue({
      table: 'Usuarios',
      column: 'rol',
      oldValue: 'asistente',
      newValue: 'invitado',
    });
    await alterValues({
      table: 'Usuarios',
      column: 'rol',
      newValues: ['invitado', 'estudiante', 'bedel', 'admin'],
      defaultValue: 'invitado',
    });
  },
};
