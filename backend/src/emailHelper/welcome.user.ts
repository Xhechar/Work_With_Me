import { PrismaClient } from "@prisma/client";
import { MessageOptions, User } from "../interfaces/interfaces";
import lodash from 'lodash';
import ejs from 'ejs';
import { sendMail } from "./email_config/email.config";
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient({
  log: ['error']
});

export const welcomeUser = async () => {
  const users = await prisma.user.findMany({
    where: {
      isWelcomed: false
    }
  }) as User[];

  if (lodash.isEmpty(users)) {
    console.log('No users found to welcome.');
    return;
  }

  for (let user of users) {
    try {

      ejs.renderFile('', { name: user.fullname.split(' ')[0] }, async(err, html) => {
        if (err) {
          console.error(`Error rendering email template: ${err.message}`);
          return;
        } else {
          
          const messageOptions: MessageOptions = ({
            from: process.env.EMAIL as string,
            to: user.email,
            subject: 'Welcome to WorkWithMe!',
            html: html
          });

          await sendMail(messageOptions);
          
          let change = await prisma.user.update({
            where: {
              user_id: user.user_id
            },
            data: {
              isWelcomed: true
            }
          }) as User;

          if (change.isWelcomed) {
            console.log(`User ${user.fullname} has been welcomed.`);
          } else {
            console.error(`Failed to welcome user ${user.fullname}.`);
          }
        }
      })

    } catch (error) {
      console.error(`Error welcoming user: ${user.email}, Error: ${error}`);
    }
  }
}