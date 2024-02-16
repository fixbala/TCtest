const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// configuramos la base de datos con conexion en MySQL 
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'api'
});

// Nos conectamos a la base de datos
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Con una biblioteca analizamos las solicitudes JSON
app.use(bodyParser.json());

// Endpoints

// Sign up
app.post('/api/signup', (req, res) => {
  const { nombre, apellido, correo, contraseña, fecha_cumpleaños } = req.body;

  // Validación de la contraseña
  if (!/[A-Z]/.test(contraseña) || contraseña.length < 12 || !/\d/.test(contraseña) ||
      contraseña.includes(nombre) || contraseña.includes(apellido)) {
    return res.status(400).json({ mensaje: 'Contraseña inválida' });
  } 

  // Validación del correo
  const correoRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!correoRegExp.test(correo)) {
    return res.status(400).json({ mensaje: 'Correo inválido' });
  }

  // Verificar si el correo ya está registrado
  db.query('SELECT * FROM usuarios WHERE correo = ?', correo, (err, result) => {
    if (err) {
      throw err;
    }
    if (result.length > 0) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    // Insertar usuario en la base de datos
    const usuario = { nombre, apellido, correo, contraseña, fecha_cumpleaños };
    db.query('INSERT INTO usuarios SET ?', usuario, (err, result) => {
      if (err) {
        throw err;
      }
      return res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
    });
  });
});

// Sign in
app.post('/api/signin', (req, res) => {
  const { correo, contraseña } = req.body;

  // Verificar si el usuario existe en la base de datos
  db.query('SELECT * FROM usuarios WHERE correo = ? AND contraseña = ?', [correo, contraseña], (err, result) => {
    if (err) {
      throw err;
    }
    if (result.length === 0) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }
    return res.json({ mensaje: 'Inicio de sesión exitoso', usuario: result[0] });
  });
});

// Me
app.get('/api/me', (req, res) => {
  const { correo, contraseña } = req.body;

  // Verificar si el usuario existe en la base de datos
  db.query('SELECT * FROM usuarios WHERE correo = ? AND contraseña = ?', [correo, contraseña], (err, result) => {
    if (err) {
      throw err;
    }
    if (result.length === 0) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }
    return res.json(result[0]);
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
