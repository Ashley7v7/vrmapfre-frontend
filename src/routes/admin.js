const express = require('express');
const User = require('../model/User'); // El modelo de tu base de datos para usuarios
const router = express.Router();

// Middleware para verificar que el usuario sea admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Acceso no autorizado' });
};

// Ruta para crear un nuevo usuario
router.post('/create-user', isAdmin, async (req, res) => {
  try {
    const { email, password, role } = req.body;  // Aquí validas los campos

    // Crear el nuevo usuario
    const newUser = new User({
      email,
      password,  // Asegúrate de encriptar el password
      role,  // Deberás asegurarte de que el rol es válido
    });

    await newUser.save();

    res.status(201).json({ message: 'Usuario creado con éxito', user: newUser });
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el usuario', error });
  }
});

module.exports = router;
