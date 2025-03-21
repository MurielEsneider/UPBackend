const { CaracteristicaPropiedad, Propiedad } = require('../models'); // Importa los modelos
const sequelize = require('../models').sequelize; // Importa sequelize desde los modelos

// Controller para crear las características de una propiedad
const createCaracteristica = async (req, res) => {
  console.log("Iniciando creación de características...");

  const transaction = await sequelize.transaction(); // Iniciar una transacción
  console.log("Transacción iniciada.");

  try {
    const {
      propiedad_id,
      tipo_vivienda,
      wifi,
      energia,
      tv,
      cocina,
      agua,
      garaje,
      lavadora,
      nevera,
      gas,
      habitaciones,
      baños,
      capacidad,
      estacionamientos,
      jardin,
      piscina,
      vista_montaña,
      terraza,
      amoblado,
      acepta_mascotas
    } = req.body;

    console.log("Datos recibidos en la solicitud:", {
      propiedad_id,
      tipo_vivienda,
      wifi,
      energia,
      tv,
      cocina,
      agua,
      garaje,
      lavadora,
      nevera,
      gas,
      habitaciones,
      baños,
      capacidad,
      estacionamientos,
      jardin,
      piscina,
      vista_montaña,
      terraza,
      amoblado,
      acepta_mascotas
    });

    // Validar que la propiedad exista
    console.log("Validando existencia de la propiedad...");
    const propiedad = await Propiedad.findByPk(propiedad_id, { transaction });
    if (!propiedad) {
      console.error("Propiedad no encontrada.");
      await transaction.rollback(); // Deshacer la transacción
      return res.status(404).json({ error: "La propiedad especificada no existe" });
    }
    console.log("Propiedad encontrada:", propiedad);

    // Crear las características
    console.log("Creando características en la base de datos...");
    const newCaracteristica = await CaracteristicaPropiedad.create({
      propiedad_id,
      tipo_vivienda,
      wifi: wifi || false,
      energia: energia || false,
      tv: tv || false,
      cocina: cocina || false,
      agua: agua || false,
      garaje: garaje || false,
      lavadora: lavadora || false,
      nevera: nevera || false,
      gas: gas || false,
      habitaciones: habitaciones || 1,
      baños: baños || 1,
      capacidad: capacidad || 1,
      estacionamientos: estacionamientos || 0,
      jardin: jardin || false,
      piscina: piscina || false,
      vista_montaña: vista_montaña || false,
      terraza: terraza || false,
      amoblado: amoblado || false,
      acepta_mascotas: acepta_mascotas || false
    }, { transaction });

    console.log("Características creadas exitosamente:", newCaracteristica);

    await transaction.commit(); // Confirmar la transacción
    console.log("Transacción confirmada.");

    return res.status(201).json(newCaracteristica);

  } catch (error) {
    console.error("Error al crear características:", error);

    await transaction.rollback(); // Deshacer la transacción en caso de error
    console.log("Transacción revertida.");

    // Manejo de errores específicos
    if (error.name === 'SequelizeValidationError') {
      console.error("Error de validación de Sequelize:", error.errors);
      return res.status(400).json({ error: "Datos de entrada no válidos", details: error.errors });
    }

    if (error.name === 'SequelizeForeignKeyConstraintError') {
      console.error("Error de restricción de clave foránea:", error);
      return res.status(400).json({ error: "Error de integridad referencial", details: error });
    }

    console.error("Error interno del servidor:", error);
    return res.status(500).json({ error: "Error al guardar las características de la propiedad" });
  }
};

module.exports = {
  createCaracteristica
};