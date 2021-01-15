import { DataTypes, Model } from 'sequelize';

export default class Usuario extends Model {
  static init(sequelize) {
    return super.init(
      {
        nombre: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        apellido: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        contrasenia: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        dni: {
          type: DataTypes.NUMBER,
          unique: true,
          allowNull: false,
        },
        telofono: {
          type: DataTypes.NUMBER,
          unique: true,
        },
        email: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Usuario',
      }
    );
  }
}
