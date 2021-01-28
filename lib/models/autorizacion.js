import { DataTypes, Model } from 'sequelize';

export default class Autorizacion extends Model {
  static init(sequelize) {
    return super.init(
      {
        usuarioId: {
          allowNull: false,
          type: DataTypes.INTEGER,
          references: {
            model: 'Usuarios',
            key: 'id',
          },
        },
        actividadId: {
          allowNull: false,
          type: DataTypes.INTEGER,
          references: {
            model: 'Actividades',
            key: 'id',
          },
        },
        estuvoEnContacto: {
          allowNull: false,
          type: DataTypes.BOOLEAN,
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
