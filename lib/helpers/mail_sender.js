import { emailPassword, emailService, emailUser } from '../config/mail_sender';

import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  service: emailService,
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
});

export const buildMessage = (userEmail) => {
  return {
    from: emailUser,
    to: userEmail,
    subject: 'Prueba',
    html: '<h1>Este es un correo de prueba</h1>',
  };
};

export const sendEmail = async (message) => {
  try {
    await transport.sendMail(message);
  } catch (e) {
    console.log(e);
  }
};
