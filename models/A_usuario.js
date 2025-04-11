'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Usuario extends Model {
    static associate(models) {
      // Relaciones 1:1 (Aprendiz/Arrendador)
      Usuario.hasOne(models.Aprendiz, { 
        foreignKey: "usuario_uid", 
        onDelete: "CASCADE", 
        hooks: true  // Asegura eliminación en cascada a nivel de Sequelize
      });
      Usuario.hasOne(models.Arrendador, { 
        foreignKey: "usuario_uid", 
        onDelete: "CASCADE", 
        hooks: true 
      });
      
      // Relaciones 1:N (Propiedades, Reservas, Citas)
      Usuario.hasMany(models.Propiedad, { 
        foreignKey: "usuario_uid", 
        onDelete: "CASCADE" 
      });
      Usuario.hasMany(models.Reserva, { 
        foreignKey: "usuario_uid", 
        onDelete: "CASCADE" 
      });
      Usuario.hasMany(models.Cita, { 
        foreignKey: "usuario_uid", 
        onDelete: "CASCADE" 
      });
      this.belongsToMany(models.Propiedad, {
        through: 'Favoritos',
        foreignKey: 'usuario_uid',
        as: 'favoritos',
        onDelete: 'CASCADE'
      });
    }
  }

  Usuario.init({
    uid: {
      type: DataTypes.STRING(28), 
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    nombre: { 
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
    email: { 
      type: DataTypes.STRING(100), 
      allowNull: false, 
      unique: true,
      validate: {
        isEmail: true  // Valida formato de correo
      }
    },
    fotoPerfil: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true  // Valida que sea una URL válida
      }
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


