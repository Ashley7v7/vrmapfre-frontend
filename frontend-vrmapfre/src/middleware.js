const jwt = require('jsonwebtoken');

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado' });
  }

  try {
    const decoded = jwt.verify(token, 'tu_clave_secreta');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ mensaje: 'Token no válido' });
  }
};

module.exports = { verifyToken };

const express = require('express');
const { verifyToken } = require('./middleware');  // Importa el middleware
const app = express();

// Ruta protegida que requiere autenticación
app.get('/ruta-protegida', verifyToken, (req, res) => {
  res.json({ mensaje: 'Acceso autorizado a la ruta protegida' });
});
