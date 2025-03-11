'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');

// Configuración de Sequelize
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

// Inicializar conexión de Sequelize
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host: config.host,
      port: config.port,
      dialect: config.dialect,
      logging: config.logging || false,
      pool: config.pool,
      define: {
        timestamps: true,
        underscored: config.underscored || false
      }
    }
  );
}

// Validar conexión a la base de datos
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
    process.exit(1);
  }
})();

// Cargar modelos automáticamente
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && // Ignorar archivos ocultos
      file !== basename && // Ignorar este archivo index.js
      file.slice(-3) === '.js' && // Solo archivos .js
      file.indexOf('.test.js') === -1 // Ignorar archivos de test
    );
  })
  .forEach(file => {
    try {
      const modelPath = path.join(__dirname, file);
      console.log(`Cargando modelo: ${file}`);

      // Verificar si el archivo exporta una función
      const modelModule = require(modelPath);
      if (typeof modelModule !== 'function') {
        throw new Error(`El archivo ${file} no exporta una función válida`);
      }

      // Inicializar modelo
      const model = modelModule(sequelize, Sequelize.DataTypes);
      if (!model || !model.name) {
        throw new Error(`Modelo en ${file} no se inicializó correctamente`);
      }

      console.log(`Modelo cargado: ${model.name}`);
      db[model.name] = model;
    } catch (error) {
      console.error(`Error cargando modelo ${file}:`, error.message);
      process.exit(1);
    }
  });

// Establecer relaciones entre modelos
Object.keys(db).forEach(modelName => {
  try {
    if (typeof db[modelName].associate === 'function') {
      console.log(`Estableciendo asociaciones para: ${modelName}`);
      db[modelName].associate(db);
    }
  } catch (error) {
    console.error(`Error estableciendo asociaciones para ${modelName}:`, error.message);
    process.exit(1);
  }
});

// Exportar instancias
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Sincronización automática (solo para desarrollo)
if (env === 'development') {
  (async () => {
    try {
      await sequelize.sync({ alter: true });
      console.log('Modelos sincronizados con la base de datos');
    } catch (error) {
      console.error('Error sincronizando modelos:', error.message);
    }
  })();
}

module.exports = db;