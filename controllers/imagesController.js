const { PropiedadImagen } = require('../models');

const saveUrlImages = async (req, res) => {
  // Si estás usando Sequelize y tu instancia de Sequelize está accesible
  // puedes obtener la transacción desde allí.
  // Ejemplo (asumiendo que tienes una instancia de Sequelize llamada 'sequelize'):
  // const transaction = await sequelize.transaction();
  let transaction;
  try {
    // Intenta obtener la transacción si 'db' fuera tu instancia de Sequelize
    // Comenta o elimina esta línea si no tienes acceso a 'db'
    // transaction = await db.transaction();

    // Si no tienes 'db' definido, puedes crear una transacción directamente
    // si tu modelo 'PropiedadImagen' está asociado a una instancia de Sequelize
    if (PropiedadImagen.sequelize) {
      transaction = await PropiedadImagen.sequelize.transaction();
    } else {
      // Si no hay una instancia de Sequelize asociada, no podemos usar transacciones
      console.warn('Advertencia: No se pudo iniciar la transacción ya que PropiedadImagen.sequelize no está definido.');
    }

    const { propiedadId, imagenes } = req.body;

    // Validación mejorada
    if (!propiedadId || !imagenes || !Array.isArray(imagenes) || imagenes.length === 0) {
      return res.status(400).json({
        error: 'Datos inválidos: Se requieren propiedadId y un array de imágenes'
      });
    }

    // Validar estructura de cada imagen
    for (const imagen of imagenes) {
      if (!imagen.url || typeof imagen.orden !== 'number') {
        return res.status(400).json({
          error: 'Formato de imagen inválido: Cada imagen debe tener url y orden numérico'
        });
      }
    }

    // Crear registros usando el modelo
    const imagenesCreadas = await PropiedadImagen.bulkCreate(
      imagenes.map(imagen => ({
        url: imagen.url,
        orden: imagen.orden,
        propiedad_id: propiedadId
      })),
      { transaction } // Pasar la transacción si se creó
    );

    if (transaction) {
      await transaction.commit(); // Confirmar transacción si se inició
    }

    res.status(201).json({
      message: 'Imágenes guardadas correctamente',
      data: imagenesCreadas
    });

  } catch (error) {
    if (transaction) {
      await transaction.rollback(); // Revertir transacción en caso de error si se inició
    }

    console.error('Error al guardar imágenes:', error);
    res.status(500).json({
      error: 'Error al guardar las imágenes',
      detalle: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

const getUrlImagesByPropiedadId = async (req, res) => {
    const { propiedadId } = req.params;
  
    if (!propiedadId) {
      return res.status(400).json({
        error: 'Se requiere el ID de la propiedad como parámetro.'
      });
    }
  
    try {
      const imagenes = await PropiedadImagen.findAll({
        where: {
          propiedad_id: propiedadId
        },
        order: [['orden', 'ASC']] // Opcional: ordenar por el campo 'orden'
      });
  
      if (!imagenes || imagenes.length === 0) {
        return res.status(404).json({
          message: `No se encontraron imágenes para la propiedad con ID: ${propiedadId}`
        });
      }
  
      const urls = imagenes.map(imagen => imagen.url);
  
      res.status(200).json({
        message: `Imágenes encontradas para la propiedad con ID: ${propiedadId}`,
        data: urls
      });
  
    } catch (error) {
      console.error('Error al obtener las imágenes:', error);
      res.status(500).json({
        error: 'Error al obtener las imágenes',
        detalle: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  };
  

module.exports = {
  saveUrlImages,
  getUrlImagesByPropiedadId
};