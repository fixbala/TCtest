// Importamos la librería supertest para realizar peticiones HTTP a nuestra API
const request = require('supertest');

// Importamos nuestra aplicación de la API a la que le vamos a realizar el testing
const app = require('./api'); 

// Describimos nuestras pruebas utilizando la función describe de Jest
describe('Pruebas de la API', () => { 
  
  
  let usuarioId;

  // Iniciamos un bloque de pruebas para el endpoint de registro de usuarios
  describe('POST /api/signup', () => {

    // Prueba para verificar que se pueda crear un nuevo usuario correctamente
    it('Debería crear un nuevo usuario', async () => {
      // Hacemos una solicitud HTTP POST al endpoint de registro de usuarios
      const response = await request(app)
        .post('/api/signup')
        // Enviamos los datos del usuario que queremos crear
        .send({
          nombre: 'pepe',
          apellido: 'gomez',
          correo: 'pepe@gmail.com',
          contraseña: 'Prueba123456,',
          fecha_cumpleaños: '1990-01-01'
        });

      // Verificamos que la respuesta tenga el código de estado esperado que es 201: Created
      expect(response.status).toBe(201);
      // Verificamos que el mensaje de la respuesta sea el esperado
      expect(response.body.mensaje).toBe('Usuario registrado exitosamente');
      expect(response.body).toHaveProperty('usuario');
      // Guardamos el ID del usuario
      usuarioId = response.body.usuario.id;
    });

    // Prueba para verificar que no se pueda registrar un usuario con un correo duplicado
    it('Debería devolver un error si se intenta registrar con un correo duplicado', async () => {
      const response = await request(app)
        .post('/api/signup')
        .send({
          nombre: 'ana',
          apellido: 'perez',
          correo: 'ana@gmail.com', // Usamos el mismo correo que en la prueba anterior
          contraseña: 'ana,Contraseña123',
          fecha_cumpleaños: '1990-01-01'
        });

      // Verificamos que la respuesta tenga el código de estado esperado debe ser 400: Bad Request
      expect(response.status).toBe(400);
      // Verificamos que el mensaje de la respuesta sea el esperado
      expect(response.body.mensaje).toBe('El correo ya está registrado');
    });

   
  });

  // Iniciamos un bloque de pruebas para el endpoint de inicio de sesión
  describe('POST /api/signin', () => {
    
    // Prueba para verificar que se pueda iniciar sesión con informacion válida
    it('Debería iniciar sesión con credenciales válidas', async () => {
      const response = await request(app)
        .post('/api/signin')
        .send({
          correo: 'pepe@gmail.com', // Usamos el correo registrado en la prueba anterior
          contraseña: 'Prueba123456,' // Usamos la contraseña del usuario registrado
        });

      // Verificamos que la respuesta tenga el código de estado esperado debe ser 200: OK
      expect(response.status).toBe(200);
      // Verificamos que el mensaje de la respuesta sea el esperado
      expect(response.body.mensaje).toBe('Inicio de sesión exitoso');
      // Verificamos que la respuesta contenga el objeto de usuario autenticado
      expect(response.body).toHaveProperty('usuario');
    });

    // Prueba para verificar que no se pueda iniciar sesión con informacion incorrecta
    it('Debería devolver un error si las credenciales son incorrectas', async () => {
      const response = await request(app)
        .post('/api/signin')
        .send({
          correo: 'pepe@gmail.com', // Usamos el correo registrado en la prueba anterior
          contraseña: 'ContraseñaIncorrecta' // Usamos una contraseña incorrecta
        });

      // Verificamos que la respuesta tenga el código de estado esperado sea 401: Unauthorized
      expect(response.status).toBe(401);
      // Verificamos que el mensaje de la respuesta sea el esperado
      expect(response.body.mensaje).toBe('Credenciales incorrectas');
    });

 
  });

  // Iniciamos un bloque de pruebas para el endpoint de obtener información del usuario autenticado
  describe('GET /api/me', () => {

    // Prueba para verificar que se pueda obtener la información del usuario autenticado
    it('Debería devolver la información del usuario autenticado', async () => {
      const response = await request(app)
        .get('/api/me')
        // Autenticamos la solicitud con las credenciales del usuario registrado
        .auth('pepe@gmail.com', 'Prueba123456,');

      // Verificamos que la respuesta tenga el código de estado esperado 200: OK
      expect(response.status).toBe(200);
      // Verificamos que la respuesta contenga la información del usuario autenticado
      expect(response.body).toHaveProperty('pepe');
      expect(response.body).toHaveProperty('gomez');
      expect(response.body).toHaveProperty('pepe@gmail.com');
      expect(response.body).toHaveProperty('1990-01-01');
      // Verificamos que el ID del usuario coincida con el ID guardado en la prueba de registro
      expect(response.body.id).toBe(usuarioId);
    });

    // Prueba para verificar que no se pueda obtener la información si las credenciales son incorrectas
    it('Debería devolver un error si las credenciales son incorrectas', async () => {
      const response = await request(app)
        .get('/api/me')
        // Enviamos credenciales incorrectas
        .auth('pepe@gmail.com', 'ContraseñaIncorrecta');

      // Verificamos que la respuesta tenga el código de estado esperado sea 401: Unauthorized
      expect(response.status).toBe(401);
      // Verificamos que el mensaje de la respuesta sea el esperado
      expect(response.body.mensaje).toBe('Credenciales incorrectas');
    });

  });
 
});
