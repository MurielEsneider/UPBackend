'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Cita extends Model {
    static associate(models) {
      Cita.belongsTo(models.Usuario, { 
        foreignKey: 'usuario_id', 
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
    cita_id: {  // 👈 Nombre consistente para PK
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
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
    fecha: {
      type: DataTypes.DATEONLY,  // 👈 Solo fecha sin hora
      allowNull: false,
      validate: {
        isDate: true,
        isAfter: new Date().toISOString().split('T')[0]  // No fechas pasadas
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
    },
    reglas_departamento: {
      type: DataTypes.TEXT,
      validate: {
        len: [0, 500]  // Máximo 500 caracteres
      }
    },
    oferta: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        min: 0  // No valores negativos
      }
    },
    contra_oferta: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        min: 0,
        customValidator(value) {
          if (value !== null && this.oferta === null) {
            throw new Error('Debe existir una oferta previa para contraoferta');
          }
        }
      }
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

