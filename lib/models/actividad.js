import { DataTypes, Model } from 'sequelize';

import Autorizacion from './autorizacion';

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
        },
        requiereControl: {
          type: DataTypes.BOOLEAN,
        },
        cuposDisponibles: {
          type: new DataTypes.VIRTUAL(DataTypes.INTEGER),
          get: async function () {
            const cuposDisponibles =
              this.getAforoEspacio() - (await this.getCantidadAutorizaciones());
            return cuposDisponibles;
          },
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

  getCantidadAutorizaciones() {
    const cantidad = Autorizacion.count({
      where: { actividadId: this.getDataValue('id') },
    });
    return cantidad;
  }

  getAforoEspacio() {
    const { aforo } = this.getDataValue('Espacio');
    return aforo;
  }
}
