import { DataTypes, Model } from 'sequelize';
import { isEmpty, isNil, omit } from 'ramda';

import Turno from './turno';
import bcrypt from 'bcryptjs';

export default class Usuario extends Model {
  static init(sequelize) {
    return super.init(
      {
        nombre: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        apellido: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        contrasenia: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        dni: {
          allowNull: false,
          type: DataTypes.NUMBER,
          unique: {
            msg: 'El DNI ya está en uso, por favor utilice otro.',
          },
        },
        telefono: {
          allowNull: false,
          type: DataTypes.NUMBER,
        },
        email: {
          allowNull: false,
          type: DataTypes.STRING,
          unique: { msg: 'El email ya está en uso, por favor utilice otro.' },
          validate: {
            isEmail: { msg: 'El formato de email es incorrecto' },
          },
        },
        rol: {
          allowNull: false,
          type: DataTypes.ENUM('asistente', 'bedel', 'admin'),
          defaultValue: 'asistente',
        },
        fechaSincronizacionGuarani: {
          type: DataTypes.DATE,
          defaultValue: null,
        },
      },
      {
        sequelize,
        modelName: 'Usuario',
        hooks: {
          beforeCreate: (usuario) => {
            usuario.contrasenia = bcrypt.hashSync(
              usuario.contrasenia,
              bcrypt.genSaltSync()
            );
          },
        },
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Turno, { foreignKey: 'usuarioId' });
    this.hasMany(models.InscripcionCarrera, { foreignKey: 'usuarioId' });
  }

  validarContrasenia(contraseniaAValidar) {
    return bcrypt.compareSync(contraseniaAValidar, this.contrasenia);
  }

  toJSON() {
    return omit(['contrasenia'], super.toJSON());
  }

  async puedePedirTurnoPara(actividad) {
    return (
      actividad.esPublica() ||
      (await this.estaInscriptoA(actividad.restriccionId))
    );
  }

  async estaInscriptoA(carreraId) {
    const inscripciones = await this.getInscripcionCarreras({
      where: { idCarrera: carreraId },
    });

    return !isEmpty(inscripciones);
  }

  async solicitoTurnoPara(actividad) {
    const turno = await Turno.findOne({
      where: {
        usuarioId: this.id,
        actividadId: actividad.id,
      },
    });
    return !isNil(turno);
  }

  puedeBorrar(turno) {
    return this.esAdmin() || turno.usuarioId == this.id;
  }

  esAdmin() {
    return this.rol == 'admin';
  }
}
