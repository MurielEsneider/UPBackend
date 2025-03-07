module.exports = (sequelize, DataTypes) => {
  const Cita = sequelize.define('Cita', {
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuarios', // Asegúrate de que el nombre coincide con el modelo de la tabla usuarios
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    propiedad_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Propiedades', // Asegúrate de que el nombre coincide con el modelo de la tabla propiedades
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    hora: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'confirmada', 'cancelada'),
      defaultValue: 'pendiente',
    },
    reglas_departamento: {
      type: DataTypes.TEXT,
    },
    oferta: {
      type: DataTypes.DECIMAL(10, 2),
    },
    contra_oferta: {
      type: DataTypes.DECIMAL(10, 2),
    },
  }, {});

  Cita.associate = function(models) {
    Cita.belongsTo(models.Usuario, { foreignKey: 'usuario_id', onDelete: 'CASCADE' });
    Cita.belongsTo(models.Propiedad, { foreignKey: 'propiedad_id', onDelete: 'CASCADE' });
  };

  return Cita;
};
