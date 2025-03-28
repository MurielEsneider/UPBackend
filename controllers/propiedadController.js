// controllers/propiedadController.js
const { Propiedad, PropiedadImagen, CaracteristicaPropiedad } = require('../models');
const { sequelize } = require('../models');
const { admin, bucket } = require('../config/firebaseAdmin'); // Importa admin y bucket para Firebase Storage

const crearPropiedad = async (req, res) => {
  console.log("Iniciando creación de propiedad...");

  try {
    // Extraer lat y lng además de los demás campos
    const { titulo, descripcion, direccion, precio, arrendador_uid, lat, lng, imagenes } = req.body;

    console.log("Datos recibidos en la solicitud:", {
      titulo,
      descripcion,
      direccion,
      precio,
      arrendador_uid,
      lat,
      lng,
      imagenes
    });

    // Validar que los datos requeridos estén presentes
    if (!titulo || !direccion || !precio || !arrendador_uid || lat == null || lng == null) {
      console.error("Faltan datos requeridos en la solicitud.");
      return res.status(400).json({ 
        error: "Faltan datos requeridos. Se requieren título, dirección, precio, arrendador_uid, lat y lng." 
      });
    }

    console.log("Creando propiedad en la base de datos...");
    const nuevaPropiedad = await Propiedad.create({
      titulo,
      descripcion,
      direccion,
      precio,
      arrendador_uid,
      lat, // Se envía la latitud
      lng  // Se envía la longitud
    });

    // Si se envía un array de imágenes, creamos los registros asociados
    if (imagenes && Array.isArray(imagenes)) {
      for (const img of imagenes) {
        // Extraer path desde la URL automáticamente
        const urlObj = new URL(img.url);
        let path = decodeURIComponent(urlObj.pathname)
                    .replace(/^\//, '') // Quitar slash inicial
                    .replace(/%20/g, ' '); // Decodificar espacios
    
        await PropiedadImagen.create({
          url: img.url,
          path: path, // Guardar path exacto
          orden: img.orden,
          propiedad_id: nuevaPropiedad.id
        });
      }
    }

    console.log("Propiedad creada exitosamente:", nuevaPropiedad);
    return res.status(201).json(nuevaPropiedad);

  } catch (error) {
    console.error("Error al crear propiedad:", error);

    if (error.name === 'SequelizeValidationError') {
      console.error("Error de validación de Sequelize:", error.errors);
      return res.status(400).json({ error: "Datos de entrada no válidos", details: error.errors });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      console.error("Error de restricción única:", error.errors);
      return res.status(400).json({ error: "El registro ya existe", details: error.errors });
    }

    console.error("Error interno del servidor:", error);
    return res.status(500).json({ error: "Error al crear la propiedad" });
  }
};

const getPropiedadesByArrendador = async (req, res) => {
  try {
    const { arrendador_uid } = req.params; // Obtener el UID del arrendador desde los parámetros de la URL

    console.log(`Buscando propiedades para arrendador: ${arrendador_uid}`);
    const propiedades = await Propiedad.findAll({
      where: { arrendador_uid },
      attributes: ['id', 'titulo', 'direccion'] // Mostrar solo campos relevantes
    });

    if (propiedades.length === 0) {
      // Simplemente retorna un arreglo vacío con status 200
      return res.status(200).json([]);
    }

    console.log("Propiedades encontradas:", propiedades);
    return res.status(200).json(propiedades);

  } catch (error) {
    console.error("Error al obtener propiedades:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getPublicacion = async (req, res) => {
  try {
    const { id } = req.params;

    // Validación mejorada del ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: "ID inválido",
        message: "El ID debe ser un número válido"
      });
    }

    const propiedad = await Propiedad.findByPk(id, {
      include: [
        {
          model: PropiedadImagen,
          as: 'imagenes',
          attributes: ['id', 'url', 'path', 'orden']
        },
        {
          model: CaracteristicaPropiedad,
          as: 'caracteristicas',
          attributes: { exclude: ['createdAt', 'updatedAt', 'propiedad_id'] }
        }
      ],
      order: [[{ model: PropiedadImagen, as: 'imagenes' }, 'orden', 'ASC']],
      attributes: { exclude: ['createdAt', 'updatedAt', 'usuario_id'] }
    });

    if (!propiedad) {
      return res.status(404).json({
        error: "Propiedad no encontrada",
        details: `No existe una propiedad con el ID: ${id}`
      });
    }

    // Transformación de datos
    const response = {
      ...propiedad.toJSON(),
      precio: Number(propiedad.precio)
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error("Error al obtener la publicación:", error);

    const errorResponse = {
      error: "Error interno del servidor",
      details: process.env.NODE_ENV === 'development' ? error.message : null
    };

    return res.status(500).json(errorResponse);
  }
};

const eliminarPropiedad = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { arrendador_uid } = req.body;

    // 1. Validación robusta del ID
    if (!id || isNaN(id)) {
      await transaction.rollback();
      return res.status(400).json({ 
        error: "ID inválido",
        details: "El ID de propiedad debe ser un número válido" 
      });
    }

    // 2. Buscar propiedad con sus imágenes
    const propiedad = await Propiedad.findByPk(id, {
      include: [{
        model: PropiedadImagen,
        as: 'imagenes',
        attributes: ['id', 'path']
      }],
      transaction
    });

    if (!propiedad) {
      await transaction.rollback();
      return res.status(404).json({ 
        error: "Propiedad no encontrada",
        details: `No existe una propiedad con ID: ${id}` 
      });
    }

    // 3. Verificación de permisos
    if (propiedad.arrendador_uid !== arrendador_uid) {
      await transaction.rollback();
      return res.status(403).json({
        error: "No autorizado",
        details: "Solo el propietario puede eliminar la propiedad"
      });
    }

    // 4. Configuración de Firebase: usamos el bucket importado
    // (No se vuelve a inicializar; ya está disponible desde firebaseAdmin)

    // 5. Eliminación de imágenes con manejo avanzado
    let deletedImages = 0;
    const deleteOperations = propiedad.imagenes.map(async (img) => {
      if (!img.path) {
        console.warn(`⚠️ Imagen ID ${img.id} sin path definido`);
        return;
      }

      try {
        // Normalización del path
        const normalizedPath = img.path
          .trim()
          .replace(/^\//, '') // Eliminar slash inicial
          .replace(/%20/g, ' ') // Decodificar espacios
          .replace(/\/+/g, '/'); // Normalizar múltiples slashes

        const file = bucket.file(normalizedPath);
        const [exists] = await file.exists();

        if (exists) {
          await file.delete();
          console.log(`✅ Imagen eliminada: ${normalizedPath}`);
          deletedImages++;
        } else {
          // Búsqueda insensible a mayúsculas/minúsculas
          const fileName = normalizedPath.split('/').pop();
          const [files] = await bucket.getFiles({
            prefix: 'photos/'
          });
          
          const matchingFile = files.find(f => 
            f.name.toLowerCase().endsWith(fileName.toLowerCase())
          );

          if (matchingFile) {
            await matchingFile.delete();
            console.log(`✅ Imagen encontrada por coincidencia: ${matchingFile.name}`);
            deletedImages++;
          } else {
            console.warn(`⚠️ Imagen no encontrada en Storage: ${normalizedPath}`);
          }
        }
      } catch (error) {
        console.error(`❌ Error al eliminar imagen: ${img.path}`, error.message);
      }
    });

    await Promise.all(deleteOperations);

    // 6. Eliminación en base de datos
    await PropiedadImagen.destroy({ 
      where: { propiedad_id: id }, 
      transaction 
    });
    
    await propiedad.destroy({ transaction });
    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Propiedad eliminada completamente",
      deletedPropertyId: Number(id),
      deletedImages,
      remainingImages: propiedad.imagenes.length - deletedImages
    });

  } catch (error) {
    await transaction.rollback();
    console.error("❌ Error crítico:", error);
    
    return res.status(500).json({
      error: "Error interno del servidor",
      details: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : null
    });
  }
};

