import { DataTypes, Model } from 'sequelize';

export default class Actividad extends Model {
  static init(sequelize) {
    return super.init(
      {
        nombre: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        fechaHoraInicio: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        fechaHoraFin: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        responsable: {
          type: DataTypes.STRING,
        },
        dniResponsable: {
          type: DataTypes.INTEGER,
        },
        tipoResponsable: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        estado: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        requiereControl: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
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
    this.hasMany(models.Autorizacion, { foreignKey: 'actividadId' });
  }
}
