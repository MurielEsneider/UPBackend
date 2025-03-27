const axios = require('axios');

async function testDelete() {
  const propiedadId = 20;
  const arrendadorUid = "cjULhcpsxCQNkTpjK4GYWmQSzE43";

  try {
    console.log("🚀 Iniciando prueba de eliminación...");
    const response = await axios.delete(`http://localhost:4000/api/propiedades/${propiedadId}`, {
      data: { arrendador_uid: arrendadorUid }
    });
    
    console.log("✅ Éxito:", response.data);
    
    // Verificación adicional
    if (parseInt(response.data.deletedPropertyId) !== propiedadId) {
      console.warn("⚠️ El ID eliminado no coincide con la solicitud");
    }
  } catch (error) {
    console.error("❌ Error completo:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    if (error.response) {
      console.log("📌 Detalles del error:");
      console.log("- Status:", error.response.status);
      console.log("- Data:", error.response.data);
    }
  }
}

testDelete();