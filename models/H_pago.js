'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Pago extends Model {
    static associate(models) {
      Pago.belongsTo(models.Reserva, {
        foreignKey: 'reserva_id',
        as: 'reserva',
        onDelete: 'CASCADE'
      });
    }
  }

  Pago.init({
    pago_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    reserva_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'reservas',
        key: 'reserva_id'
      }
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01
      }
    },
    fecha_pago: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    metodo_pago: {
      type: DataTypes.ENUM('tarjeta_credito', 'transferencia_bancaria', 'efectivo'),
      allowNull: false
    },
    estado_pago: {
      type: DataTypes.ENUM('pendiente', 'completado', 'rechazado'),
      defaultValue: 'pendiente',
      allowNull: false
    },
    referencia_transaccion: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    comprobante_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: true
      }
    }
  }, {
    sequelize,
    modelName: 'Pago',
    tableName: 'pagos',
    timestamps: true // Coincide con los campos createdAt y updatedAt de la migración
  });

  return Pago;
};