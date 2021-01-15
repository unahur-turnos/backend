import { response } from 'express';
import bcrypt from 'bcryptjs';
import Usuario from '../models/usuario';

export const index = async (req, res = response) => {
  const data = await Usuario.findAll({});
  res.send({ data });
};

export const registroUsuario = async (req, res) => {
  const usuario = req.body;
  const { dni, contrasenia, email } = usuario;

  const dniEnUso = (await Usuario.findOne({ where: { dni: dni } })) != null;
  const emailEnUso =
    (await Usuario.findOne({ where: { email: email } })) != null;

  if (dniEnUso || emailEnUso) {
    return res.status(400).json({
      msg: 'El dni o email ya están en uso, por favor use otros.',
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

export const loginUsuario = async (req, res = response) => {
  return res.status(200);
};
