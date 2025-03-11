// routes/publicacionesRoutes.js
const express = require('express');
const router = express.Router();
const publicacionesController = require('../controllers/publicacionesArrendatarioController');

// Obtener todas las publicaciones
router.get('/publicacion', publicacionesController.obtenerPropiedades);
router.post('/publicacion', publicacionesController.crearPropiedad);
router.put('/publicacion/:id', publicacionesController.editarPropiedad);
router.delete('/publicacion/:id', publicacionesController.eliminarPropiedad);
// Obtener una sola publicación por ID
router.get('/publicacion/:id', publicacionesController.obtenerPropiedadId);




module.exports = router;
