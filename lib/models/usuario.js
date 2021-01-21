import { DataTypes, Model } from 'sequelize';

import bcrypt from 'bcryptjs';

export default class Usuario extends Model {
  static init(sequelize) {
    return super.init(
      {
        nombre: DataTypes.STRING,
        apellido: DataTypes.STRING,
        contrasenia: DataTypes.STRING,
        dni: {
          type: DataTypes.NUMBER,
          unique: {
            msg: 'El DNI ya está en uso, por favor utilice otro',
          },
        },
        telefono: DataTypes.NUMBER,
        email: {
          type: DataTypes.STRING,
          unique: { msg: 'El email ya está en uso, por favor utilice otro.' },
          validate: {
            isEmail: { msg: 'El formato de email es incorrecto' },
          },
        },
        rol: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: 'Usuario',
        hooks: {
          beforeSave: (usuario) => {
            usuario.contrasenia = bcrypt.hashSync(
              usuario.contrasenia,
              bcrypt.genSaltSync()
            );
          },
        },
      }
    );
  }
  validarContrasenia(contraseniaAValidar) {
    return bcrypt.compareSync(contraseniaAValidar, this.contrasenia);
  }
}
