// routes/ofertas.js
const express = require('express');
const router = express.Router();
const ofertaCtrl = require('../controllers/ofertasController'); // Asegúrate que este nombre coincida con tu archivo

// Rutas para ofertas
router.post('/ofertas', ofertaCtrl.crearOferta);
router.put('/ofertas/:oferta_id/aceptar', ofertaCtrl.aceptarOferta);
router.put('/ofertas/:oferta_id/rechazar', ofertaCtrl.rechazarOferta); 
router.post('/ofertas/:oferta_id/contrapropuesta', ofertaCtrl.crearContrapropuesta); 
router.delete('/ofertas/:oferta_id', ofertaCtrl.eliminarOferta);

router.get('/ofertas', ofertaCtrl.TodasLasOfertas);

router.get('/ofertas/propiedad/:propiedad_id', ofertaCtrl.obtenerOfertasPorPropiedad);
router.get('/ofertas/usuario/:usuario_uid', ofertaCtrl.obtenerOfertasPorUsuario);


module.exports = router;