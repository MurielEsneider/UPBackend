'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Usuario extends Model {
    static associate(models) {
      // Relaciones 1:1 (Aprendiz/Arrendador)
      Usuario.hasOne(models.Aprendiz, { 
        foreignKey: "usuario_id", 
        onDelete: "CASCADE", 
        hooks: true  // Asegura eliminación en cascada a nivel de Sequelize
      });
      Usuario.hasOne(models.Arrendador, { 
        foreignKey: "usuario_id", 
        onDelete: "CASCADE", 
        hooks: true 
      });
      
      // Relaciones 1:N (Propiedades, Reservas, Citas)
      Usuario.hasMany(models.Propiedad, { 
        foreignKey: "usuario_id", 
        onDelete: "CASCADE" 
      });
      Usuario.hasMany(models.Reserva, { 
        foreignKey: "usuario_id", 
        onDelete: "CASCADE" 
      });
      Usuario.hasMany(models.Cita, { 
        foreignKey: "usuario_id", 
        onDelete: "CASCADE" 
      });
    }
  }

  Usuario.init({
    usuario_id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    nombres_apellidos: { 
      type: DataTypes.STRING, 
      allowNull: false,
      validate: {
        notEmpty: true  // Validación adicional
      } 
    },
    fecha_nacimiento: { 
      type: DataTypes.DATEONLY,  // 👈 Mejor usar DATEONLY para fechas sin hora
      validate: {
        isDate: true
      }
    },
    numero_telefono: { 
      type: DataTypes.STRING(15), 
      allowNull: false,
      validate: {
        len: [7, 15]  // Longitud mínima y máxima
      } 
    },
    correo_electronico: { 
      type: DataTypes.STRING(100), 
      allowNull: false, 
      unique: true,
      validate: {
        isEmail: true  // Valida formato de correo
      }
    },
    rol: { 
      type: DataTypes.ENUM("administrador", "arrendador", "aprendiz"), 
      allowNull: false,
      defaultValue: "aprendiz"  // Valor por defecto
    },
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    freezeTableName: true,
    timestamps: false
  });

  return Usuario;
};


