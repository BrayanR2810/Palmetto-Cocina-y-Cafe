const mongoose = require("mongoose");

const platoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  precioMin: { type: Number, required: true },
  precioMax: { type: Number },
  imagen: { type: String, required: true },
  categoria: { type: String, required: true }
});

module.exports = mongoose.model("Plato", platoSchema);
