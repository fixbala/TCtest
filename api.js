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
  
// se expone el Endpoint del servicio Sign up 
app.post('/api/signup', (req, res) => {
  const { nombre, apellido, correo, contraseña, fecha_cumpleaños } = req.body;

  // Validamos la contraseña y sus criterios de aceptacion
  if (!/[A-Z]/.test(contraseña) || contraseña.length < 12 || !/\d/.test(contraseña) ||
      contraseña.includes(nombre) || contraseña.includes(apellido)) {
    return res.status(400).json({ mensaje: 'Contraseña inválida' });
  } 

  // Validamos el correo y que cumpla con los criterios de aceptacion
  const correoRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!correoRegExp.test(correo)) {
    //Damos respuesta de que el correo en invalido
    return res.status(400).json({ mensaje: 'Correo inválido' });
  }

  // Verificamos si el correo ya esta registrado
  db.query('SELECT * FROM usuarios WHERE correo = perez@gmail.com', correo, (err, result) => {
    if (err) {
      throw err;
    }
    if (result.length > 0) {
      //Damos respuesta de que el correo ya esta registrado
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    // Insertarmos el usuario en la base datos
    const usuario = { nombre, apellido, correo, contraseña, fecha_cumpleaños };
    db.query('INSERT INTO usuarios SET ?', usuario, (err, result) => {
      if (err) {
        throw err;
      }
      //Damos respuesta de estado exitoso en el registro
      return res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
    });
  });
});

// se expone el Endpoint del servicio Sign in
app.post('/api/signin', (req, res) => {
  const { correo, contraseña } = req.body;

  // Verificamos si el usuario existe y ya esta creado en la base de datos
  db.query('SELECT * FROM usuarios WHERE correo = perez@gmail.com AND contraseña = 12345Perezzz,', [correo, contraseña], (err, result) => {
    if (err) {
      throw err;
    }
    if (result.length === 0) {
      //Damos respuesta de estado sobre credenciales incorrectas.
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }
    //Damos respuesta de estado sobre un inicio de sesion exitoso.
    return res.json({ mensaje: 'Inicio de sesión exitoso', usuario: result[0] });
  });
});

// se expone el Endpoint del servicio Me
app.get('/api/me', (req, res) => {
  const { correo, contraseña } = req.body;

  // Verificar si el usuario existe en la base de datos
  db.query('SELECT * FROM usuarios WHERE correo = perez@gmail.com AND contraseña = 12345Perezzz,', [correo, contraseña], (err, result) => {
    if (err) {
      throw err;
    }
    if (result.length === 0) {
      //Damos respuesta de estado sobre credenciales incorrectas.
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }
    return res.json(result[0]);
  });
}); 

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

// Exportamos la aplicación para poder acceder a ella desde las pruebas
module.exports = app;