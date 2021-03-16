import { mailAuthPassword, mailAuthUser } from '../config/mail_sender';

import nodemailer from 'nodemailer';
import { rollbar } from '../config/rollbar';

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: mailAuthUser,
    pass: mailAuthPassword,
  },
});

const buildMessage = (userEmail, subject, html) => {
  return {
    from: mailAuthUser,
    to: userEmail,
    subject,
    html,
  };
};

export const sendMail = async (userEmail, subject, html) => {
  try {
    await transport.sendMail(buildMessage(userEmail, subject, html));
  } catch (e) {
    rollbar.error('Falló el envío de mail', e);
  }
};
