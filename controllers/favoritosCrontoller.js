const { Usuario, Propiedad, Favorito } = require('../models');

const favoritoController = {
    // Agregar a favoritos
    agregarFavorito: async (req, res) => {
        try {
            const { usuarioUid, propiedadId } = req.body;

            // Validaciones básicas
            if (!usuarioUid || !propiedadId) {
                return res.status(400).json({ error: 'Datos incompletos' });
            }

            // Verificar existencia
            const usuario = await Usuario.findByPk(usuarioUid);
            const propiedad = await Propiedad.findByPk(propiedadId);
            
            if (!usuario || !propiedad) {
                return res.status(404).json({ error: 'Recurso no encontrado' });
            }

            // Crear relación
            await usuario.addFavorito(propiedad);
            
            res.status(201).json({ mensaje: 'Agregado a favoritos' });

        } catch (error) {
            console.error('Error en agregarFavorito:', error);
            res.status(500).json({ error: 'Error del servidor' });
        }
    },

    // Obtener favoritos de un usuario
    obtenerFavoritos: async (req, res) => {
        try {
            const { usuarioUid } = req.params;

            const usuario = await Usuario.findByPk(usuarioUid, {
                include: {
                    model: Propiedad,
                    as: 'favoritos',
                    through: { attributes: [] } // Excluye datos de la tabla intermedia
                }
            });

            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.json(usuario.favoritos);

        } catch (error) {
            console.error('Error en obtenerFavoritos:', error);
            res.status(500).json({ error: 'Error del servidor' });
        }
    },

    // Eliminar de favoritos
    eliminarFavorito: async (req, res) => {
        try {
            const { usuarioUid, propiedadId } = req.params;

            const usuario = await Usuario.findByPk(usuarioUid);
            const propiedad = await Propiedad.findByPk(propiedadId);
            
            if (!usuario || !propiedad) {
                return res.status(404).json({ error: 'Recurso no encontrado' });
            }

            await usuario.removeFavorito(propiedad);
            
            res.json({ mensaje: 'Eliminado de favoritos' });

        } catch (error) {
            console.error('Error en eliminarFavorito:', error);
            res.status(500).json({ error: 'Error del servidor' });
        }
    }
};

module.exports = favoritoController;