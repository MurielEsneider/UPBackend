'use strict';
const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propiedadController');

// Ruta para crear propiedad con sus características e imágenes
router.post('/propiedades', propertyController.crearPropiedad);
router.get('/propiedades/arrendador/:arrendador_uid', propertyController.getPropiedadesByArrendador);
// Obtiene una publicación específica (propiedad) por su ID:
router.get('/propiedades/publicacion/:id', propertyController.getPublicacion);
router.delete('/propiedades/:id', propertyController.eliminarPropiedad);    
router.get('/alojamientos', propertyController.getAllPropiedades);
router.post("/propiedades/:id/vistas", propertyController.incrementarVistas);
router.get("/propiedades/search", propertyController.search);
router.put("/propiedades/edit/:id/", propertyController.editarDatosBasicos);
router.put("/propiedades/editcaracteristicas/:id", propertyController.editarCaracteristicas);
router.put("/propiedades/editimages/:id", propertyController.editarImagenes);

module.exports = router;
