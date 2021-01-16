import Usuario from '../models/usuario';
import bcrypt from 'bcryptjs';

export const index = async (req, res) => {
  const data = await Usuario.findAll({});
  res.send({ data });
};

export const registroUsuario = async (req, res) => {
  const usuario = req.body;
  const { dni, contrasenia, email } = usuario;

  const existeDNI = await Usuario.findOne({ where: { dni: dni } });
  const existeEmail = await Usuario.findOne({ where: { email: email } });

  if (existeDNI) {
    return res.status(400).send({
      error: 'El dni ya está en uso, por favor utilice otro.',
    });
  }

  if (existeEmail) {
    return res.status(400).send({
      error: 'El email ya está en uso, por favor utilice otro.',
    });
  }

  const salt = bcrypt.genSaltSync();
  const contraseniaEncriptada = bcrypt.hashSync(contrasenia, salt);

  const data = await Usuario.create({
    ...usuario,
    contrasenia: contraseniaEncriptada,
  });

  return res.status(201).send({ data });
};

export const loginUsuario = async (req, res) => {
  return res.status(200);
};
