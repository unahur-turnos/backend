import Usuario from '../lib/models/usuario';
import app from '../lib/app';
import defaults from 'superagent-defaults';
import supertest from 'supertest';
import { generarJWT } from '../lib/helpers/jwt';

const crearUsuarioDefault = () =>
  Usuario.create({
    nombre: 'Usuario',
    apellido: 'Prueba',
    contrasenia: '1234',
    dni: 1,
    telefono: 1,
    email: 'usuario@gmail.com',
    rol: 'admin',
  });

export const getAuthorizedRequest = async (propietario) => {
  const usuario = propietario || (await crearUsuarioDefault());
  const token = generarJWT(usuario.id, usuario.dni);

  const request = defaults(supertest(app));
  request.set('Authorization', `Bearer ${token}`);

  return { request };
};
