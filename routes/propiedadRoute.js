'use strict';
const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propiedadController');

// Ruta para crear propiedad con sus características e imágenes
router.post('/propiedades', propertyController.crearPropiedad);
router.get('/propiedades/:arrendador_uid', propertyController.getPropiedadesByArrendador);
router.get('/propiedades/:id', propertyController.getPublicacion);

module.exports = router;
