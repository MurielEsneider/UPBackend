'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Propiedad extends Model {
    static associate(models) {
      Propiedad.belongsTo(models.Arrendador, { 
        foreignKey: 'arrendador_uid',  // 👈 Nombre más descriptivo
        as: 'arrendador',
        onDelete: 'CASCADE'
      });

      Propiedad.hasMany(models.CaracteristicaPropiedad, {
        foreignKey: 'propiedad_id',
        as: 'caracteristicas',
        onDelete: 'CASCADE'
      });

      Propiedad.hasMany(models.Publicacion, {
        foreignKey: 'propiedad_id',
        as: 'publicaciones',
        onDelete: 'CASCADE'
      });

      Propiedad.hasMany(models.Reserva, {
        foreignKey: 'propiedad_id',
        as: 'reservas',
        onDelete: 'CASCADE'
      });

      Propiedad.hasMany(models.Cita, {
        foreignKey: 'propiedad_id',
        as: 'citas',
        onDelete: 'CASCADE'
      });
      
      Propiedad.hasMany(models.PropiedadImagen, {
        foreignKey: 'propiedad_id',
        as: 'imagenes',
        onDelete: 'CASCADE'
      });
    }
  }

  Propiedad.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: DataTypes.TEXT,
    direccion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    precio: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    // Cambiamos el tipo a STRING para almacenar el UID de Firebase del propietario
    arrendador_uid: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'arrendadores', // Nombre de la tabla en la base de datos
        key: 'uid'            // Columna a la que se hace referencia (UID de Firebase)
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'Propiedad',
    tableName: 'propiedades',
    freezeTableName: true,
    timestamps: false
  });

  return Propiedad;
};


