const express = require("express");
const router = express.Router();
const { verificarToken } = require("../middlewares/authMiddleware");
const Plato = require("../models/plato");
const upload = require("../middlewares/multerConfig");

// Obtener todos los platos (PÚBLICO)
router.get("/", async (req, res) => {
  try {
    const platos = await Plato.find();
    res.json(platos);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener platos" });
  }
});

// Crear nuevo plato (Admin y Coadmin)

router.post("/", verificarToken, upload.single("imagen"), async (req, res) => {
  const { nombre, descripcion, precioMin, precioMax } = req.body;
  const categoria = (req.body.categoria || "otros").toLowerCase().trim();
  const { perfil } = req.usuario;

  if (perfil !== "Administrador" && perfil !== "Coadministrador") {
    return res.status(403).json({ error: "No autorizado" });
  }

  let imagenFinal = null;

  if (req.file) {
    const base64Img = req.file.buffer.toString("base64");
    const mime = req.file.mimetype;
    imagenFinal = `data:${mime};base64,${base64Img}`;
  } else {
    return res.status(400).json({ error: "La imagen es obligatoria" });
  }

  try {
    const nuevoPlato = new Plato({
      nombre,
      descripcion,
      precioMin: parseFloat(precioMin),
      precioMax: precioMax ? parseFloat(precioMax) : undefined,
      imagen: imagenFinal,
      categoria
    });

    await nuevoPlato.save();
    res.status(201).json({ mensaje: "Plato creado correctamente" });
  } catch (error) {
    console.error("Error detallado al guardar plato:", error);
    res.status(400).json({ error: "Error al guardar el plato" });
  }
});


// Actualizar plato (Admin y Coadmin)
router.put("/:id", verificarToken, upload.single("imagen"), async (req, res) => {
  const { nombre, descripcion, precioMin, precioMax } = req.body;
  const categoria = req.body.categoria || "otros";
  const { perfil } = req.usuario;

  if (perfil !== "Administrador" && perfil !== "Coadministrador") {
    return res.status(403).json({ error: "No autorizado" });
  }

  try {
    const plato = await Plato.findById(req.params.id);
    if (!plato) return res.status(404).json({ error: "Plato no encontrado" });

    plato.nombre = nombre;
    plato.descripcion = descripcion;
    plato.precioMin = parseFloat(precioMin);
    plato.precioMax = precioMax ? parseFloat(precioMax) : undefined;
    plato.categoria = categoria;

    if (req.file) {
      const base64Img = req.file.buffer.toString("base64");
      const mime = req.file.mimetype;
      plato.imagen = `data:${mime};base64,${base64Img}`;
    }

    await plato.save();
    res.json({ mensaje: "Plato actualizado correctamente" });
  } catch (err) {
    console.error("Error actualizando plato:", err);
    res.status(400).json({ error: "Error al actualizar el plato" });
  }
});

// Eliminar plato (solo Admin)
router.delete("/:id", verificarToken, async (req, res) => {
  const { perfil } = req.usuario;

  if (perfil !== "Administrador") {
    return res.status(403).json({ error: "No tienes permiso para eliminar platos" });
  }

  try {
    await Plato.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Plato eliminado correctamente" });
  } catch (err) {
    res.status(400).json({ error: "Error al eliminar el plato" });
  }
});

module.exports = router;
