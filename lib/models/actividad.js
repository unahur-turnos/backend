import { DataTypes, Model } from 'sequelize';

export default class Actividad extends Model {
  static init(sequelize) {
    return super.init(
      {
        nombre: DataTypes.STRING,
        fechaHoraInicio: DataTypes.DATE,
        fechaHoraFin: DataTypes.DATE,
        responsable: DataTypes.STRING,
        dniResponsable: DataTypes.INTEGER,
        tipoResponsable: DataTypes.STRING,
        estado: DataTypes.BOOLEAN,
        requiereControl: DataTypes.BOOLEAN,
      },
      {
        sequelize,
        modelName: 'Actividad',
        tableName: 'Actividades',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Espacio, { foreignKey: 'espacioId' });
  }
}