const editarPropiedad = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const {
      titulo,
      descripcion,
      direccion,
      precio,
      arrendador_uid,
      imagenes,
      caracteristicas
    } = req.body;

    // Validaciones básicas
    if (!id || isNaN(id)) {
      await transaction.rollback();
      return res.status(400).json({ error: "ID de propiedad inválido" });
    }

    if (!arrendador_uid) {
      await transaction.rollback();
      return res.status(400).json({ error: "Se requiere UID de arrendador" });
    }

    // Buscar y verificar propiedad
    const propiedad = await Propiedad.findByPk(id, { transaction });

    if (!propiedad) {
      await transaction.rollback();
      return res.status(404).json({ error: "Propiedad no encontrada" });
    }

    if (propiedad.arrendador_uid !== arrendador_uid) {
      await transaction.rollback();
      return res.status(403).json({ error: "No autorizado para esta acción" });
    }

    // Actualizar campos básicos
    const updates = {};
    if (titulo) updates.titulo = titulo;
    if (descripcion) updates.descripcion = descripcion;
    if (direccion) updates.direccion = direccion;
    if (precio) updates.precio = precio;

    await propiedad.update(updates, { transaction });

    // Manejo de imágenes (reemplazo completo)
    if (imagenes && Array.isArray(imagenes)) {
      // Eliminar imágenes existentes
      await PropiedadImagen.destroy({
        where: { propiedad_id: id },
        transaction
      });

      // Crear nuevas imágenes
      await PropiedadImagen.bulkCreate(
        imagenes.map((url, index) => ({
          url,
          orden: index,
          propiedad_id: id
        })),
        { transaction }
      );
    }

    // Manejo de características (actualización)
    if (caracteristicas) {
      await CaracteristicaPropiedad.update(caracteristicas, {
        where: { propiedad_id: id },
        transaction
      });
    }

    await transaction.commit();

    // Obtener propiedad actualizada
    const propiedadActualizada = await Propiedad.findByPk(id, {
      include: [
        { model: PropiedadImagen, as: 'imagenes' },
        { model: CaracteristicaPropiedad, as: 'caracteristicas' }
      ]
    });

    return res.status(200).json(propiedadActualizada);

  } catch (error) {
    await transaction.rollback();
    console.error("Error al editar propiedad:", error);

    // Manejar errores de validación de Sequelize
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: "Error de validación",
        details: error.errors.map(e => e.message)
      });
    }

    return res.status(500).json({
      error: "Error al editar propiedad",
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

const getAllPropiedades = async (req, res) => {
  try {
    const propiedades = await Propiedad.findAll({
      include: [
        {
          model: PropiedadImagen,
          as: 'imagenes', // Asegúrate que este alias coincida con la asociación
          attributes: ['url'],
          limit: 1,
          separate: true // Esto puede ayudar con el limit en asociaciones
        }
      ],
      order: [['fecha_creacion', 'DESC']]
    });

    if (!propiedades || propiedades.length === 0) {
      return res.status(404).json({ message: "No se encontraron propiedades" });
    }

    res.status(200).json(propiedades);
  } catch (error) {
    console.error("Error al obtener propiedades:", error);
    res.status(500).json({ 
      error: "Error interno del servidor",
      details: error.message // Agrega esto para más detalles en desarrollo
    });
  }
};

module.exports = {
  crearPropiedad,
  getPropiedadesByArrendador,
  getPublicacion,
  eliminarPropiedad,
  editarPropiedad,
  getAllPropiedades
};
