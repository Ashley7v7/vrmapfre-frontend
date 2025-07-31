// src/db.js
const { Client } = require('pg');

// Crear un nuevo cliente de PostgreSQL y conectar con la base de datos
const client = new Client({
  user: 'tu_usuario',         // Tu nombre de usuario de PostgreSQL
  host: 'localhost',          // Si tu base de datos está en la misma máquina
  database: 'VRMapfre',       // El nombre de tu base de datos
  password: 'tu_contraseña',  // La contraseña de tu usuario
  port: 5432,                 // Puerto predeterminado de PostgreSQL
});

// Conectar a la base de datos
client.connect()
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
  })
  .catch((err) => {
    console.error('Error al conectar a la base de datos', err.stack);
  });

module.exports = client;
