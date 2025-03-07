require('dotenv').config();
const { Sequelize } = require('sequelize');

// Importar rutas
const citaRoutes = require('./routes/citasRoutes');
const pagoRoutes = require('./routes/pagosRoutes');

// Conexión a la base de datos usando variables de entorno
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql'
  }
);

// Usar rutas
app.use('/api/citas', citaRoutes);
app.use('/api/pagos', pagoRoutes);


// Probar conexión
sequelize.authenticate()
  .then(() => console.log('✅ Conexión exitosa a MySQL'))
  .catch(err => console.error('❌ Error al conectar a MySQL:', err));

module.exports = sequelize;
