const multer = require("multer");

// Usaremos almacenamiento en memoria para obtener el buffer (para convertir a base64)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // máximo 5MB
  }
});

module.exports = upload;
