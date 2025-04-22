'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Propiedad extends Model {
    static associate(models) {
      // Relación con Arrendador
      Propiedad.belongsTo(models.Arrendador, { 
        foreignKey: 'arrendador_uid',  // Clave foránea
        as: 'arrendador',             // Alias para la relación
        onDelete: 'CASCADE'            // Eliminar propiedad si se elimina el arrendador
      });

      // Relación con CaracteristicaPropiedad
      Propiedad.hasMany(models.CaracteristicaPropiedad, {
        foreignKey: 'propiedad_id',
        as: 'caracteristicas',
        onDelete: 'CASCADE'            // Eliminar características si se elimina la propiedad
      });

      // Relación con Publicacion
      Propiedad.hasMany(models.Publicacion, {
        foreignKey: 'propiedad_id',
        as: 'publicaciones',
        onDelete: 'CASCADE'
      });

      // Relación con Reserva
      Propiedad.hasMany(models.Reserva, {
        foreignKey: 'propiedad_id',
        as: 'reservas',
        onDelete: 'CASCADE'
      });

      // Relación con Cita
      Propiedad.hasMany(models.Cita, {
        foreignKey: 'propiedad_id',
        as: 'citas',
        onDelete: 'CASCADE'
      });

      // Relación con PropiedadImagen
      Propiedad.hasMany(models.PropiedadImagen, {
        foreignKey: 'propiedad_id',
        as: 'imagenes',
        onDelete: 'CASCADE'
      });

      this.belongsToMany(models.Usuario, {
        through: 'Favoritos',
        foreignKey: 'propiedad_id',
        as: 'usuariosFavoritos',
        onDelete: 'CASCADE'
      });

      // Relación con Resena
      Propiedad.hasMany(models.Resena, {
        foreignKey: 'propiedad_id',
        as: 'resenas',
        onDelete: 'CASCADE'
      });

      // Relación 1:N con Ofertas
      Propiedad.hasMany(models.Oferta, {
        foreignKey: 'propiedad_id',
        as: 'ofertas',
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
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El título no puede estar vacío'
        },
        len: {
          args: [5, 100], // Longitud mínima y máxima
          msg: 'El título debe tener entre 5 y 100 caracteres'
        }
      }
    },
    descripcion: {
      type: DataTypes.TEXT,
      validate: {
        len: {
          args: [0, 1000], // Longitud máxima
          msg: 'La descripción no puede exceder los 1000 caracteres'
        }
      }
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La dirección no puede estar vacía'
        }
      }
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2), // 10 dígitos en total, 2 decimales
      allowNull: false,
      validate: {
        isDecimal: {
          msg: 'El precio debe ser un número decimal'
        },
        min: {
          args: [0],
          msg: 'El precio no puede ser negativo'
        }
      }
    },
    // Nuevos campos para almacenar la ubicación
    lat: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull: { msg: 'La latitud es requerida' },
        isFloat: { msg: 'La latitud debe ser un número' }
      }
    },
    lng: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull: { msg: 'La longitud es requerida' },
        isFloat: { msg: 'La longitud debe ser un número' }
      }
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
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
    timestamps: true, // Cambia esto a true
    createdAt: 'fecha_creacion', // Opcional: nombre personalizado
    updatedAt: 'fecha_actualizacion' // Opcional: nombre personalizado
  });

  return Propiedad;
};
