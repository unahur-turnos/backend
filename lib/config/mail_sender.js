export const mailAuthUser = process.env.MAIL_AUTH_USER;
export const mailAuthPassword = process.env.MAIL_AUTH_PASSWORD;

export const asuntoRegistro = 'Bienvenido a Turnos - UNaHur';
export const templateRegistro = `<img src="cid:templateRegistro"/>`;
export const attachmentsRegistro = [
  {
    filename: 'Bienvenida.png',
    path: 'lib/assets/templateRegistro.png',
    cid: 'templateRegistro',
  },
];
