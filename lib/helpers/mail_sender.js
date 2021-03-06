import {
  emailAuthPassword,
  emailAuthUser,
  emailService,
} from '../config/mail_sender';

import nodemailer from 'nodemailer';

export const MailSender = (() => {
  const transport = nodemailer.createTransport({
    service: emailService,
    auth: {
      user: emailAuthUser,
      pass: emailAuthPassword,
    },
  });

  const buildMessage = (userEmail, subject) => {
    return {
      from: emailAuthUser,
      to: userEmail,
      subject: subject,
      html: '<h1>Este es un correo de prueba</h1>',
    };
  };

  return {
    sendMail: async (userEmail, subject) => {
      await transport.sendMail(buildMessage(userEmail, subject));
    },
  };
})();
