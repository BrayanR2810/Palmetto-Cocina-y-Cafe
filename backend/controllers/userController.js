const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.obtenerUsuarios = async (req, res) => {
  const usuarios = await User.find({}, '-contraseña');
  res.json(usuarios);
};

exports.crearUsuario = async (req, res) => {
  try {
    console.log("Datos recibidos:", req.body);
    const { nombre, correo, contraseña, perfil } = req.body;
    const nuevoUsuario = new User({ nombre, correo, contraseña, perfil });
    await nuevoUsuario.save();
    res.status(201).json({ mensaje: 'Usuario creado' });
  } catch (error) {
    res.status(400).json({ error: 'Error al crear usuario' });
  }
};

exports.actualizarUsuario = async (req, res) => {
  try {
    const { nombre, correo, contraseña, perfil } = req.body;
    const usuario = await User.findById(req.params.id);
    usuario.nombre = nombre;
    usuario.correo = correo;
    usuario.perfil = perfil;
    if (contraseña) usuario.contraseña = contraseña;
    await usuario.save();
    res.json({ mensaje: 'Usuario actualizado' });
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar usuario' });
  }
};

exports.eliminarUsuario = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ mensaje: 'Usuario eliminado' });
};

exports.loginUsuario = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    const correoLimpio = correo.trim().toLowerCase();
    const usuario = await User.findOne({ correo: correoLimpio });

    if (!usuario) return res.status(404).json({ mensaje: 'Correo no encontrado' });

    const valido = await usuario.compararPassword(contraseña);
    if (!valido) return res.status(401).json({ mensaje: 'Contraseña incorrecta' });

   const token = jwt.sign(
  {
    id: usuario._id,
    nombre: usuario.nombre,
    perfil: usuario.perfil
  },
  process.env.JWT_SECRET,
  { expiresIn: '2h' }
);

    res.json({
      token,
      usuario: {
        nombre: usuario.nombre,
        correo: usuario.correo,
        perfil: usuario.perfil
      }
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};
