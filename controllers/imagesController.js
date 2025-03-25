const { PropiedadImagen } = require('../models');
const { sequelize } = require('../models');

const saveUrlImages = async (req, res) => {
  let transaction;
  try {
    // Intentar obtener una transacción si está disponible
    if (PropiedadImagen.sequelize) {
      transaction = await PropiedadImagen.sequelize.transaction();
    } else {
      console.warn('Advertencia: No se pudo iniciar la transacción ya que PropiedadImagen.sequelize no está definido.');
    }

    const { propiedadId, imagenes } = req.body;

    // Validación de datos
    if (!propiedadId || !imagenes || !Array.isArray(imagenes) || imagenes.length === 0) {
      return res.status(400).json({
        error: 'Datos inválidos: Se requieren propiedadId y un array de imágenes'
      });
    }

    // Validar la estructura de cada imagen: debe tener url, path y un orden numérico
    for (const imagen of imagenes) {
      if (!imagen.url || !imagen.path || typeof imagen.orden !== 'number') {
        return res.status(400).json({
          error: 'Formato de imagen inválido: Cada imagen debe tener url, path y orden numérico'
        });
      }
    }

    // Crear registros en la tabla 'propiedad_imagenes'
    const imagenesCreadas = await PropiedadImagen.bulkCreate(
      imagenes.map(imagen => ({
        url: imagen.url,
        path: imagen.path, // Guardamos el path interno
        orden: imagen.orden,
        propiedad_id: propiedadId
      })),
      { transaction }
    );

    if (transaction) {
      await transaction.commit();
    }

    res.status(201).json({
      message: 'Imágenes guardadas correctamente',
      data: imagenesCreadas
    });

  } catch (error) {
    if (transaction) {
      await transaction.rollback();
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
      order: [['orden', 'ASC']]
    });

    if (!imagenes || imagenes.length === 0) {
      return res.status(404).json({
        message: `No se encontraron imágenes para la propiedad con ID: ${propiedadId}`
      });
    }

    // Puedes retornar tanto el download URL como el path si lo necesitas
    const imagesData = imagenes.map(imagen => ({
      url: imagen.url,
      path: imagen.path,
      orden: imagen.orden
    }));

    res.status(200).json({
      message: `Imágenes encontradas para la propiedad con ID: ${propiedadId}`,
      data: imagesData
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
