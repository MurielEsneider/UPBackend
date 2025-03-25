const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Asegúrate de que la ruta es correcta

serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://arrendamientos-80c2a-default-rtdb.firebaseio.com",
  storageBucket: "arrendamientos-80c2a.appspot.com"
});


const bucket = admin.storage().bucket(); // Inicializar Firebase Storage

module.exports = { admin, bucket };
