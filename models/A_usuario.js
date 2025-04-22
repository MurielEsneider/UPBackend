
'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Usuario extends Model {
    static associate(models) {
      // Relaciones 1:1 (Aprendiz/Arrendador)
      Usuario.hasOne(models.Aprendiz, { 
        foreignKey: "usuario_uid", 
        onDelete: "CASCADE", 
        hooks: true  
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

      // Relación Muchos a Muchos (Favoritos)
      this.belongsToMany(models.Propiedad, {
        through: 'Favoritos',
        foreignKey: 'usuario_uid',
        as: 'favoritos',
        onDelete: 'CASCADE'
      });

      // Relación 1:N con Reseñas
      Usuario.hasMany(models.Resena, {
        foreignKey: 'usuario_uid',
        as: 'resenas',
        onDelete: 'CASCADE'
      });

      // Relación 1:N con Ofertas
      Usuario.hasMany(models.Oferta, {
        foreignKey: 'usuario_uid',
        as: 'ofertas',
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
      validate: { notEmpty: true } 
    },
    fecha_nacimiento: { 
      type: DataTypes.DATEONLY,
      validate: { isDate: true }
    },
    email: { 
      type: DataTypes.STRING(100), 
      allowNull: false, 
      unique: true,
      validate: { isEmail: true }
    },
    fotoPerfil: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isUrl: true }
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    freezeTableName: true,
    timestamps: false
  });

  return Usuario;
};
