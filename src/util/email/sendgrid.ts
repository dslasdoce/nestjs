import sgMail from '@sendgrid/mail';
import config from 'config';
import emailTemplates, { TemplateEnum } from './';

sgMail.setApiKey(config.sendgrid.apiKey);
const FROM = config.sendgrid.from;

const sendCode = async (email: string, name: string, code: string) => {
  try {
    const html = emailTemplates.get(TemplateEnum.VERIFICATIONLINK, { code, name });

    const msg = {
      to: email,
      from: FROM,
      subject: 'Verify your account',
      html,
      bcc: [],
    };
    return await sgMail.send(msg);
  } catch (err) {
    console.log('ERROR', err);
  }
};

const sendEmail = async (email: string[], body: string, title: string) => {
  try {
    const msg = {
      to: email,
      from: FROM,
      subject: title,
      html: body,
      bcc: [],
    };
    return await sgMail.send(msg);
  } catch (err) {
    console.log('ERROR', err);
  }
};

export default {
  sendCode,
  sendEmail,
};
