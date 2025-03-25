const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://arrendamientos-80c2a-default-rtdb.firebaseio.com",
  storageBucket: "arrendamientos-80c2a.firebasestongge.app" // Nombre correcto
});

const bucket = admin.storage().bucket("gs://arrendamientos-80c2a.firebasestongge.app"); // ✨ Corrección

module.exports = { admin, bucket };