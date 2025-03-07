module.exports = (sequelize, DataTypes) => {
  const CaracteristicaPropiedad = sequelize.define("CaracteristicaPropiedad", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    propiedad_id: { type: DataTypes.INTEGER, allowNull: false },
    tipo_caracteristica: { type: DataTypes.STRING, allowNull: false },
    valor: { type: DataTypes.STRING, allowNull: false }
  }, {
    tableName: 'CaracteristicaPropiedades', // Asegurar que coincide con la migración
    timestamps: true
  });

  CaracteristicaPropiedad.associate = (models) => {
    CaracteristicaPropiedad.belongsTo(models.Propiedad, { 
      foreignKey: "propiedad_id", 
      onDelete: "CASCADE"
    });
  };

  return CaracteristicaPropiedad;
};
