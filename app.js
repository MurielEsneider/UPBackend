require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const chalk = require('chalk');
const cors = require('cors');
const path = require('path'); 

const arrendadorRoutes = require('./routes/arrendadorRoutes');
const citasRoutes = require('./routes/citasRoutes');
const reservasRoutes = require('./routes/reservasRoutes');
const notificacionesRoutes = require('./routes/notificacionesRoutes');
const caracteristicasRoutes = require('./routes/característicasController');
const propiedadRoute = require('./routes/propiedadRoute');
const imagenesRoutes = require('./routes/imagesRouter');



const app = express();
app.use(express.json());

// Configurar CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'https://midominio.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Conectar a MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error(chalk.red.bold('🔴 Error de conexión:'), chalk.red(err.message));
  } else {
    console.log(chalk.green.bold('🟢 Conectado a MySQL'));
  }
});


// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Servidor funcionando!');
});

// Rutas de publicaciones y propietarios
app.use('/api', arrendadorRoutes);
app.use('/api', citasRoutes);
app.use('/api', reservasRoutes);
app.use('/api', notificacionesRoutes);
app.use('/api', caracteristicasRoutes);
app.use('/api', propiedadRoute);
app.use('/api', imagenesRoutes);



// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(chalk.blue.bold('🔵 Servidor corriendo en:'), `http://localhost:${PORT}`);
});
