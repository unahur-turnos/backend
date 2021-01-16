import Usuario from '../models/usuario';

export const index = async (req, res) => {
  const data = await Usuario.findAll({});
  res.send({ data });
};

export const registroUsuario = async () => {
  // passport.authenticate('registro', { session: false }),
  //   async (req, res) => {
  //     res.json({
  //       msg: 'Registro correcto',
  //       usuario: req.data,
  //     });
  //   };
};

export const loginUsuario = async (req, res) => {
  return res.status(200);
};
