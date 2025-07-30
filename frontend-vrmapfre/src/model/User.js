const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Obtener todos los ingenieros registrados
router.get('/ingenieros', async (req, res) => {
  try {
    const ingenieros = await User.find({ role: 'Ingeniero' }, 'email'); // puedes cambiar a 'nombre' si lo agregas
    res.json(ingenieros);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener ingenieros' });
  }
});

module.exports = router;
