import { Model, DataTypes } from 'sequelize';

export default class Espacio extends Model {
  static init(sequelize) {
    return super.init(
      {
        piso: DataTypes.INTEGER,
        nombre: DataTypes.STRING,
        habilitado: DataTypes.BOOLEAN,
        aforo: DataTypes.INTEGER,
      },
      {
        sequelize,
        modelName: 'Espacio',
      }
    );
  }

  static associate(models) {
    this.myAssociation = this.belongsTo(models.Edificio, {
      as: 'edificio',
      foreignKey: 'edificioFk',
    });
  }
}
