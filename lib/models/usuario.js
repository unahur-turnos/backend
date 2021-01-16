import { DataTypes, Model } from 'sequelize';

export default class Usuario extends Model {
  static init(sequelize) {
    return super.init(
      {
        nombre: DataTypes.STRING,
        apellido: DataTypes.STRING,
        contrasenia: DataTypes.STRING,
        dni: DataTypes.NUMBER,
        telefono: DataTypes.NUMBER,
        email: DataTypes.STRING,
        rol: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: 'Usuario',
      }
    );
  }
}
