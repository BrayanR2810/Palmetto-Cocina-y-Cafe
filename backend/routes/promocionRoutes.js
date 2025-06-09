const express = require("express");
const router = express.Router();
const Promocion = require("../models/promocion");
const { verificarToken } = require("../middlewares/authMiddleware");
const upload = require('../middlewares/multerConfig');

// Obtener todas las promociones (público)
router.get("/", async (req, res) => {
  try {
    const promociones = await Promocion.find();
    res.json(promociones);
  } catch {
    res.status(500).json({ error: "Error al obtener promociones" });
  }
});

// Subir nueva promoción (solo Admin y Coadmin)
router.post("/", verificarToken, upload.single("imagen"), async (req, res) => {
  const { perfil } = req.usuario;

  if (perfil !== "Administrador" && perfil !== "Coadministrador") {
    return res.status(403).json({ error: "No autorizado para agregar" });
  }

  try {
    const imagenBase64 = req.file.buffer.toString("base64");
    const nueva = new Promocion({ imagen: imagenBase64 });
    await nueva.save();
    res.status(201).json({ mensaje: "Promoción agregada" });
  } catch (error) {
    res.status(400).json({ error: "Error al agregar promoción" });
  }
});

// Eliminar promoción (solo Admin)
router.delete("/:id", verificarToken, async (req, res) => {
  const { perfil } = req.usuario;

  if (perfil !== "Administrador") {
    return res.status(403).json({ error: "No autorizado para eliminar" });
  }

  try {
    await Promocion.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Promoción eliminada" });
  } catch (error) {
    res.status(400).json({ error: "Error al eliminar promoción" });
  }
});

module.exports = router;

