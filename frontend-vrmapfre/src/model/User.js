const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener todos los ingenieros registrados
router.get('/ingenieros', async (req, res) => {
  try {
    const ingenieros = await prisma.usuario.findMany({
      where: { rol: 'administrador' }, // 👈 el valor que tienes en la BD
      select: { nombre: true, correo: true }
    });

    res.json(ingenieros);
  } catch (err) {
    console.error('❌ Error al obtener ingenieros:', err);
    res.status(500).json({ error: 'Error al obtener ingenieros' });
  }
});

module.exports = router;
