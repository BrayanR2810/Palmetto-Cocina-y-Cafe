const Plato = require('../models/plato');

// Obtener todos los platos
exports.obtenerPlatos = async (req, res) => {
  const platos = await Plato.find();
  res.json(platos);
};

// Crear nuevo plato
exports.crearPlato = async (req, res) => {
  try {
    const { nombre, descripcion, precioMin, precioMax, imagen, categoria } = req.body;

    // Validación manual para mayor claridad
    if (!nombre || !descripcion || !precioMin || !imagen || !categoria) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const nuevoPlato = new Plato({
      nombre,
      descripcion,
      precioMin: parseFloat(precioMin),
      precioMax: precioMax ? parseFloat(precioMax) : undefined,
      imagen,
      categoria
    });

    await nuevoPlato.save();
    res.status(201).json({ mensaje: "Plato creado exitosamente" });

  } catch (err) {
    console.error("❌ Error al crear plato:", err); // 👈 Imprime en consola
    res.status(500).json({ error: err.message || "Error interno del servidor" });
  }
};


// Actualizar un plato
exports.actualizarPlato = async (req, res) => {
  const { nombre, descripcion, precioMin, precioMax, imagen, categoria } = req.body;

  try {
    const plato = await Plato.findById(req.params.id);
    if (!plato) return res.status(404).json({ error: "Plato no encontrado" });

    plato.nombre = nombre || plato.nombre;
    plato.descripcion = descripcion || plato.descripcion;
    plato.precioMin = parseFloat(precioMin) || plato.precioMin;
    plato.precioMax = parseFloat(precioMax) || undefined;
    plato.imagen = imagen || plato.imagen;
    plato.categoria = categoria || plato.categoria;

    await plato.save();
    res.json({ mensaje: "Plato actualizado" });
  } catch (err) {
    console.error("Error al actualizar plato:", err);
    res.status(400).json({ error: "Error al actualizar el plato" });
  }
};

// Eliminar un plato (solo administrador)
exports.eliminarPlato = async (req, res) => {
  const perfil = req.usuario?.perfil;

  if (perfil !== "Administrador") {
    return res.status(403).json({ error: "No tienes permiso para eliminar platos" });
  }

  try {
    await Plato.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Plato eliminado correctamente" });
  } catch (err) {
    res.status(400).json({ error: "Error al eliminar el plato" });
  }
};
