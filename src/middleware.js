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

// Middleware para verificar el rol
const verifyRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ mensaje: 'Acceso denegado. Rol no autorizado' });
    }
    next();
  };
};

module.exports = { verifyToken, verifyRole };
