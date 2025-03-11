'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Reserva extends Model {
    static associate(models) {
      Reserva.belongsTo(models.Usuario, { 
        foreignKey: 'usuario_id', 
        onDelete: 'CASCADE',
        as: 'usuario'
      });
      
      Reserva.belongsTo(models.Propiedad, { 
        foreignKey: 'propiedad_id', 
        onDelete: 'CASCADE',
        as: 'propiedad'
      });
      
      Reserva.hasMany(models.Pago, { 
        foreignKey: 'reserva_id', 
        onDelete: 'CASCADE',
        as: 'pagos'
      });
    }
  }

  Reserva.init({
    reserva_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {  // 👈 Referencia añadida
        model: 'usuarios',
        key: 'usuario_id'
      }
    },
    propiedad_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {  // 👈 Referencia añadida
        model: 'propiedades',
        key: 'propiedad_id'
      }
    },
    fecha_inicio: {
      type: DataTypes.DATEONLY,  // 👈 Mejor tipo para fechas sin hora
      allowNull: false
    },
    fecha_fin: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "confirmada", "cancelada"),
      defaultValue: "pendiente"
    },
    monto_reserva: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01  // 👈 Mínimo valor permitido
      }
    },
    anticipo: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: "Reserva",
    tableName: "reservas",
    freezeTableName: true,
    timestamps: false
  });

  return Reserva;
};
