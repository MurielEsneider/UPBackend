'use strict';
const { Notificacion } = require('../models');

const crearNotificacion = async (req, res) => {
    try {
        const { titulo, mensaje, usuario_id, arrendador_uid, leida } = req.body;
        const nuevaNotificacion = await Notificacion.create({
            titulo,
            mensaje,
            usuario_id,
            arrendador_uid,
            leida
        });
        res.status(201).json(nuevaNotificacion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtenerNotificaciones = async (req, res) => {
    try {
        const notificaciones = await Notificacion.findAll();
        res.status(200).json(notificaciones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtenerNotificacionPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const notificacion = await Notificacion.findByPk(id);
        
        if (!notificacion) {
            return res.status(404).json({ error: 'Notificación no encontrada' });
        }
        
        res.status(200).json(notificacion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const actualizarNotificacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, mensaje, leida } = req.body;
        const notificacion = await Notificacion.findByPk(id);

        if (!notificacion) {
            return res.status(404).json({ error: 'Notificación no encontrada' });
        }

        await notificacion.update({ titulo, mensaje, leida });
        res.status(200).json(notificacion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const eliminarNotificacion = async (req, res) => {
    try {
        const { id } = req.params;
        const notificacion = await Notificacion.findByPk(id);

        if (!notificacion) {
            return res.status(404).json({ error: 'Notificación no encontrada' });
        }

        await notificacion.destroy();
        res.status(204).json({ message: 'Notificación eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    crearNotificacion,
    obtenerNotificaciones,
    obtenerNotificacionPorId,
    actualizarNotificacion,
    eliminarNotificacion
};