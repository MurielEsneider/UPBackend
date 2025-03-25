const { Propiedad, PropiedadImagen, CaracteristicaPropiedad } = require('../models');
const { sequelize } = require('../models');
const { bucket } = require('../config/firebaseAdmin'); // Importa el bucket para Firebase Storage

const crearPropiedad = async (req, res) => {
  console.log("Iniciando creación de propiedad...");

  try {
    const { titulo, descripcion, direccion, precio, arrendador_uid, imagenes } = req.body;

    console.log("Datos recibidos en la solicitud:", {
      titulo,
      descripcion,
      direccion,
      precio,
      arrendador_uid,
      imagenes
    });

    // Validar que los datos requeridos estén presentes
    if (!titulo || !direccion || !precio || !arrendador_uid) {
      console.error("Faltan datos requeridos en la solicitud.");
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    console.log("Creando propiedad en la base de datos...");
    const nuevaPropiedad = await Propiedad.create({
      titulo,
      descripcion,
      direccion,
      precio,
      arrendador_uid
    });

    // Si se envía un array de imágenes, creamos los registros asociados
    if (imagenes && Array.isArray(imagenes) && imagenes.length > 0) {
      for (let i = 0; i < imagenes.length; i++) {
        await PropiedadImagen.create({
          url: imagenes[i], // Se espera que 'imagenes[i]' sea el path original, ej.: "photos/1645734567890-image.jpg"
          orden: i, // El orden puede ser útil para definir cuál es la imagen principal o el orden de despliegue
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

    // Validar ID
    if (!id || isNaN(id)) {
      await transaction.rollback();
      return res.status(400).json({ error: "ID de propiedad inválido" });
    }

    // Buscar propiedad
    const propiedad = await Propiedad.findByPk(id, { transaction });

    if (!propiedad) {
      await transaction.rollback();
      return res.status(404).json({ error: "Propiedad no encontrada" });
    }

    // Verificar que el arrendador es el dueño
    if (propiedad.arrendador_uid !== arrendador_uid) {
      await transaction.rollback();
      return res.status(403).json({
        error: "No autorizado para esta acción",
        details: `El arrendador_uid proporcionado (${arrendador_uid}) no coincide con el dueño de la propiedad (${propiedad.arrendador_uid})`
      });
    }

    // Eliminar imágenes asociadas en Firebase Storage
    // Primero, obtenemos todas las imágenes asociadas a la propiedad
    // Eliminar imágenes asociadas en Firebase Storage
    const imagenes = await PropiedadImagen.findAll({
      where: { propiedad_id: id },
      transaction
    });

    for (const img of imagenes) {
      if (img.path) {
        console.log("Intentando eliminar imagen con path:", img.path);
        try {
          await bucket.file(img.path).delete();
          console.log(`Imagen eliminada: ${img.path}`);
        } catch (error) {
          console.error("Error al eliminar imagen en Firebase Storage:", img.path, error);
          // Aquí podrías retornar el error o continuar
        }
      } else {
        console.log("No se encontró el campo 'path' para esta imagen, id:", img.id);
      }
    }
    


    // Eliminar propiedad
    await propiedad.destroy({ transaction });
    await transaction.commit();

    return res.status(200).json({ message: "Propiedad eliminada correctamente" });

  } catch (error) {
    await transaction.rollback();
    console.error("Error al eliminar propiedad:", error);
    return res.status(500).json({
      error: "Error al eliminar propiedad",
      details: process.env.NODE_ENV === 'development' ? error.message : null
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

module.exports = {
  crearPropiedad,
  getPropiedadesByArrendador,
  getPublicacion,
  eliminarPropiedad,
  editarPropiedad
};


