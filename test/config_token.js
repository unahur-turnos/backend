import Usuario from '../lib/models/usuario';
import app from '../lib/app';
import request from 'supertest';

export const getToken = async () => {
  const usuario = {
    nombre: 'Usuario',
    apellido: 'Prueba',
    contrasenia: '1234',
    dni: 1,
    telefono: 1,
    email: 'usuario@gmail.com',
    rol: 'invitado',
  };

  await Usuario.create(usuario);

  const response = await request(app).post('/api/usuarios/login').send({
    dni: usuario.dni,
    contrasenia: usuario.contrasenia,
  });

  return response.body.token;
};
