import { DataTypes, Model } from 'sequelize';

export default class Turno extends Model {
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
        completoCapacitacion: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        modelName: 'Turno',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Actividad, { foreignKey: 'actividadId' });
    this.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
  }
}
