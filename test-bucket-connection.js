// test-bucket-connection.js
const admin = require('firebase-admin');
const serviceAccount = require('./config/serviceAccountKey.json'); // Asegúrate de que la ruta sea correcta

// Configuración de Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "arrendamientos-80c2a.firebasestorage.app" // ¡Usa el nombre correcto de tu bucket!
});

const bucket = admin.storage().bucket();

// Prueba 1: Verificar si el bucket existe
bucket.exists()
  .then(([exists]) => {
    console.log(`✅ El bucket "${bucket.name}" existe:`, exists);
    
    if (exists) {
      // Prueba 2: Listar archivos en el bucket (opcional)
      return bucket.getFiles({ prefix: 'photos/' });
    } else {
      throw new Error(`El bucket ${bucket.name} no existe. Verifica el nombre en Firebase Console.`);
    }
  })
  .then(([files]) => {
    if (files) {
      console.log("📂 Archivos encontrados en el bucket:");
      files.forEach(file => console.log(`- ${file.name}`));
    }
  })
  .catch(error => {
    console.error("❌ Error al conectar con Firebase Storage:", error.message);
    console.log("Posibles soluciones:");
    console.log("1. Verifica que el nombre del bucket coincida con Firebase Console.");
    console.log("2. Asegúrate de que serviceAccountKey.json tenga permisos de Storage.");
    console.log("3. Revisa la conexión a internet o configuración de red.");
  });