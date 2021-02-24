import { DataTypes, Model } from 'sequelize';

export default class Autorizacion extends Model {
  static init(sequelize) {
    return super.init(
      {
        medioDeTransporte: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        fechaHoraIngreso: {
          type: DataTypes.DATE,
          defaultValue: null,
        },
        completoCapacitaction: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        modelName: 'Autorizacion',
        tableName: 'Autorizaciones',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Actividad, { foreignKey: 'actividadId' });
    this.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
  }
}
