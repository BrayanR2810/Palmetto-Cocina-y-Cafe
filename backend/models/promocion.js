const mongoose = require('mongoose');

const promocionSchema = new mongoose.Schema({
  imagen: {
    type: String,
    required: true
  },
  creadoEn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Promocion', promocionSchema);
