// controllers/propiedadController.js
const { Propiedad, PropiedadImagen, CaracteristicaPropiedad } = require('../models');
const { sequelize } = require('../models');
const { Op } = require('sequelize');
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

// Endpoint para incrementar las vistas
const incrementarVistas = async (req, res) => {
  const { id } = req.params; // id de la propiedad desde la URL
  try {
    // Incrementa el campo 'views' en 1 para la propiedad con ese id
    await Propiedad.increment('views', { by: 1, where: { id } });
    
    // Opcional: obtener el número actualizado de vistas
    const propiedadActualizada = await Propiedad.findByPk(id, {
      attributes: ['views']
    });
    
    return res.status(200).json({ views: propiedadActualizada.views });
  } catch (error) {
    console.error("Error al incrementar vistas:", error);
    return res.status(500).json({ error: 'Error al incrementar vistas' });
  }
};


/**
 * Función que busca propiedades según un término de búsqueda.
 * Se filtra por título y dirección utilizando una búsqueda insensible a mayúsculas/minúsculas.
 */
const search = async (req, res) => {
  const searchQuery = req.query.q || '';
  console.log('Término de búsqueda recibido:', searchQuery); // Verifica el valor

  try {
    const propiedades = await Propiedad.findAll({
      where: {
        [Op.or]: [
          // Búsqueda insensible a mayúsculas/minúsculas para MySQL
          sequelize.where(
            sequelize.fn('LOWER', sequelize.col('titulo')),
            { [Op.like]: `%${searchQuery.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn('LOWER', sequelize.col('direccion')),
            { [Op.like]: `%${searchQuery.toLowerCase()}%` }
          )
        ]
      }
    });

    return res.json({ data: propiedades });
  } catch (error) {
    console.error('Error en el controlador de búsqueda:', error);
    return res.status(500).json({ error: 'Error al realizar la búsqueda' });
  }
};

// controllers/propiedadController.js
const editarDatosBasicos = async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, direccion, precio, arrendador_uid } = req.body;
  const t = await sequelize.transaction();

  try {
    const prop = await Propiedad.findByPk(id, { transaction: t });
    if (!prop) throw { status: 404, message: 'No existe la propiedad' };
    if (prop.arrendador_uid !== arrendador_uid) throw { status: 403, message: 'No autorizado' };

    await prop.update({ titulo, descripcion, direccion, precio }, { transaction: t });
    await t.commit();
    return res.json(prop);

  } catch (err) {
    await t.rollback();
    return res.status(err.status || 500).json({ error: err.message || err });
  }
};


const editarCaracteristicas = async (req, res) => {
  const { id } = req.params;
  const { caracteristicas, arrendador_uid } = req.body;
  const t = await sequelize.transaction();

  try {
    const prop = await Propiedad.findByPk(id, { transaction: t });
    if (!prop) throw { status: 404, message: 'Propiedad no encontrada' };
    if (prop.arrendador_uid !== arrendador_uid) throw { status: 403, message: 'No autorizado' };

    // Destruye y vuelve a crear (simplifica el sync completo)
    await CaracteristicaPropiedad.destroy({ where: { propiedad_id: id }, transaction: t });
    const creaciones = caracteristicas.map(c => ({ 
      ...c, 
      propiedad_id: id 
    }));
    const result = await CaracteristicaPropiedad.bulkCreate(creaciones, { transaction: t });

    await t.commit();
    return res.json(result);

  } catch (err) {
    await t.rollback();
    return res.status(err.status || 500).json({ error: err.message || err });
  }
};

const editarImagenes = async (req, res) => {
  const { id } = req.params;
  const { toDelete = [], newFiles = [] } = req.body; // newFiles: [base64 o buffer]

  const t = await sequelize.transaction();
  try {
    // 1) Borra en Storage y en BD
    await Promise.all(toDelete.map(async imgId => {
      const img = await PropiedadImagen.findByPk(imgId);
      if (!img) return;
      await bucket.file(img.path).delete().catch(() => null);
      await img.destroy({ transaction: t });
    }));

    // 2) Sube nuevas al bucket y crea registros
    const created = [];
    for (let file of newFiles) {
      const { url, path } = await uploadToFirebase(file);
      const img = await PropiedadImagen.create({
        url, 
        path,
        orden: 0,            // si quieres reordenar luego
        propiedad_id: id
      }, { transaction: t });
      created.push(img);
    }

    await t.commit();
    return res.json({ deleted: toDelete.length, added: created.length });

  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(500).json({ error: 'Error al actualizar imágenes' });
  }
};



module.exports = {
  crearPropiedad,
  getPropiedadesByArrendador,
  getPublicacion,
  eliminarPropiedad,
  getAllPropiedades,
  incrementarVistas,
  search,
  editarDatosBasicos,
  editarCaracteristicas,
  editarImagenes
  
};
