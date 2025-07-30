// src/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const client = require('./db');  // Aquí importas tu conexión a PostgreSQL
const router = express.Router();

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  const { correo, password } = req.body;

  try {
    // Buscar usuario por correo en la tabla correcta
    const result = await client.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ mensaje: 'Usuario no encontrado' });
    }

    // Comparar contraseñas sin encriptar
    if (user.password !== password) {
      return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Generar el token JWT
    const token = jwt.sign(
      { userId: user.id, rol: user.rol },
      'tu_clave_secreta', // ⚡ Importante: luego pon esta clave secreta en tu .env
      { expiresIn: '1h' }
    );

    // Devolver éxito
    res.json({
      mensaje: `Bienvenido, ${user.rol}`,
      token: token,
      rol: user.rol,
      nombre: user.nombre
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

module.exports = router;
