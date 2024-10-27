const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const db = require('./data-base'); 
const bcrypt = require('bcrypt');
require('dotenv').config(); // Para cargar las variables de entorno

const app = express();
const PORT = process.env.PORT || 3000;
const SALT_ROUNDS = 10; // Nivel de seguridad del hash

app.use(cors());
app.use(bodyParser.json());

// Endpoint para recuperar contraseña
app.post('/api/recuperar-contrasena', (req, res) => {
  console.log('Datos entrantes:', req.body); // Depuración

  if (typeof req.body !== 'object' || !req.body.email) {
    console.error('Los datos deben ser un objeto con un email');
    return res.status(400).send('Error en el formato de los datos');
  }

  const { email } = req.body;

  // Verificar si el email está registrado
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).send('Error en el servidor');
    }

    if (results.length === 0) {
      return res.status(404).send('Email no registrado');
    }

    // Si el email está registrado, enviar un correo con el enlace de recuperación
    enviarCorreoRecuperacion(email);
    res.status(200).send('Correo de recuperación enviado');
  });
});

// Función para enviar correo de recuperación
const enviarCorreoRecuperacion = (email) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Usa las variables de entorno
      pass: process.env.EMAIL_PASS // Usa las variables de entorno
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Recuperación de Contraseña',
    text: 'Haz clic en el siguiente enlace para restablecer tu contraseña: http://localhost:3000/restablecer-contrasena'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error al enviar el correo:', error);
    } else {
      console.log('Correo enviado:', info.response);
    }
  });
};

// Endpoint para restablecer la contraseña
app.post('/api/restablecer-contrasena', (req, res) => {
  console.log('Datos entrantes:', req.body); // Depuración

  if (typeof req.body !== 'object' || !req.body.email || !req.body.nuevaContrasena) {
    console.error('Los datos deben ser un objeto con un email y nuevaContrasena');
    return res.status(400).send('Error en el formato de los datos');
  }

  const { email, nuevaContrasena } = req.body;

  // Encriptar la nueva contraseña
  bcrypt.hash(nuevaContrasena, SALT_ROUNDS, (err, hash) => {
    if (err) {
      console.error('Error al encriptar la contraseña:', err);
      return res.status(500).send('Error en el servidor');
    }

    // Actualizar la contraseña en la base de datos
    db.query('UPDATE users SET password = ? WHERE email = ?', [hash, email], (err, results) => {
      if (err) {
        console.error('Error al actualizar la contraseña:', err);
        return res.status(500).send('Error en el servidor');
      }

      if (results.affectedRows === 0) {
        return res.status(404).send('Email no registrado');
      }

      res.status(200).send('Contraseña restablecida con éxito');
    });
  });
});

// Endpoint para obtener todos los usuarios
app.get('/api/users', (req, res) => {
  db.query('SELECT id, email FROM users', (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).send('Error en el servidor');
    }
    res.status(200).json(results);
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});