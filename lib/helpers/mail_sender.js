import { mailAuthPassword, mailAuthUser } from '../config/mail_sender';
import * as HTMLUtils from '../utils/html_utils';
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
    attachments: [
      {
        filename: 'logo.png',
        path: 'lib/assets/isologo-blanco.png',
        cid: 'isologo-blanco',
      },
    ],
  };
};

const getTemplate = async (path, parametros) => {
  return await HTMLUtils.getHTMLFile(`lib/html/${path}.html`, parametros);
};

export const sendMail = async ({
  destinatario,
  asunto,
  template,
  parametros,
}) => {
  const html = await getTemplate(template, parametros);
  try {
    await transport.sendMail(buildMessage(destinatario, asunto, html));
  } catch (e) {
    rollbar.error('Falló el envío de mail', e);
  }
};
