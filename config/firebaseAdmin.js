const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Actualiza la ruta si es necesario

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://arrendamientos-80c2a-default-rtdb.firebaseio.com"
});

module.exports = admin;
