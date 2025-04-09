'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Cita extends Model {
    static associate(models) {
      Cita.belongsTo(models.Usuario, { 
        foreignKey: 'usuario_uid', 
        as: 'usuario',
        onDelete: 'CASCADE' 
      });
      Cita.belongsTo(models.Propiedad, { 
        foreignKey: 'propiedad_id', 
        as: 'propiedad',
        onDelete: 'CASCADE' 
      });
    }
  }

  Cita.init({
    cita_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    usuario_uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'uid'
      }
    },
    propiedad_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'propiedades',
        key: 'id'
      }
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        isAfter: new Date().toISOString().split('T')[0]
      }
    },
    hora: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'confirmada', 'cancelada'),
      defaultValue: 'pendiente'
    }
  }, {
    sequelize,
    modelName: 'Cita',
    tableName: 'citas',
    freezeTableName: true,
    timestamps: true
  });

  return Cita;
};
