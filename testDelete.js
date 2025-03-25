const { bucket } = require('./config/firebaseAdmin'); // Importa el bucket para Firebase Storage


async function testDelete() {
  const filePath = 'photos/1742892403458-CAP GTA2.png'; // Ajusta a un archivo que sepas que existe
  try {
    await bucket.file(filePath).delete();
    console.log('Archivo eliminado correctamente:', filePath);
  } catch (error) {
    console.error('Error eliminando archivo:', filePath, error);
  }
}

testDelete();
