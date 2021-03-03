import Usuario from '../lib/models/usuario';

export const usuarioDePrueba = ({ dni, ...params }) =>
  Usuario.create({
    nombre: 'Usuario',
    apellido: 'Prueba',
    contrasenia: '1234',
    dni,
    telefono: 1,
    email: `usuario_${dni}@gmail.com`,
    rol: 'asistente',
    ...params,
  });
