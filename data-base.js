const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'vehicle_rental'
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Manejo de errores en el flujo de la conexión
connection.on('error', (err) => {
  console.error('Error en la conexión a la base de datos:', err);
});

module.exports = connection;