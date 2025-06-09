const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  perfil: { type: String, enum: ['Administrador', 'Coadministrador'], default: 'Coadministrador' }
}, { collection: 'usuarios' });

userSchema.pre('save', async function (next) {
  if (!this.isModified('contraseña')) return next();
  this.contraseña = await bcrypt.hash(this.contraseña, 10);
  next();
});

userSchema.methods.compararPassword = function (password) {
  return bcrypt.compare(password, this.contraseña);
};

module.exports = mongoose.model('User', userSchema);
