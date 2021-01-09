import { DataTypes, Model } from 'sequelize';

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
    this.belongsTo(models.Edificio, { foreignKey: 'edificioId' });
    //this.hasMany(models.Actividad, { foreignKey: 'acticidadId' });
  }
}
