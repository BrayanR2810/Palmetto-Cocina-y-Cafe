const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Inicializar app
const app = express();

// Middleware CORS
app.use(cors());

// Aumentar el límite para JSON y formularios grandes (hasta 30MB por ejemplo)
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));

// Rutas
const userRoutes = require('./routes/userRoutes');
app.use('/api/usuarios', userRoutes);

const platoRoutes = require('./routes/platoRoutes');
app.use('/api/platos', platoRoutes);

const promocionesRoutes = require('./routes/promocionRoutes');
app.use('/api/promociones', promocionesRoutes);

// Conexión a la base de datos y arranque del servidor
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(process.env.PORT, () => {
      console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
    });
  })
  .catch(err => console.error('Error en conexión MongoDB', err));
