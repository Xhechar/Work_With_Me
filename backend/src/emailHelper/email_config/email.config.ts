import { MailConfigurations, MessageOptions } from "../../interfaces/interfaces";
import nodemailer from 'nodemailer'

const mailConfigurations: MailConfigurations = ({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  requireTLS: true,
  auth: {
    user: process.env.MAIL_USER as string,
    pass: process.env.MAIL_PASS as string
  }
});

export default mailConfigurations;

export const createTransporter = (configurations: MailConfigurations) => nodemailer.createTransport(configurations);

export const sendMail = async (messageOptions: MessageOptions) => {
  
  const transporter = createTransporter(mailConfigurations);

  await transporter.verify();

  transporter.sendMail(messageOptions, (err, data) => {
    if (err) {
      console.error('Error occurred:', err);
    } else {
      console.log(data.response);
    }
  });
}