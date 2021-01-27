import Usuario from '../lib/models/usuario';
import app from '../lib/app';
import defaults from 'superagent-defaults';
import supertest from 'supertest';

export const getAuthorizedRequest = async () => {
  const usuario = {
    nombre: 'Usuario',
    apellido: 'Prueba',
    contrasenia: '1234',
    dni: 1,
    telefono: 1,
    email: 'usuario@gmail.com',
    rol: 'admin',
  };

  await Usuario.create(usuario);

  const request = defaults(supertest(app));

  const response = await request.post('/api/usuarios/login').send({
    dni: usuario.dni,
    contrasenia: usuario.contrasenia,
  });

  request.set('Authorization', `Bearer ${response.body.token}`);

  return { request };
};
