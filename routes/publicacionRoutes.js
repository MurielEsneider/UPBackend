const express = require('express');
const router = express.Router();
const publicacionesController = require('../controllers/publicacionesController');

// Obtener todas las publicaciones
router.get('/publicaciones', publicacionesController.obtenerPropiedades);

// Crear una nueva publicación
router.post('/publicaciones', publicacionesController.crearPropiedad);

// Eliminar una publicación por ID
router.delete('/publicaciones/:id', publicacionesController.eliminarPropiedad);

// Obtener una publicación por ID
router.get('/publicaciones/:id', publicacionesController.obtenerPublicacionPorId);

module.exports = router;
