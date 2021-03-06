import {
  emailAuthPassword,
  emailAuthUser,
  emailService,
} from '../config/mail_sender';

import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  service: emailService,
  auth: {
    user: emailAuthUser,
    pass: emailAuthPassword,
  },
});

export const buildMessage = (userEmail, subject) => {
  return {
    from: emailAuthUser,
    to: userEmail,
    subject: subject,
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
