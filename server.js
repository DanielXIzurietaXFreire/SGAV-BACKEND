const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const db = require('./data-base'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
require('dotenv').config(); // Para cargar las variables de entorno

const app = express();
const PORT = process.env.PORT || 3000;
const SALT_ROUNDS = 10; // Nivel de seguridad del hash

app.use(cors());
app.use(bodyParser.json());

// Endpoint para restablecer la contraseña
app.post('/api/restablecer-contrasena', (req, res) => {
  console.log('Datos entrantes:', req.body); // Depuración

  const { email, nuevaContrasena } = req.body;

  // Verificar que el email y la nueva contraseña estén presentes
  if (!email || !nuevaContrasena) {
    return res.status(400).json({ message: 'Error en el formato de los datos' });
  }

  // Encriptar la nueva contraseña
  bcrypt.hash(nuevaContrasena, SALT_ROUNDS, (err, hash) => {
    if (err) {
      console.error('Error al encriptar la contraseña:', err);
      return res.status(500).json({ message: 'Error en el servidor' });
    }

    // Actualizar la contraseña en la base de datos
    db.query('UPDATE users SET password = ? WHERE email = ?', [hash, email], (err, results) => {
      if (err) {
        console.error('Error al actualizar la contraseña:', err);
        return res.status(500).json({ message: 'Error en el servidor' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Email no registrado' });
      }

      res.status(200).json({ message: 'Contraseña restablecida con éxito' });
    });
  });
});

// Endpoint para obtener todos los usuarios
app.get('/api/users', (req, res) => {
  db.query('SELECT id, email FROM users', (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
    res.status(200).json(results);
  });
});

// Endpoint para obtener todos los vehículos disponibles
app.get('/api/vehicles', (req, res) => {
  db.query('SELECT id, brand, model, license_plate, rental_rate, status, driver_name, driver_age, driver_image, vehicle_image FROM vehicles WHERE available = 1', (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).send('Error en el servidor');
    }
    res.status(200).json(results);
  });
});

// Endpoint para agregar un nuevo vehículo
app.post('/api/vehicles', (req, res) => {
  const { brand, model, license_plate, rental_rate, driver_name, driver_age, driver_image, vehicle_image } = req.body;

  // Verificar que todos los campos requeridos estén presentes
  if (!brand || !model || !license_plate || !rental_rate || !driver_name || !driver_age || !driver_image || !vehicle_image) {
    return res.status(400).send('Todos los campos son requeridos');
  }

  db.query('INSERT INTO vehicles (brand, model, license_plate, rental_rate, status, driver_name, driver_age, driver_image, vehicle_image, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [brand, model, license_plate, rental_rate, 'Available', driver_name, driver_age, driver_image, vehicle_image, true], (err, results) => {
      if (err) {
        console.error('Error al insertar el vehículo:', err);
        return res.status(500).send('Error en el servidor');
      }
      res.status(201).json({ id: results.insertId, brand, model, license_plate, rental_rate, status: 'Available', driver_name, driver_age, driver_image, vehicle_image });
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
