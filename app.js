require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const chalk = require('chalk');
const cors = require('cors');
const sharp = require('sharp');
const path = require('path');

// Importar rutas
const publicacionesRoutes = require('./routes/publicacionesArrendatarioRoute');
const arrendatarioRoutes = require('./routes/arrendadorRoutes');

const app = express();
app.use(express.json({ limit: '50mb' }));  // Para manejar datos grandes en requests

// Configuración CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'https://midominio.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
};

app.use(cors(corsOptions));

// Configurar conexión MySQL
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Verificar conexión a la base de datos
db.getConnection((err, connection) => {
  if (err) {
    console.error(chalk.red.bold('‼️ Error de conexión a MySQL:'), err.message);
  } else {
    console.log(chalk.green.bold('✅ Conectado a MySQL'));
    connection.release();
  }
});

// Configurar middleware para imágenes
const helperImg = (filePath, fileName, size = 300) => {
  return sharp(filePath)
    .resize(size)
    .toFormat('webp')
    .toFile(`./optimize/${fileName}-optimized.webp`);
};

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/optimize', express.static(path.join(__dirname, 'optimize')));

// Rutas base
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Bienvenido a la API de Arriendos',
    endpoints: {
      publicaciones: '/api/publicaciones',
      arrendadores: '/api/arrendadores'
    }
  });
});

// Registrar rutas
app.use('/api/publicaciones', publicacionesRoutes);
app.use('/api/arrendadores', arrendatarioRoutes);

// Manejar errores 404
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint no encontrado'
  });
});

// Manejar errores globales
app.use((err, req, res, next) => {
  console.error(chalk.red.bold('‼️ Error:'), err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor'
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 4004;
const server = app.listen(PORT, () => {
  console.log(
    chalk.blue.bold('Servidor ejecutándose en:'),
    chalk.underline.yellow(`http://localhost:${PORT}`)
  );
});

// Manejar cierre limpio
process.on('SIGINT', () => {
  server.close(() => {
    console.log(chalk.red.bold('\n🔴 Servidor detenido'));
    process.exit(0);
  });
});