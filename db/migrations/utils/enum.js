module.exports = (queryInterface) => {
  const enumTypeFor = ({ table, column }) => `enum_${table}_${column}`;

  return {
    /**
     * Renames an enum value, updating the rows that use it.
     *
     * @param {Object} options
     * @param {string} options.table - Name of the table where the enum is used.
     * @param {string} options.column - Name of the column. It will be updated to use the new enum value.
     * @param {string} options.oldValue - Value that will be replaced.
     * @param {string} options.newValue - New name for the value.
     */
    async renameValue({ table, column, oldValue, newValue }) {
      const enumName = enumTypeFor({ table, column });
      await queryInterface.sequelize.query(`
      ALTER TYPE "${enumName}" RENAME VALUE '${oldValue}' TO '${newValue}';`);
    },

    /**
     * Alters an existing enum, replacing all the values with the provided here.
     * **Warning:** you must update existing values on the table _before_ running this, otherwise it will fail with `invalid input value for enum` error.
     *
     * @param {Object} options
     * @param {string} options.table - Name of the table where the enum is used.
     * @param {string} options.column - Name of the column. It will be updated to use the new enum.
     * @param {[string]} options.newValues - Values for the enum. The previous values will be lost, include them here if you want to preserve them.
     * @param {string=} options.defaultValue - Default value for the column.
     */
    async alterValues({ table, column, newValues, defaultValue }) {
      const enumName = enumTypeFor({ table, column });
      await queryInterface.sequelize.query(`
      ALTER TYPE "${enumName}" RENAME TO "${enumName}_old";
      CREATE TYPE "${enumName}" AS ENUM(${newValues
        .map((it) => `'${it}'`)
        .join(', ')});

      ALTER TABLE "${table}" ALTER COLUMN rol DROP DEFAULT;
      ALTER TABLE "${table}" ALTER COLUMN rol TYPE "${enumName}" USING rol::text::"${enumName}";

      DROP TYPE "${enumName}_old";`);

      if (defaultValue) {
        await queryInterface.sequelize.query(
          `ALTER TABLE "${table}" ALTER COLUMN rol SET DEFAULT '${defaultValue}';`
        );
      }
    },

    /**
     * Adds a new value to an existing enum type.
     * @param {Object} options
     * @param {string} options.table - Name of the table where the enum is used.
     * @param {string} options.column - Name of the column.
     */
    async addValue({ table, column, newValue }) {
      await queryInterface.sequelize.query(
        `ALTER TYPE "${enumTypeFor({
          table,
          column,
        })}" ADD VALUE '${newValue}';`
      );
    },
  };
};
