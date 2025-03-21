const PropiedadImagen = require('../models/M_fotospropiedad'); // Asegúrate de importar el modelo

const saveUrlImages = async (req, res) => {
  const transaction = await db.transaction(); // Iniciar transacción
  
  try {
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

    // Crear registros usando el modelo y la transacción
    const imagenesCreadas = await PropiedadImagen.bulkCreate(
      imagenes.map(imagen => ({
        url: imagen.url,
        orden: imagen.orden,
        propiedad_id: propiedadId
      })),
      { transaction }
    );

    await transaction.commit(); // Confirmar transacción

    res.status(201).json({
      message: 'Imágenes guardadas correctamente',
      data: imagenesCreadas
    });

  } catch (error) {
    await transaction.rollback(); // Revertir transacción en caso de error
    
    console.error('Error al guardar imágenes:', error);
    res.status(500).json({ 
      error: 'Error al guardar las imágenes',
      detalle: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

module.exports = {
  saveUrlImages
};
