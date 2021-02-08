import { DataTypes, Model } from 'sequelize';

export default class InscripcionCarrera extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        usuarioId: {
          allowNull: false,
          type: DataTypes.INTEGER,
        },
        idCarrera: {
          allowNull: false,
          type: DataTypes.INTEGER,
        },
        nombreCarrera: {
          allowNull: false,
          type: DataTypes.STRING,
        },
      },
      {
        sequelize,
        modelName: 'InscripcionCarrera',
        tableName: 'InscripcionCarreras',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
  }
}
