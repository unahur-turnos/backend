import {
  attachmentsRegistro,
  mailAuthPassword,
  mailAuthUser,
} from '../config/mail_sender';

import nodemailer from 'nodemailer';
import { rollbar } from '../config/rollbar';

export const MailSender = (() => {
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: mailAuthUser,
      pass: mailAuthPassword,
    },
  });

  const buildMessage = (userEmail, subject, html, attachments) => {
    return {
      from: mailAuthUser,
      to: userEmail,
      subject: subject,
      html: html,
      attachments: attachments,
    };
  };

  return {
    sendMail: async (userEmail, subject, html, attachments) => {
      try {
        await transport.sendMail(
          buildMessage(userEmail, subject, html, attachments)
        );
      } catch (e) {
        rollbar.error('Falló el envío de mail', e);
      }
    },
  };
})();
